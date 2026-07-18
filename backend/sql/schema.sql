PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS data_asset (
    asset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_name TEXT NOT NULL UNIQUE,
    domain_name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    classification TEXT NOT NULL CHECK (classification IN ('Public', 'Internal', 'Confidential', 'Restricted')),
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS metadata_column (
    column_id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER NOT NULL REFERENCES data_asset(asset_id),
    column_name TEXT NOT NULL,
    inferred_type TEXT NOT NULL,
    nullable INTEGER NOT NULL CHECK (nullable IN (0, 1)),
    distinct_count INTEGER NOT NULL,
    null_count INTEGER NOT NULL,
    completeness_pct REAL NOT NULL,
    UNIQUE(asset_id, column_name)
);

CREATE TABLE IF NOT EXISTS quality_rule (
    rule_id TEXT PRIMARY KEY,
    rule_name TEXT NOT NULL,
    dimension_name TEXT NOT NULL,
    target_field TEXT NOT NULL,
    rule_expression TEXT NOT NULL,
    severity TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS scan_run (
    scan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER NOT NULL REFERENCES data_asset(asset_id),
    started_at TEXT NOT NULL,
    completed_at TEXT,
    row_count INTEGER NOT NULL,
    rule_count INTEGER NOT NULL,
    trust_score REAL NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rule_result (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_id INTEGER NOT NULL REFERENCES scan_run(scan_id),
    rule_id TEXT NOT NULL,
    status TEXT NOT NULL,
    passed_rows INTEGER NOT NULL,
    failed_rows INTEGER NOT NULL,
    pass_rate REAL NOT NULL,
    evidence_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source_target_mapping (
    mapping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_asset TEXT NOT NULL,
    source_field TEXT NOT NULL,
    transformation_logic TEXT NOT NULL,
    target_asset TEXT NOT NULL,
    target_field TEXT NOT NULL,
    validation_rule_id TEXT,
    version_number TEXT NOT NULL,
    approval_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lineage_edge (
    edge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_node TEXT NOT NULL,
    target_node TEXT NOT NULL,
    process_name TEXT NOT NULL,
    mapping_version TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_event (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_time TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scan_asset_time ON scan_run(asset_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_rule_result_scan ON rule_result(scan_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_event(entity_type, entity_id, event_time DESC);
