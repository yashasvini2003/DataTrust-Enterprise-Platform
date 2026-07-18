# Requirements traceability

| Requirement | Design response | Verification |
| --- | --- | --- |
| Profile structured source data | Pandas profiling produces null, completeness, distinct, type, and sample metadata | `test_profile_detects_blank_customer_id` |
| Apply business and technical quality rules | External JSON rules are evaluated by a reusable rule engine | `test_rules_detect_known_sample_issues` |
| Retain scan evidence | SQLite stores scan runs, pass/fail counts, failed row indexes, and audit events | `test_pipeline_persists_scan_and_report` |
| Maintain data dictionary | JSON metadata documents definition, type, owner, PII, allowed values, and rule links | Manual documentation review |
| Document source-to-target mapping | CSV specification links source, transformation, target, rule, version, and approval | Manual documentation review |
| Show end-to-end data lineage | Node-and-edge lineage file plus dashboard flow | UI interaction test |
| Support governance monitoring | Overview, rule library, audit log, scan history, and report generation views | UI interaction test |
| Automate validation | GitHub Actions runs backend tests and frontend build | CI workflow |
