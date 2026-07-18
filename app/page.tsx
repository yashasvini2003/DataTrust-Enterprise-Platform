"use client";

import { useMemo, useState } from "react";

type IconName =
  | "overview"
  | "catalog"
  | "lineage"
  | "rules"
  | "mapping"
  | "report"
  | "database"
  | "shield"
  | "warning"
  | "bell"
  | "search"
  | "arrow";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    catalog: <><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 0 5 22z"/><path d="M5 4.5v15M9 7h7M9 11h7"/></>,
    lineage: <><circle cx="5" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="M7 5h3a3 3 0 0 1 3 3v1a3 3 0 0 0 3 3h1M7 19h3a3 3 0 0 0 3-3v-1a3 3 0 0 1 3-3h1"/></>,
    rules: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z"/><path d="m9 12 2 2 4-5"/></>,
    mapping: <><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/></>,
    report: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></>,
    warning: <><path d="M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21h-3.4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "overview" },
  { label: "Data Catalog", icon: "catalog" },
  { label: "Lineage", icon: "lineage" },
  { label: "Quality Rules", icon: "rules" },
  { label: "Mappings", icon: "mapping" },
  { label: "Reports", icon: "report" },
];

const initialMetrics = [
  { label: "Trust Score", value: "94.6%", change: "+2.4%", icon: "shield" as IconName, tone: "green" },
  { label: "Data Assets", value: "24", helper: "6 domains", icon: "database" as IconName, tone: "blue" },
  { label: "Quality Rules", value: "18", helper: "15 passing", icon: "rules" as IconName, tone: "cyan" },
  { label: "Critical Issues", value: "3", helper: "Requires action", icon: "warning" as IconName, tone: "amber" },
];

const issues = [
  { issue: "Missing customer birth date", domain: "Customer", source: "Customer 360", detected: "Jul 17, 2026 08:24", impact: "High", status: "Open", owner: "Data Quality Team" },
  { issue: "High null rate in credit_score", domain: "Risk", source: "Risk Warehouse", detected: "Jul 17, 2026 07:56", impact: "High", status: "Open", owner: "Risk Data Team" },
  { issue: "Invalid currency code", domain: "Transactions", source: "Core Banking", detected: "Jul 16, 2026 16:42", impact: "Medium", status: "In progress", owner: "Finance Data Team" },
];

const viewCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  Overview: { eyebrow: "Enterprise data governance", title: "Data Quality Command Center", description: "Monitor trust, lineage, and control effectiveness across critical data domains." },
  "Data Catalog": { eyebrow: "Metadata management", title: "Enterprise Data Catalog", description: "Discover governed assets, business definitions, owners, classifications, and technical metadata." },
  Lineage: { eyebrow: "Traceability & impact", title: "End-to-End Data Lineage", description: "Follow data from source systems through validation, transformation, warehouse, and reporting layers." },
  "Quality Rules": { eyebrow: "Automated controls", title: "Data Quality Rule Engine", description: "Define, execute, and monitor reusable business and technical validation rules." },
  Mappings: { eyebrow: "Integration design", title: "Source-to-Target Mappings", description: "Document field-level transformations, business logic, target schemas, and validation coverage." },
  Reports: { eyebrow: "Evidence & monitoring", title: "Governance Reports", description: "Review scan history, audit events, control evidence, and export-ready quality summaries." },
};

const catalogAssets = [
  { name: "customer_master", domain: "Customer", type: "Curated table", owner: "Customer Data Office", fields: 18, quality: 97, classification: "Restricted" },
  { name: "account_snapshot", domain: "Accounts", type: "Warehouse table", owner: "Core Banking", fields: 24, quality: 95, classification: "Confidential" },
  { name: "transaction_fact", domain: "Transactions", type: "Fact table", owner: "Payments Data", fields: 31, quality: 94, classification: "Confidential" },
  { name: "credit_risk_profile", domain: "Risk", type: "Analytical dataset", owner: "Risk Data Office", fields: 22, quality: 91, classification: "Restricted" },
  { name: "regulatory_summary", domain: "Finance", type: "Reporting view", owner: "Finance Controls", fields: 14, quality: 96, classification: "Internal" },
];

