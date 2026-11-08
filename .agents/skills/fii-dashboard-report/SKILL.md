---
name: fii-dashboard-report
description: Create or update a responsive, browser-ready HTML intelligent sector report for Brazilian listed real estate funds (FIIs) and FIAGROs, using fund-specific property, income, portfolio, and credit metrics. Invoke when the user asks for a "relatório inteligente do setor de FIIs" or an intelligent report about FIIs/FIAGROs.
metadata:
  short-description: Create a specialized Brazilian FII dashboard
---

# FII dashboard report

Use this skill when the user asks for a “relatório inteligente do setor de FIIs”, or to create, refresh, or adapt a report about Brazilian listed real estate funds (FIIs) or FIAGROs, including the established watchlist below. Follow the shared report location and HTML naming rules in the repository `AGENTS.md`. Deliver a standalone HTML file for browser viewing; PDF is only an additional output when explicitly requested.

## Scope and classification

Include only requested tickers. When updating the established watchlist, cover every ticker unless the user narrows the scope:

- **APTO11 — Navi Residencial FII:** residential real estate strategy. Verify whether the current portfolio emphasizes rental housing, development, or another residential model; do not assume the strategy from the fund name alone.
- **BTAL11 — BTG Pactual Agro Logística FIAGRO:** FIAGRO with agribusiness/logistics exposure. It is not automatically comparable to a conventional urban-property FII. Confirm its current portfolio, legal category, and income sources in current filings.
- **BTLG11 — BTG Pactual Logística FII:** logistics/industrial properties.
- **GARE11 — Guardian Real Estate FII:** diversified real estate strategy; verify current segment mix and any material changes.
- **KNCR11 — Kinea Rendimentos Imobiliários FII:** predominantly real estate credit/CRI strategy; evaluate credit and indexation, not physical-property vacancy as a headline measure.
- **KNRI11 — Kinea Renda Imobiliária FII:** hybrid property portfolio; assess office and logistics exposure separately.
- **VISC11 — Vinci Shopping Centers FII:** shopping centers.
- **XPLG11 — XP Log FII:** logistics/industrial properties.
- **XPML11 — XP Malls FII:** shopping centers.

Confirm the current fund name, ticker, legal type, manager/administrator, listing status, mandate, and portfolio composition from current sources. A fund's label is not proof of its current exposure. Explain material acquisitions, sales, mergers, follow-on offerings, restructurings, and strategy changes. Do not add funds the user did not request.

## Sources, dates, and definitions

Browse current information each time a report is created or refreshed. Prefer primary sources for fund-specific facts: administrator and manager reports, monthly portfolio reports, audited financial statements, material-fact notices, and CVM filings. Use B3 for listing and trading facts. Market-data platforms may supply prices, historical distributions, P/VP, and liquidity only when the reference date and calculation basis are visible. Link sources beside data or in a compact source list.

Use the latest available official report and state its reporting month, publication date, quote date, and financial-statement period. For every important metric, record its unit, definition, and source. Distinguish physical from financial vacancy; contractual rent from cash received; recurring distributions from extraordinary income, capital gains, amortizations, or return of capital; and paid distributions from announced or projected amounts. Do not silently combine providers with different methodologies. Mark unavailable data `n/d`; never infer it from an old report. Avoid implying distributions are guaranteed or tax outcomes are universal.

## Report structure

Keep the report concise and make the dashboard its visual center. Use four numbered parts:

1. **Fundos:** ticker, mandate, current strategy, portfolio type, main income drivers, diversification, and material risks.
2. **Dashboard:** common market and income indicators plus the applicable property or credit measures below. Use separate panels/tables where business models differ; do not force one ranking across brick, paper, hybrid, and FIAGRO strategies.
3. **Métricas:** plain-language definitions, reporting periods, and comparability limits for all displayed indicators.
4. **Conclusões:** one short, evidence-based observation per requested ticker, stating the main positive factor and monitoring point. Do not give personalized buy/sell instructions.

Include a visible reference date and Brazilian number formatting. Label values in R$, m², number of properties, percentage points, and other units as applicable.

## Common dashboard measures

Use a consistent basis across funds where possible:

- Market price, 12-month price return, average daily traded financial volume, and market capitalization when available.
- P/VP using the same quote date and the latest reported NAV per share; disclose the NAV date. Explain that appraisals can lag market prices and that P/VP alone is not a quality or discount verdict.
- Historical distribution yield over 12 months, monthly distribution per share, and distribution history over several years. State whether yield uses trailing cash distributions or another basis. Identify extraordinary items and compare distributions with recurring cash generation when the data permit.
- Number of assets, geographic and tenant/borrower concentration, and portfolio allocation by segment or instrument.
- Gross/net liabilities, leverage or securitized obligations, cash balance, debt maturity and indexation when relevant. Explain the denominator and methodology for leverage; do not treat development commitments or property-level debt as fund-level debt without stating it.
- For property funds, net operating income/rental income, expenses, and recurring cash flow where consistently disclosed. Do not treat accounting profit as interchangeable with distributable cash.
- Compare distributions with inflation-linked or CDI-linked income only with matching periods and an explicit benchmark basis. Historical yield does not predict future income.

