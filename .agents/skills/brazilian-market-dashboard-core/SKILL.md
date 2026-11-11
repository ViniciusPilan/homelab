---
name: brazilian-market-dashboard-core
description: Shared research, data-handling, and HTML presentation workflow used by the Brazilian equity, bank, and FII dashboard skills.
metadata:
  short-description: Shared workflow for Brazilian market dashboards
---

# Brazilian market dashboard core

Use this workflow together with exactly one sector skill:

- `fii-dashboard-report` for FIIs and FIAGROs.
- `equity-sector-dashboard-report` for listed Brazilian companies outside banking.
- `financial-sector-dashboard-report` for listed Brazilian banks.
- `currency-crypto-commodities-report` for selected currencies, cryptoassets, gold, oil, and iron ore.

The selected specialist skill controls the universe, approved sources, metrics, and interpretation. Never transfer source permissions or metric assumptions from one specialist skill to another. If a request spans asset classes, apply each relevant skill to its own assets and keep comparisons separated where their units and markets are not comparable.

## Research and data handling

- Refresh current information whenever creating or updating a report. Use the sources authorized by the selected sector skill, and link them next to relevant data or in a concise source list.
- Search for each asset and metric separately. Where the sector skill authorizes the shared market-data platforms for that data type, try Investidor10 first; if it has no usable value, try Status Invest, then AUVP Analítica. A current value with a matching definition and reference period is usable; cite the provider. If providers show materially different values, check the other permitted providers and explain the differences. If the sector skill requires a different source for that data type, follow its source rules and exhaust those permitted sources instead.
- Mark a value `n/d` only after all applicable, permitted sources have been checked and none provides a current value with a usable definition and reference period. Do not use a stale figure, a mismatched definition, or an inference to avoid `n/d`; briefly state that the permitted sources were checked and why the value remains unavailable.
- Record a visible data-reference date and, where available, each quote date, reporting period, unit, definition, and calculation basis. Do not label stale or period-specific figures as current.
- Keep provider values separate when definitions, periods, or methods differ. Explain the difference or show `n/d`; never silently merge, infer, or backfill data from an unapproved source or an old report.
- Distinguish reported results from estimates, guidance, announced amounts, and projections. Keep historical distributions/returns separate from expected future amounts.
- Use Brazilian Portuguese and Brazilian number formatting unless requested otherwise. Label currencies, scales, units, percentages, and periods explicitly.
- Base conclusions on the displayed evidence, state material gaps and comparability limits, and avoid personalized buy/sell instructions.

## Report and HTML presentation

Use a concise four-part report unless the sector skill calls for a different arrangement:

1. **Empresas/Fundos:** identify each asset and explain its business or portfolio exposure.
2. **Dashboard:** make comparable data the visual center; split unlike business models into separate panels rather than forcing a ranking.
3. **Métricas:** define displayed indicators and explain limits to comparison.
4. **Conclusões:** provide a short, evidence-based observation for each requested asset, including a key trade-off or item to monitor.

Start from the HTML base named by the sector skill. Preserve its embedded styles and adapt its sections and tables to the requested assets. Deliver a standalone HTML file that works directly in a browser, with semantic headings and table headers, readable contrast, keyboard-accessible horizontal scrolling, and labeled metric cards on narrow screens where practical.

Save the final HTML under `smart-reports/<assunto>/` as `<nome-do-relatorio>_DD-MM-YYYY_HH-MM.html`, using local 24-hour time. Create a PDF only when explicitly requested. Do not run tests or validation checks unless the user asks for verification.
