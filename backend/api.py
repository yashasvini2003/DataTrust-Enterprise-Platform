"""FastAPI endpoints for profiles, metadata, lineage, and scan execution."""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException

from backend.quality_engine import scan_csv


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "backend" / "runtime"
app = FastAPI(title="DataTrust API", version="1.0.0")


def _read_json(path: Path):
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Run the sample pipeline first; {path.name} does not exist.")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy", "service": "datatrust-api"}


@app.get("/api/profile")
def profile():
    return _read_json(RUNTIME / "latest_scan.json")["profile"]


@app.get("/api/metadata")
def metadata():
    return _read_json(ROOT / "backend" / "metadata" / "data_dictionary.json")


@app.get("/api/lineage")
def lineage():
    return _read_json(ROOT / "backend" / "metadata" / "lineage.json")


@app.get("/api/reports/latest")
def latest_report():
    return _read_json(RUNTIME / "latest_scan.json")


@app.post("/api/scans")
def run_scan():
    return scan_csv(
        ROOT / "data" / "sample_customers.csv",
        ROOT / "backend" / "config" / "quality_rules.json",
        RUNTIME / "datatrust.db",
        ROOT / "backend" / "sql" / "schema.sql",
    )