## Fund-specific analysis

### Brick funds: logistics, offices, residential, shopping, and diversified property

Use only the measures relevant to the current portfolio:

- Physical vacancy and financial vacancy, each with definition and reference date; occupancy and delinquency/arrears where reported. Distinguish occupied area from rent-paying occupancy.
- Portfolio area (m²), number and quality/location of properties, tenant concentration, lease concentration, and lease expiry schedule. For logistics, describe asset class, region, specification and tenant exposure; for offices, location, quality and lease rollover; for shopping centers, ownership share and mall-level exposure.
- Rental revenue, same-property rent or NOI growth, leasing spreads, rent revisions, concessions, rent-free periods, and one-off lease effects where disclosed.
- WALE (weighted average lease expiry) only when the source defines it; clarify whether calculated by area, rent, or another weighting basis. Report lease type (typical, atípico, or other) and upcoming expirations when material.
- Shopping centers: same-store sales (SSS), same-store rent (SSR), occupancy cost, visitation/footfall and occupancy when published. State the period and whether figures are fund-wide or for selected malls.
- Residential: number/type of units, occupancy, rent collection, tenant turnover, average rent, acquisition/development pipeline and delivery risk as available. Separate stabilized rental assets from development or sale inventory.
- Diversified funds: show exposure by segment and top assets/tenants; do not let a portfolio average hide a concentrated risk.
- Property valuation/appraisal date, transaction price versus book value, cap rate/yield assumptions, and appraisal limitations when available. Avoid presenting appraisal-based NAV as a current sale value.

Do not report vacancy as meaningful for pure paper funds. For mixed portfolios, show the physical-property portion separately.

### Paper/credit funds and CRI exposure

For KNCR11 and any other fund with material credit holdings, prioritize:

- Portfolio allocation by instrument and indexer (CDI, IPCA, IGP-M, fixed rate, or other); average yield/spread and maturity/duration only as defined by the source.
- CRI/issuer/borrower concentration, collateral and guarantee type, loan-to-value (LTV) with calculation basis, seniority/subordination, and sector exposure.
- Credit events: late payments, renegotiations, grace periods, waivers, provisions/impairment, defaults, and recovery status. Distinguish watchlist or stressed exposure from actual default.
- Credit quality and cash distributions: recurring interest received, amortization, extraordinary gains, and the effect of indexation lags. Discuss concentration and liquidity risk as well as headline yield.
- If the fund holds real estate directly or through other funds, analyze that sleeve separately and apply property measures only to it.

Do not infer safety from a high credit rating, high coupon, or high distribution yield alone. Explain when borrower-level data are unavailable.

### FIAGRO and BTAL11

Verify BTAL11's present legal classification and underlying holdings rather than treating all FIAGROs as equivalent. Analyze agribusiness receivables, land, warehouses/logistics, equity, or other exposures separately, as applicable. Include counterparty/borrower concentration, collateral, crop/commodity and regional exposure, credit events, indexation, maturity, liquidity, and any property vacancy only where the underlying assets make it relevant. Explain any differences in regulation, asset mix, or reporting that limit direct comparison with FIIs.

## Interpretation and conclusions

Interpret P/VP and distribution yield alongside portfolio quality, recurring cash flow, vacancy/occupancy, tenant or borrower concentration, leverage, and upcoming lease or credit events. Consider interest-rate and inflation sensitivity based on the fund's actual leases and securities, including indexation and repricing lags. Explain that interest rates can affect both income and market valuation; do not state a universal direction or magnitude without evidence.

The conclusions should identify fund-specific evidence and risk rather than rank all tickers by yield or discount. Avoid treating a single month of distribution or an unusually high yield as sustainable. State data gaps that materially limit the reading.

## Reusable design and output quality

Start from [assets/relatorio-base-fii.html](assets/relatorio-base-fii.html). Preserve its dark teal header, responsive cards/tables, and embedded CSS unless the user requests a different design. The HTML must be comfortable to read directly in a browser on both desktop and phone. Use separate compact tables for property, credit, and FIAGRO metrics when needed. Tables should be readable on notebook screens, become labeled metric cards on narrow screens, preserve semantic headers and keyboard-accessible scrollable overflow. Print styling may be retained, but PDF export is not required unless requested.

Use Brazilian Portuguese unless requested otherwise. Keep conclusions evidence-based and limitations plain. Save the final HTML under `smart-reports/<assunto>/` using the local 24-hour timestamp format required by repository `AGENTS.md`. Do not run tests or validation checks unless the user asks for verification.
