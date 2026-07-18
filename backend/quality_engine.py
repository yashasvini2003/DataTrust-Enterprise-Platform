"""Reusable profiling and data-quality engine for DataTrust.

The engine intentionally keeps rule definitions outside the code so a data
steward can change business controls without rewriting the pipeline.
"""

from __future__ import annotations

import json
import re
import sqlite3
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


@dataclass(frozen=True)
class RuleResult:
    rule_id: str
    name: str
    dimension: str
    field: str
    status: str
    passed_rows: int
    failed_rows: int
    pass_rate: float
    failed_indices: list[int]


def _non_blank(series: pd.Series) -> pd.Series:
    return series.notna() & series.astype(str).str.strip().ne("")


def profile_dataframe(frame: pd.DataFrame) -> list[dict[str, Any]]:
    """Create column-level technical metadata and profiling statistics."""
    row_count = len(frame)
    profile: list[dict[str, Any]] = []
    for column in frame.columns:
        series = frame[column]
        non_blank = _non_blank(series)
        filled = int(non_blank.sum())
        profile.append(
            {
                "column_name": column,
                "inferred_type": str(series.dtype),
                "nullable": bool(filled < row_count),
                "row_count": row_count,
                "null_count": row_count - filled,
                "completeness_pct": round((filled / row_count * 100) if row_count else 100, 2),
                "distinct_count": int(series[non_blank].nunique(dropna=True)),
                "sample_values": [str(value) for value in series[non_blank].head(3).tolist()],
            }
        )
    return profile


def _evaluate_rule(frame: pd.DataFrame, rule: dict[str, Any]) -> pd.Series:
    field = rule["field"]
    if field not in frame.columns:
        return pd.Series(False, index=frame.index)

    series = frame[field]
    rule_type = rule["type"]
    if rule_type == "required":
        return _non_blank(series)
    if rule_type == "regex":
        pattern = re.compile(rule["pattern"])
        return _non_blank(series) & series.astype(str).map(lambda value: bool(pattern.fullmatch(value.strip())))
    if rule_type == "range":
        numeric = pd.to_numeric(series, errors="coerce")
        return numeric.between(rule["minimum"], rule["maximum"], inclusive="both")
    if rule_type == "unique":
        return _non_blank(series) & ~series.astype(str).duplicated(keep=False)
    if rule_type == "reference":
        allowed = {str(value).upper() for value in rule["allowed_values"]}
        return _non_blank(series) & series.astype(str).str.upper().isin(allowed)
    raise ValueError(f"Unsupported rule type: {rule_type}")


def evaluate_rules(frame: pd.DataFrame, rules: list[dict[str, Any]]) -> list[RuleResult]:
    """Execute configured rules and return auditable row-level evidence."""
    results: list[RuleResult] = []
    for rule in rules:
        mask = _evaluate_rule(frame, rule).fillna(False)
        passed_rows = int(mask.sum())
        failed_indices = [int(index) for index in frame.index[~mask].tolist()]
        failed_rows = len(failed_indices)
        results.append(
            RuleResult(
                rule_id=rule["rule_id"],
                name=rule["name"],
                dimension=rule["dimension"],
                field=rule["field"],
                status="Passed" if failed_rows == 0 else "Failed",
                passed_rows=passed_rows,
                failed_rows=failed_rows,
                pass_rate=round((passed_rows / len(frame) * 100) if len(frame) else 100, 2),
                failed_indices=failed_indices,
            )
        )
    return results


def load_rules(path: str | Path) -> list[dict[str, Any]]:
    return json.loads(Path(path).read_text(encoding="utf-8"))["rules"]


def calculate_trust_score(results: list[RuleResult]) -> float:
    if not results:
        return 100.0
    return round(sum(result.pass_rate for result in results) / len(results), 2)


def initialize_database(connection: sqlite3.Connection, schema_path: str | Path) -> None:
    connection.executescript(Path(schema_path).read_text(encoding="utf-8"))


def persist_scan(
    connection: sqlite3.Connection,
    asset_name: str,
    frame: pd.DataFrame,
    profile: list[dict[str, Any]],
    results: list[RuleResult],
) -> int:
    """Persist a scan, profiling metadata, rule evidence, and audit event."""
    now = datetime.now(timezone.utc).isoformat()
    asset = connection.execute("SELECT asset_id FROM data_asset WHERE asset_name = ?", (asset_name,)).fetchone()
    if asset:
        asset_id = int(asset[0])
    else:
        cursor = connection.execute(
            "INSERT INTO data_asset (asset_name, domain_name, asset_type, owner_name, classification, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (asset_name, "Customer", "Source file", "Customer Data Office", "Restricted", now),
        )
        asset_id = int(cursor.lastrowid)

    connection.execute("DELETE FROM metadata_column WHERE asset_id = ?", (asset_id,))
    connection.executemany(
        "INSERT INTO metadata_column (asset_id, column_name, inferred_type, nullable, distinct_count, null_count, completeness_pct) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [(asset_id, item["column_name"], item["inferred_type"], int(item["nullable"]), item["distinct_count"], item["null_count"], item["completeness_pct"]) for item in profile],
    )

    scan_cursor = connection.execute(
        "INSERT INTO scan_run (asset_id, started_at, completed_at, row_count, rule_count, trust_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (asset_id, now, now, len(frame), len(results), calculate_trust_score(results), "completed"),
    )
    scan_id = int(scan_cursor.lastrowid)
    connection.executemany(
        "INSERT INTO rule_result (scan_id, rule_id, status, passed_rows, failed_rows, pass_rate, evidence_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [(scan_id, result.rule_id, result.status, result.passed_rows, result.failed_rows, result.pass_rate, json.dumps({"failed_indices": result.failed_indices})) for result in results],
    )
    connection.execute(
        "INSERT INTO audit_event (event_time, actor_name, event_type, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)",
        (now, "pipeline", "QUALITY_SCAN_COMPLETED", "scan_run", str(scan_id), f"Evaluated {len(results)} rules against {len(frame)} rows"),
    )
    connection.commit()
    return scan_id


def scan_csv(input_path: str | Path, rules_path: str | Path, database_path: str | Path, schema_path: str | Path) -> dict[str, Any]:
    frame = pd.read_csv(input_path, dtype=str, keep_default_na=False)
    rules = load_rules(rules_path)
    profile = profile_dataframe(frame)
    results = evaluate_rules(frame, rules)
    database = Path(database_path)
    database.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(database) as connection:
        initialize_database(connection, schema_path)
        scan_id = persist_scan(connection, Path(input_path).stem, frame, profile, results)
    return {
        "scan_id": scan_id,
        "asset_name": Path(input_path).stem,
        "row_count": len(frame),
        "trust_score": calculate_trust_score(results),
        "profile": profile,
        "rule_results": [asdict(result) for result in results],
    }
