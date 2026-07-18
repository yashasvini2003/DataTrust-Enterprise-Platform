from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import pandas as pd

from backend.quality_engine import calculate_trust_score, evaluate_rules, load_rules, profile_dataframe, scan_csv


ROOT = Path(__file__).resolve().parents[2]


class QualityEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.frame = pd.read_csv(ROOT / "data" / "sample_customers.csv", dtype=str, keep_default_na=False)
        self.rules = load_rules(ROOT / "backend" / "config" / "quality_rules.json")

    def test_profile_detects_blank_customer_id(self) -> None:
        profile = {item["column_name"]: item for item in profile_dataframe(self.frame)}
        self.assertEqual(profile["customer_id"]["null_count"], 1)
        self.assertLess(profile["customer_id"]["completeness_pct"], 100)

    def test_rules_detect_known_sample_issues(self) -> None:
        results = {result.rule_id: result for result in evaluate_rules(self.frame, self.rules)}
        self.assertEqual(results["DQ-CUS-001"].failed_rows, 1)
        self.assertEqual(results["DQ-CUS-002"].failed_rows, 3)
        self.assertEqual(results["DQ-CUS-004"].failed_rows, 1)
        self.assertEqual(results["DQ-RSK-002"].failed_rows, 1)
        self.assertEqual(results["DQ-CUS-009"].failed_rows, 1)

    def test_pipeline_persists_scan_and_report(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database = Path(directory) / "datatrust.db"
            result = scan_csv(
                ROOT / "data" / "sample_customers.csv",
                ROOT / "backend" / "config" / "quality_rules.json",
                database,
                ROOT / "backend" / "sql" / "schema.sql",
            )
            self.assertTrue(database.exists())
            self.assertEqual(result["row_count"], 12)
            self.assertEqual(len(result["rule_results"]), 6)
            self.assertEqual(result["trust_score"], calculate_trust_score(evaluate_rules(self.frame, self.rules)))


if __name__ == "__main__":
    unittest.main()
