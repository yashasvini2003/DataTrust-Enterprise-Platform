# Technical specification

## Objective

Provide one small, defensible example of how an enterprise data team can document metadata, validate source records, trace data movement, and retain evidence for governance reviews.

## Functional scope

- Profile CSV columns for type, nulls, completeness, distinct values, and sample values.
- Execute externalized data-quality rules.
- Calculate rule pass rates and an aggregate trust score.
- Record scan runs, row counts, failed-row evidence, and audit events in SQLite.
- Publish metadata, lineage, profile, report, and scan endpoints through FastAPI.
- Present an interactive React dashboard for data cataloguing, lineage, rules, source-to-target mapping, and reports.

## Non-functional scope

- Synthetic data only; no production secrets or customer records.
- Deterministic local execution.
- Reusable rule configuration separated from pipeline logic.
- Relational constraints and indexes for metadata integrity.
- Responsive and keyboard-accessible interface.
- Automated unit tests and CI validation.

## Quality dimensions

| Dimension | Example control |
| --- | --- |
| Completeness | Required customer identifier and birth date |
| Uniqueness | Customer identifier occurs once |
| Validity | Email matches the approved pattern |
| Accuracy | Credit score is between 300 and 900 |
| Conformity | Province matches Canadian reference codes |

## API contract

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health |
| `GET` | `/api/profile` | Latest column-level profile |
| `GET` | `/api/metadata` | Data dictionary |
| `GET` | `/api/lineage` | Lineage nodes and edges |
| `GET` | `/api/reports/latest` | Latest scan report |
| `POST` | `/api/scans` | Execute the sample scan |
