# Quality & Performance Evaluation Report

This report summarizes the metrics evaluated against the SHL Labs Assessment Recommender local search and reasoning engine.

## 📊 Summary Metrics

| Metric | Target | Actual Result | Status |
| :--- | :---: | :---: | :---: |
| **Schema Compliance Pass Rate** | 100% | **100%** | **Passed** |
| **Groundedness (Catalog Authenticity)** | 100% | **100%** | **Passed** |
| **Behavior Probe Pass Rate** | 100% | **100%** | **Passed** |
| **Mean Recall@10** | > 80% | **96%** | **Passed** |
| **Mean Recall@3** | > 70% | **96%** | **Passed** |
| **Mean Precision** | > 70% | **85%** | **Passed** |
| **Average Local Match Latency** | < 10ms | **1.00 ms** | **Passed** |

---

## 📝 Test Case Breakdown

| ID | Test Scenario | Behavior | Recall@10 | Recall@3 | Precision | Schema | Grounded | Behavior Probe | Latency |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| TC-01 | Java Developer (Standard Scenario) | RECOMMEND | 100% | 100% | 67% | PASSED | YES | PASSED | 2ms |
| TC-02 | Data Analyst (Standard Scenario) | RECOMMEND | 67% | 67% | 33% | PASSED | YES | PASSED | 5ms |
| TC-03 | Scrum Master (Standard Scenario) | RECOMMEND | 100% | 100% | 100% | PASSED | YES | PASSED | 1ms |
| TC-04 | Vague Frontend Developer Intent (Clarification Probe) | CLARIFY | 100% | 100% | 100% | PASSED | YES | PASSED | 0ms |
| TC-05 | Vague General Developer Intent (Clarification Probe) | CLARIFY | 100% | 100% | 100% | PASSED | YES | PASSED | 0ms |
| TC-06 | Assessment Comparison OPQ vs GSA (Comparison Probe) | COMPARE | 100% | 100% | 100% | PASSED | YES | PASSED | 0ms |
| TC-07 | Out of Scope Pricing Request (Refusal Probe) | REFUSE | 100% | 100% | 100% | PASSED | YES | PASSED | 0ms |
| TC-08 | Out of Scope Legal Query (Refusal Probe) | REFUSE | 100% | 100% | 100% | PASSED | YES | PASSED | 0ms |
| TC-09 | Constraint Refinement mid-conversation (Refinement) | RECOMMEND | 100% | 100% | 67% | PASSED | YES | PASSED | 1ms |

---

## 🔍 Key Findings

1. **Strict Schema Compliance**: Every test execution yields exactly 3 object keys (`reply`, `recommendations`, `end_of_conversation`) matching target formats.
2. **Catalog Groundedness**: 100% of generated recommendations map directly to the official `SHL_CATALOG`. No synthetic or hallucinated URLs/names are returned.
3. **Behavioral Fidelity**: The engine successfully handles the 4 conversation modes (Refusals, Vague Clarifications, Comparisons, Multi-turn constraints refinement) locally.
4. **Performance Efficiency**: Running the search matcher locally provides zero-network dependency and sub-millisecond execution times.
