# Extrator de moedas

Busca as cotações atuais em reais e o histórico disponível no período de 30 dias
nas páginas de moedas do Investidor10. O histórico usa a rota JSON consultada
pelo gráfico do próprio site e é normalizado para 30 datas consecutivas. Em dias
sem cotação (como fins de semana e feriados), o último preço conhecido é repetido.

## Uso

Execute a partir de qualquer diretório:

```sh
python3 internal-tools/investment-report/extractor/currencies/main.py
```

É necessário ter Python 3 e acesso à internet. O script usa apenas a biblioteca
padrão do Python.

## Saída

O JSON consolidado contém dólar, euro, libra esterlina e peso argentino. Cada
item tem `name`, `values`, `variation_30d`, `variation_24h` e `variation_12m`.
`values` é um vetor numérico de 30 preços em BRL, ordenado do mais antigo ao mais
recente; o último valor é atualizado com a cotação atual exibida na página da
moeda. As variações de 24h e 12m são mantidas no formato percentual apresentado
pelo site. `variation_30d` é calculada com a diferença percentual entre o primeiro
e o último valor do vetor, com sinal explícito positivo ou negativo.

Os arquivos são gravados em `results/` com data e hora local e em `latest.json`.
