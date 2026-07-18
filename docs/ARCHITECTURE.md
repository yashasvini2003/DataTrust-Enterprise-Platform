# DataTrust architecture

DataTrust is split into four deliberately small layers so every part can be discussed and tested independently.

```mermaid
flowchart TD
    A[CSV source data] --> B[Python ingestion and profiling]
    B --> C[Configurable quality-rule engine]
    C --> D[(SQLite metadata repository)]
    C --> E[JSON quality report]
    D --> F[FastAPI services]
    E --> F
    F --> G[React governance dashboard]
```

## Responsibilities

| Layer | Responsibility | Evidence in this repository |
| --- | --- | --- |
| Ingestion | Read source data and preserve row-level evidence | `backend/quality_engine.py` |
| Quality controls | Execute configurable completeness, validity, uniqueness, accuracy, and conformity rules | `backend/config/quality_rules.json` |
| Metadata repository | Store assets, column profiles, scans, results, mappings, lineage, and audit events | `backend/sql/schema.sql` |
| API | Expose profiles, metadata, lineage, latest reports, and scan execution | `backend/api.py` |
| Experience | Present catalog, lineage, rules, mappings, audit history, and quality metrics | `app/page.tsx` |

The included records are synthetic and intentionally contain controlled defects. No real customer or bank data is used.
