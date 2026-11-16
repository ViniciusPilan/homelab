# Extrator de BDRs

Coleta indicadores de BDRs nas páginas do Investidor10 e grava os resultados
como JSON em `results/`.

## Uso

Na raiz do repositório:

```sh
python3 internal-tools/investment-report/extractor/bdrs/main.py
```

Para consultar somente um ticker:

```sh
python3 internal-tools/investment-report/extractor/bdrs/scraper/investidor10.py AAPL34
```

O coletor principal percorre a lista `BDR_SYMBOLS` em `main.py`. Cada consulta
usa a URL `https://investidor10.com.br/bdrs/<ticker>/`. É necessário ter acesso
à internet. O resultado consolidado é impresso no terminal e salvo com data e
hora local, além de ser atualizado em `results/latest.json`.

Os valores são mantidos como apresentados pelo Investidor10. Campos ausentes
ou mudanças no HTML da fonte são registrados como erro para o ativo afetado.