function DetailWorkspace({ view, onNotice }: { view: string; onNotice: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const filteredAssets = catalogAssets.filter((asset) => `${asset.name} ${asset.domain} ${asset.owner}`.toLowerCase().includes(query.toLowerCase()));

  if (view === "Data Catalog") {
    return (
      <div className="detail-stack">
        <section className="detail-toolbar panel">
          <label className="search-field"><Icon name="search" size={18}/><span className="sr-only">Search data catalog</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets, domains, or owners" /></label>
          <div className="toolbar-meta"><span><strong>24</strong> governed assets</span><span><strong>6</strong> data domains</span><button className="secondary-button" onClick={() => onNotice("Metadata extraction queued for three registered source systems.")}>+ Register asset</button></div>
        </section>
        <section className="panel catalog-panel">
          <div className="panel-heading"><div><p className="panel-kicker">Certified inventory</p><h2>Data assets</h2></div><span className="period-chip">{filteredAssets.length} displayed</span></div>
          <div className="table-wrap"><table className="detail-table"><thead><tr><th>Asset</th><th>Domain</th><th>Asset type</th><th>Owner</th><th>Fields</th><th>Quality</th><th>Classification</th></tr></thead><tbody>
            {filteredAssets.map((asset) => <tr key={asset.name} tabIndex={0} onClick={() => onNotice(`${asset.name}: ${asset.fields} fields, ${asset.quality}% trust score, owned by ${asset.owner}.`)}><td><strong>{asset.name}</strong><span className="cell-subtitle">Metadata complete</span></td><td>{asset.domain}</td><td>{asset.type}</td><td>{asset.owner}</td><td>{asset.fields}</td><td><span className={asset.quality > 94 ? "score good" : "score watch"}>{asset.quality}%</span></td><td><span className="classification">{asset.classification}</span></td></tr>)}
          </tbody></table></div>
        </section>
        <section className="split-panels">
          <article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Business metadata</p><h2>Glossary coverage</h2></div><strong className="large-score">92%</strong></div><div className="glossary-list"><span>Customer <i>Approved</i></span><span>Active account <i>Approved</i></span><span>Risk rating <i className="review">In review</i></span></div></article>
          <article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Data stewardship</p><h2>Ownership coverage</h2></div><strong className="large-score">100%</strong></div><div className="ownership-grid"><span>Business owners<strong>6 / 6</strong></span><span>Data stewards<strong>9 / 9</strong></span><span>Technical owners<strong>7 / 7</strong></span></div></article>
        </section>
      </div>
    );
  }

  if (view === "Lineage") {
    return (
      <div className="detail-stack">
        <section className="detail-toolbar panel"><div><span className="toolbar-label">Selected asset</span><strong>regulatory_summary</strong></div><div className="toolbar-meta"><span><strong>6</strong> lineage steps</span><span><strong>12</strong> mapped fields</span><button className="secondary-button" onClick={() => onNotice("Impact analysis completed: two downstream reports depend on this asset.")}>Run impact analysis</button></div></section>
        <section className="panel lineage-canvas">
          <div className="panel-heading"><div><p className="panel-kicker">Field-level traceability</p><h2>Customer risk reporting flow</h2></div><span className="health-chip healthy"><i/>All nodes documented</span></div>
          <div className="expanded-lineage">
            {[
              ["customers.csv", "Source file", "12 fields"], ["DQ validation", "Quality gate", "18 rules"], ["customer_clean", "Standardized", "12 fields"], ["risk_profile", "SQL join", "22 fields"], ["risk_warehouse", "Target table", "1.2M rows"], ["regulatory_summary", "Reporting view", "14 fields"],
            ].map(([name, kind, meta], index, array) => <div className="expanded-node" key={name}><span className="node-number">{String(index + 1).padStart(2, "0")}</span><span className="expanded-icon"><Icon name={index === 1 ? "rules" : index === array.length - 1 ? "report" : "database"} size={22}/></span><span className="node-kind">{kind}</span><strong>{name}</strong><small>{meta}</small>{index < array.length - 1 && <i className="connector"/>}</div>)}
          </div>
        </section>
        <section className="split-panels"><article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Selected field</p><h2>customer_id lineage</h2></div></div><div className="field-path"><code>customer_id</code><span>→</span><code>trim(customer_id)</code><span>→</span><code>customer_key</code></div></article><article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Downstream impact</p><h2>Dependent outputs</h2></div></div><div className="impact-list"><span><Icon name="report" size={17}/> OSFI risk summary <i>Daily</i></span><span><Icon name="report" size={17}/> Executive portfolio view <i>Monthly</i></span></div></article></section>
      </div>
    );
  }

  if (view === "Quality Rules") {
    const rules = [
      ["DQ-CUS-001", "Customer ID must be present", "Completeness", "customer_id IS NOT NULL", "Passed", "100%"],
      ["DQ-CUS-004", "Email must match approved pattern", "Validity", "REGEX(email, approved_pattern)", "Failed", "98.1%"],
      ["DQ-RSK-002", "Credit score must be 300–900", "Accuracy", "credit_score BETWEEN 300 AND 900", "Failed", "96.4%"],
      ["DQ-TRN-007", "Transaction ID must be unique", "Uniqueness", "COUNT(transaction_id) = 1", "Passed", "100%"],
      ["DQ-FIN-003", "Currency code must use ISO 4217", "Conformity", "currency_code IN reference_currency", "Passed", "99.8%"],
    ];
    return <div className="detail-stack"><section className="summary-strip"><span><strong>18</strong> Active rules</span><span><strong>15</strong> Passing</span><span><strong>3</strong> Failing</span><span><strong>6</strong> Dimensions covered</span></section><section className="panel"><div className="panel-heading"><div><p className="panel-kicker">Reusable controls</p><h2>Rule library</h2></div><button className="secondary-button" onClick={() => onNotice("All 18 rules executed. Evidence was added to the audit log.")}>Run all rules</button></div><div className="table-wrap"><table className="detail-table"><thead><tr><th>Rule ID</th><th>Business rule</th><th>Dimension</th><th>Technical expression</th><th>Status</th><th>Pass rate</th></tr></thead><tbody>{rules.map(([id,name,dimension,expression,status,rate]) => <tr key={id} tabIndex={0} onClick={() => onNotice(`${id}: owner Data Quality Team, severity ${status === "Failed" ? "High" : "Standard"}.`)}><td><code>{id}</code></td><td><strong>{name}</strong></td><td>{dimension}</td><td><code className="expression">{expression}</code></td><td><span className={`rule-status ${status.toLowerCase()}`}>{status}</span></td><td>{rate}</td></tr>)}</tbody></table></div></section><section className="split-panels"><article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Coverage by dimension</p><h2>Control coverage</h2></div></div><div className="mini-bars"><span>Completeness <i style={{width:"100%"}}/></span><span>Validity <i style={{width:"88%"}}/></span><span>Uniqueness <i style={{width:"94%"}}/></span><span>Accuracy <i style={{width:"81%"}}/></span></div></article><article className="panel compact-panel"><div className="panel-heading"><div><p className="panel-kicker">Execution schedule</p><h2>Automation</h2></div></div><div className="schedule-list"><span>Customer domain scan <strong>Every 4 hours</strong></span><span>Transaction controls <strong>Hourly</strong></span><span>Regulatory evidence <strong>Daily · 06:00</strong></span></div></article></section></div>;
  }

  if (view === "Mappings") {
    const mappings = [
      ["customer_id", "STRING", "trim + uppercase", "customer_key", "VARCHAR(36)", "DQ-CUS-001"],
      ["full_name", "STRING", "normalize whitespace", "customer_name", "VARCHAR(120)", "DQ-CUS-002"],
      ["email_address", "STRING", "lowercase + regex check", "email", "VARCHAR(254)", "DQ-CUS-004"],
      ["birth_date", "DATE", "ISO-8601 conversion", "date_of_birth", "DATE", "DQ-CUS-006"],
      ["credit_score", "INTEGER", "range validation", "credit_score", "SMALLINT", "DQ-RSK-002"],
      ["province_code", "STRING", "reference-data lookup", "province", "CHAR(2)", "DQ-CUS-009"],
    ];
    return <div className="detail-stack"><section className="mapping-context panel"><div><span>Source system</span><strong>Customer CRM</strong><small>customers.csv</small></div><span className="context-arrow">→</span><div><span>Target system</span><strong>Customer 360</strong><small>customer_master</small></div><div className="mapping-meta"><span>Version<strong>2.3</strong></span><span>Owner<strong>Customer Data Office</strong></span><span>Approval<strong className="approved">Approved</strong></span></div></section><section className="panel"><div className="panel-heading"><div><p className="panel-kicker">Technical specification</p><h2>Field-level source-to-target mapping</h2></div><button className="secondary-button" onClick={() => onNotice("Mapping specification exported as CSV.")}>Export mapping</button></div><div className="table-wrap"><table className="detail-table mapping-table"><thead><tr><th>Source field</th><th>Source type</th><th>Transformation logic</th><th>Target field</th><th>Target type</th><th>Validation rule</th></tr></thead><tbody>{mappings.map((map) => <tr key={map[0]}><td><code>{map[0]}</code></td><td>{map[1]}</td><td><strong>{map[2]}</strong></td><td><code>{map[3]}</code></td><td>{map[4]}</td><td><code className="rule-link">{map[5]}</code></td></tr>)}</tbody></table></div></section><section className="mapping-note"><Icon name="shield" size={19}/><div><strong>Traceability coverage: 100%</strong><span>Every target field is linked to a source field, transformation, and quality rule.</span></div></section></div>;
  }

  return <div className="detail-stack"><section className="report-grid">{[
    ["Executive Quality Summary", "Trust scores, exceptions, and remediation ownership", "PDF", "report" as IconName], ["Data Dictionary", "Business and technical metadata for all registered assets", "XLSX", "catalog" as IconName], ["Source-to-Target Mapping", "Field-level transformations and validation coverage", "CSV", "mapping" as IconName], ["Audit Evidence Package", "Rule results, scan events, approvals, and change history", "ZIP", "shield" as IconName],
  ].map(([name,description,format,icon]) => <article className="report-card panel" key={name as string}><span className="report-icon"><Icon name={icon as IconName} size={25}/></span><div><h2>{name}</h2><p>{description}</p><span>{format}</span></div><button className="secondary-button" onClick={() => onNotice(`${name} generated with the latest validated scan results.`)}>Generate</button></article>)}</section><section className="split-panels reports-split"><article className="panel"><div className="panel-heading"><div><p className="panel-kicker">Operational evidence</p><h2>Recent scan history</h2></div></div><div className="history-list">{[["Jul 17 · 14:32","Customer quality scan","94.6%","3 issues"],["Jul 17 · 10:30","Transaction controls","97.1%","1 issue"],["Jul 17 · 06:00","Regulatory evidence","99.2%","Passed"],["Jul 16 · 22:15","Risk warehouse scan","91.0%","2 issues"]].map(row => <div key={row[0]}><span>{row[0]}</span><strong>{row[1]}</strong><i>{row[2]}</i><em>{row[3]}</em></div>)}</div></article><article className="panel"><div className="panel-heading"><div><p className="panel-kicker">Change history</p><h2>Audit log</h2></div></div><div className="audit-list">{[["14:33","Quality scan completed","System"],["13:52","Rule DQ-CUS-004 updated","A. Chen"],["11:06","customer_master certified","M. Patel"],["09:18","Mapping version 2.3 approved","S. Martin"]].map(row => <div key={row[0]}><span>{row[0]}</span><i/><p><strong>{row[1]}</strong><small>{row[2]}</small></p></div>)}</div></article></section></div>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("Updated 4 minutes ago");
  const [notice, setNotice] = useState<string | null>(null);

  const metrics = useMemo(
    () => scanning
      ? initialMetrics.map((metric) => ({ ...metric, value: metric.label === "Trust Score" ? "Scanning" : "—" }))
      : initialMetrics,
    [scanning],
  );

  function runScan() {
    if (scanning) return;
    setScanning(true);
    setNotice("Quality scan started across 24 data assets.");
    window.setTimeout(() => {
      setScanning(false);
      setLastScan("Updated just now");
      setNotice("Scan complete: 15 of 18 rules passed. Three issues require review.");
    }, 1400);
  }

  function chooseNav(label: string) {
    setActiveNav(label);
    if (label !== "Overview") {
      setNotice(`${label} workspace opened.`);
    }
  }

  const currentView = viewCopy[activeNav] ?? viewCopy.Overview;

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark"><Icon name="database" size={23} /></span>
          <span>DataTrust</span>
        </div>

        <nav className="primary-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={activeNav === item.label ? "nav-item active" : "nav-item"}
              onClick={() => chooseNav(item.label)}
              aria-current={activeNav === item.label ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="system-status">
          <span className="status-check">✓</span>
          <div><strong>All systems operational</strong><span>{lastScan}</span></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumbs"><strong>Enterprise Data</strong><span>/</span><span>{activeNav}</span></div>
          <div className="topbar-actions">
            <label className="environment-select">
              <span className="sr-only">Environment</span>
              <select defaultValue="Production" aria-label="Select environment">
                <option>Production</option>
                <option>Quality assurance</option>
                <option>Development</option>
              </select>
            </label>
            <button className="icon-button notification" aria-label="Notifications"><Icon name="bell" /></button>
            <span className="avatar" aria-label="Signed in as Yashasvini Bhanuraj">YB</span>
          </div>
        </header>

        <div className="content">
          {notice && (
            <div className="toast" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} aria-label="Dismiss notification">×</button>
            </div>
          )}

          <div className="page-heading">
            <div>
              <p className="eyebrow">{currentView.eyebrow}</p>
              <h1>{currentView.title}</h1>
              <p>{currentView.description}</p>
            </div>
            <button className="primary-button" onClick={runScan} disabled={scanning}>
              <span className={scanning ? "scan-dot spinning" : "scan-dot"} />
              {scanning ? "Running scan…" : "Run quality scan"}
            </button>
          </div>

          {activeNav === "Overview" ? <>
          <section className="metric-grid" aria-label="Data quality summary">
            {metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span className={`metric-icon ${metric.tone}`}><Icon name={metric.icon} size={27} /></span>
                <div>
                  <p>{metric.label}</p>
                  <strong className={scanning ? "scanning-value" : ""}>{metric.value}</strong>
                  {metric.change && <span className="metric-change">↑ {metric.change}</span>}
                  {metric.helper && <span className="metric-helper">{metric.helper}</span>}
                </div>
              </article>
            ))}
          </section>

          <section className="insight-grid">
            <article className="panel lineage-panel">
              <div className="panel-heading">
                <div><p className="panel-kicker">Active flow</p><h2>Data lineage health</h2></div>
                <button className="text-button" onClick={() => chooseNav("Lineage")}>Explore lineage <Icon name="arrow" size={15}/></button>
              </div>
              <div className="lineage-flow" aria-label="Core Banking to Regulatory Reports lineage">
                {[
                  { label: "Core Banking", meta: "Source", health: "98%", icon: "database" as IconName, status: "healthy" },
                  { label: "Customer 360", meta: "Curated", health: "96%", icon: "catalog" as IconName, status: "healthy" },
                  { label: "Risk Warehouse", meta: "Warehouse", health: "91%", icon: "database" as IconName, status: "degraded" },
                  { label: "Regulatory Reports", meta: "Output", health: "95%", icon: "report" as IconName, status: "healthy" },
                ].map((node, index, array) => (
                  <div className="lineage-step" key={node.label}>
                    <button className="lineage-node" title={`${node.label}: ${node.health} quality score`}>
                      <span className="node-icon"><Icon name={node.icon} size={24}/></span>
                      <span className="node-meta">{node.meta}</span>
                      <strong>{node.label}</strong>
                    </button>
                    <span className={`health-chip ${node.status}`}><i />{node.status === "healthy" ? "Healthy" : "Degraded"} · {node.health}</span>
                    {index < array.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
              <div className="lineage-legend"><span><i className="healthy"/>Healthy (&gt;95%)</span><span><i className="degraded"/>Degraded (90–94%)</span><span><i className="unhealthy"/>Unhealthy (&lt;90%)</span></div>
            </article>

            <article className="panel domain-panel">
              <div className="panel-heading"><div><p className="panel-kicker">Coverage</p><h2>Quality by domain</h2></div><span className="period-chip">Last 30 days</span></div>
              <div className="domain-bars">
                {[
                  ["Customer", 97, "good"],
                  ["Transactions", 95, "good"],
                  ["Risk", 91, "watch"],
                  ["Finance", 88, "watch"],
                ].map(([label, score, tone]) => (
                  <div className="domain-row" key={label}>
                    <div><span>{label}</span><strong>{score}%</strong></div>
                    <div className="bar-track"><span className={String(tone)} style={{ width: `${score}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="panel issues-panel">
            <div className="panel-heading">
              <div><p className="panel-kicker">Exceptions</p><h2>Critical issues</h2></div>
              <button className="text-button" onClick={() => setNotice("Issue register opened with filters for domain, impact, owner, and status.")}>View all issues <Icon name="arrow" size={15}/></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Issue</th><th>Domain</th><th>Source</th><th>Detected</th><th>Impact</th><th>Status</th><th>Owner</th><th><span className="sr-only">Open</span></th></tr></thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.issue} onClick={() => setNotice(`${issue.issue}: assigned to ${issue.owner}.`)} tabIndex={0}>
                      <td><strong>{issue.issue}</strong></td><td>{issue.domain}</td><td>{issue.source}</td><td>{issue.detected}</td>
                      <td><span className={`impact ${issue.impact.toLowerCase()}`}>{issue.impact}</span></td>
                      <td><span className={`issue-status ${issue.status === "Open" ? "open" : "progress"}`}>{issue.status}</span></td>
                      <td>{issue.owner}</td><td>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          </> : <DetailWorkspace view={activeNav} onNotice={setNotice} />}
        </div>
      </section>
    </main>
  );
}
