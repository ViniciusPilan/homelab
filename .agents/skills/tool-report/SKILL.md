---
name: tool-report
description: Create or update an evidence-based HTML report for a repository or cluster tool from its logs or scan output. Use whenever the user asks for a report for a tool, including security scanners and operational tools.
---

# Tool Report

For any request to create or refresh a report about a tool, use the repository's shared HTML report template at `examples/html-page-for-reports/html-report-template.html` as the starting point. Adapt its sections to the source data while retaining the standalone design and interactive search, filters, and sorting for findings.

## Workflow

1. Identify the tool and requested run or time range. Read that tool's README/runbook and any relevant existing report before creating the new report.
2. Gather the relevant source output. When the user refers to a running cluster, retrieve the latest completed job logs and enough job/pod metadata to establish timestamp, version, node, and scope. Use read-only access. If access is unavailable, proceed with provided logs or ask for them; do not invent data.
3. Extract findings and summary counts from the source. Deduplicate repeated output where appropriate and explain the counting method. Preserve tool statuses and check IDs; distinguish failed checks from checks that did not execute.
4. Add concise interpretation that is supported by the evidence. Call out scope gaps, execution errors, mismatched target nodes, duplicated summaries, or generic remediation text when they change how results should be read. Do not present a score as comprehensive when coverage is limited.
5. Save every report under `smart-reports/<DD-MM-YYYY-HH-MM>/<tool_name>/<report-html-file>`, using the report creation time in local 24-hour time and the tool's name as the directory name. For example: `smart-reports/31-10-2026-11-27/kyverno/report.html`. Create a new timestamped directory for each report run; do not put reports alongside the tool or overwrite a report from an earlier run. Replace all template placeholders, remove unused sections, and include the source run, timestamp, and refresh guidance. Escape any log-derived content inserted into HTML.
6. Follow repository validation guidance. Do not run checks unless the user asks for verification; report what was performed or recommend relevant checks.

The report is a snapshot unless the user explicitly asks for live data. Do not change the tool deployment or apply remediations as part of report generation.
