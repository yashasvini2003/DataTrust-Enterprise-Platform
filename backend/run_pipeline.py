"""Command-line entry point for the sample DataTrust pipeline."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from backend.quality_engine import scan_csv


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description="Profile a CSV, execute quality rules, and persist governance evidence.")
    parser.add_argument("--input", default=ROOT / "data" / "sample_customers.csv", type=Path)
    parser.add_argument("--rules", default=ROOT / "backend" / "config" / "quality_rules.json", type=Path)
    parser.add_argument("--database", default=ROOT / "backend" / "runtime" / "datatrust.db", type=Path)
    args = parser.parse_args()
    result = scan_csv(args.input, args.rules, args.database, ROOT / "backend" / "sql" / "schema.sql")
    report_path = ROOT / "backend" / "runtime" / "latest_scan.json"
    report_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({"scan_id": result["scan_id"], "rows": result["row_count"], "trust_score": result["trust_score"], "report": str(report_path)}, indent=2))


if __name__ == "__main__":
    main()
