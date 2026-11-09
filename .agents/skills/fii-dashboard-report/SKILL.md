---
name: fii-dashboard-report
description: Create or update a responsive HTML report about Brazilian listed FIIs and FIAGROs, using fund-specific property, income, portfolio, and credit measures. Use for FII/FIAGRO requests, not company stocks.
metadata:
  short-description: Create a specialized Brazilian FII dashboard
---

# FII dashboard report

Use this skill for Brazilian listed FIIs and FIAGROs, including the established watchlist below. Follow the shared research, data-handling, and HTML workflow in [brazilian-market-dashboard-core](../brazilian-market-dashboard-core/SKILL.md). This skill controls fund scope, approved sources, fund metrics, and interpretation.

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

Confirm the current fund name, ticker, legal type, manager/administrator, listing status, mandate, portfolio composition, and **segment** from the allowed sources. State a segment explicitly for every fund (for example, tijolo/logística, tijolo/shopping, tijolo/lajes corporativas, tijolo/residencial, papel/recebíveis, híbrido, FoF, or FIAGRO) and briefly describe its principal exposure. A fund's label is not proof of its current exposure. If its portfolio spans segments, identify it as híbrido or multiestratégia and show the main exposures separately. Explain material acquisitions, sales, mergers, follow-on offerings, restructurings, and strategy changes only when reported by the allowed sources. Do not add funds the user did not request.

## Sources, dates, and definitions

Use only the following sources for market indicators, fund/company descriptions, and financial results:

- [Investidor10](https://investidor10.com.br/)
- [Status Invest](https://statusinvest.com.br/)
- [AUVP Analítica](https://analitica.auvp.com.br/)

Do not use administrator or manager websites, B3, CVM, other market-data platforms, news sites, search snippets, or other third-party sources to supply or corroborate those data categories. Link each source beside relevant data or in a compact source list.

This source restriction applies to market indicators, fund/company descriptions, and financial results, including portfolio composition and fund events when presented as fund-specific facts.

Distinguish physical from financial vacancy; contractual rent from cash received; recurring distributions from extraordinary income, capital gains, amortizations, or return of capital; and paid distributions from announced or projected amounts. Avoid implying distributions are guaranteed or tax outcomes are universal.

## FII dashboard requirements

Use the shared four-part report structure, adapting the first section to funds. Include each fund's explicit segment, mandate, current strategy, portfolio type, income drivers, diversification, and material risks. Use separate dashboard panels where business models differ; do not force a ranking across brick, paper, hybrid, and FIAGRO strategies. Label values in R$, m², property counts, percentage points, and other applicable units.

## Common dashboard measures

Use a consistent basis across funds where possible:

- Market price, 12-month price return, average daily traded financial volume, and market capitalization when available.
- Total net asset value / patrimônio líquido (R$) and net asset value per share / valor patrimonial por cota (R$) for every requested fund, using the latest figures available from the allowed sources. Include these fields in the main dashboard table, identify their reporting/reference date when shown, and mark `n/d` only if the allowed sources do not provide the value.
- P/VP using the same quote date and the latest reported NAV per share; disclose the NAV date. Explain that appraisals can lag market prices and that P/VP alone is not a quality or discount verdict.
- Historical distribution yield over 12 months, monthly distribution per share, and distribution history over several years. State whether yield uses trailing cash distributions or another basis. Identify extraordinary items and compare distributions with recurring cash generation when the data permit.
- Number of assets, geographic and tenant/borrower concentration, and portfolio allocation by segment or instrument.
- Gross/net liabilities, leverage or securitized obligations, cash balance, debt maturity and indexation when relevant. Explain the denominator and methodology for leverage; do not treat development commitments or property-level debt as fund-level debt without stating it.
- For property funds, net operating income/rental income, expenses, and recurring cash flow where consistently disclosed. Do not treat accounting profit as interchangeable with distributable cash.
- Include a single **Vacância** field in the dashboard for every requested fund. Use the vacancy percentage displayed by the allowed source and identify the source and reference date when available. Do not split it into physical and financial vacancy columns unless the user explicitly asks for that breakdown. If the allowed sources do not provide a vacancy value, mark it `n/d`; for pure paper funds where vacancy is not meaningful, label it `não se aplica`. For mixed funds and FIAGROs, use the platform's reported value and clarify its scope when the source does so.
- Compare distributions with inflation-linked or CDI-linked income only with matching periods and an explicit benchmark basis. Historical yield does not predict future income.

## Fund-specific analysis

### Brick funds: logistics, offices, residential, shopping, and diversified property

Use only the measures relevant to the current portfolio:

- Vacancy as a single reported percentage, with source and reference date when available. Use the allowed platform's displayed figure; do not create separate physical/financial columns unless explicitly requested. Mark `n/d` only when no allowed source provides a value. Include occupancy and delinquency/arrears where reported. If the source does not clarify the vacancy methodology, say so briefly in the observation/limitations rather than omitting the available percentage.
- Portfolio area (m²), number and quality/location of properties, tenant concentration, lease concentration, and lease expiry schedule. For logistics, describe asset class, region, specification and tenant exposure; for offices, location, quality and lease rollover; for shopping centers, ownership share and mall-level exposure.
- Rental revenue, same-property rent or NOI growth, leasing spreads, rent revisions, concessions, rent-free periods, and one-off lease effects where disclosed.
- WALE (weighted average lease expiry) only when the source defines it; clarify whether calculated by area, rent, or another weighting basis. Report lease type (typical, atípico, or other) and upcoming expirations when material.
- Shopping centers: same-store sales (SSS), same-store rent (SSR), occupancy cost, visitation/footfall and occupancy when published. State the period and whether figures are fund-wide or for selected malls.
- Residential: number/type of units, occupancy, rent collection, tenant turnover, average rent, acquisition/development pipeline and delivery risk as available. Separate stabilized rental assets from development or sale inventory.
- Diversified funds: show exposure by segment and top assets/tenants; do not let a portfolio average hide a concentrated risk.
- Property valuation/appraisal date, transaction price versus book value, cap rate/yield assumptions, and appraisal limitations when available. Avoid presenting appraisal-based NAV as a current sale value.

For pure paper funds, label vacancy `não se aplica`. For mixed portfolios, use the allowed source's reported vacancy value and state its scope when available. If vacancy is relevant but no allowed source provides a value, mark it `n/d`.

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

## Reusable design

Start from [assets/relatorio-base-fii.html](assets/relatorio-base-fii.html). Preserve its dark teal header and embedded CSS unless the user requests a different design. Use separate compact tables for property, credit, and FIAGRO metrics when needed.
