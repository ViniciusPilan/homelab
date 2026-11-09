---
name: financial-sector-dashboard-report
description: Create or update a responsive HTML report about publicly traded Brazilian banks. Use for requests specifically about bank stocks; use equity-sector-dashboard-report for other listed companies.
metadata:
  short-description: Create a sourced financial dashboard report
---

# Financial dashboard report

Use this skill only for listed Brazilian bank stocks. Follow the shared research, data-handling, and HTML workflow in [brazilian-market-dashboard-core](../brazilian-market-dashboard-core/SKILL.md). This skill controls bank scope, sources, metrics, and interpretation. For non-bank companies, use `equity-sector-dashboard-report`; for FIIs/FIAGROs, use `fii-dashboard-report`.

## Scope

Include only listed equity securities whose issuer's primary business is banking, such as commercial, universal, investment, or digital banks. A BDR may be included when it represents shares of a bank; identify the underlying issuer, ticker, and BDR ratio clearly. Include a diversified company only when banking is its primary business, and describe material non-bank operations where relevant.

Exclude companies whose primary business is insurance, brokerage, investments, asset management, payments, consumer finance, or a financial holding/conglomerate that is not itself primarily a bank. Do not include these securities just because they are financial companies or appear in the user's broader portfolio. If the request mixes bank stocks with other sectors, cover only the bank stocks with this skill; another sector-specific skill should handle the rest.

## Required bank set

Every report generated with this skill must include this same core set of five Brazilian bank issuers and tickers, regardless of whether the user supplies a watchlist:

- Itaú Unibanco — ITUB4
- BTG Pactual — BPAC11
- Bradesco — BBDC4
- Banco do Brasil — BBAS3
- Santander Brasil — SANB11

Do not omit BTG Pactual (BPAC11). Keep all five in the company section, dashboard, and conclusions. If a quote or metric cannot be verified from the approved sources, retain the bank and show `n/d` with a brief explanation; missing coverage is not a reason to remove an issuer. When a user explicitly requests additional bank tickers, include them alongside this core set if they meet the scope. Do not add non-bank securities.

## Data sources

Use only these sources for market indicators, company descriptions, and financial results:

- [Investidor10](https://investidor10.com.br/)
- [Status Invest](https://statusinvest.com.br/)
- [AUVP Analítica](https://analitica.auvp.com.br/)

## Bank dashboard requirements

Include price, 12-month price change, P/L, P/VP, DY, ROE, ROA, payout, net margin, average daily liquidity, **Índice de Basileia**, and **inadimplência**. Provide dedicated fields for Basileia and inadimplência for every required bank. Show `n/d` with an explanation when unavailable. State the period and definition for each capital or credit metric; for delinquency, identify the threshold and whether the figure is an NPL ratio, overdue portfolio share, or another disclosed measure. Include credit growth and provisions when the approved sources report them. Do not use net debt/EBITDA as a primary bank measure.

## Reusable base

Start from [assets/relatorio-base-atual.html](assets/relatorio-base-atual.html) when creating another report in this series. It is a snapshot of the user's approved report design and section order, not a source of current data. Replace the company list, data, date, source links, caveats, and conclusions to match the new request. Keep the dark teal header, compact cards, responsive metric table, and embedded CSS unless the user asks for a different design. The HTML must be comfortable to read directly in a browser on both desktop and phone. Tables should fit notebook-width screens with wrapped cell content and become labeled, readable metric cards on narrow phone screens; preserve semantic table headers for accessibility and retain keyboard-accessible horizontal scrolling as a fallback.

Check that each required issuer still meets the bank-only scope and that its ticker is active. Additional requested issuers must meet the same scope. Do not add Caixa Econômica Federal, Caixa Seguridade, or other companies by default. Caixa Econômica Federal may be included when explicitly requested; Caixa Seguridade is an insurer and out of scope. ROXO34 may be added only when explicitly requested; identify the underlying Nu Holdings shares and BDR ratio.

## Output quality

- Restrict bank market and financial data to the three approved domains above.
