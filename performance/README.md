# Performance — BlazeDemo

Esta pasta contém os testes de performance do fluxo de compra de passagem no BlazeDemo.

A implementação utiliza Apache JMeter 5.6.3 e reproduz o fluxo por requisições HTTP, sem navegador.

## Objetivo

Validar o comportamento do fluxo de compra sob:

- carga sustentada;
- aumento abrupto de carga;
- retorno ao nível esperado após o pico.

O cenário exercitado é:

```text
Página inicial
→ pesquisa de voos
→ seleção do voo
→ preenchimento da compra
→ confirmação da compra
```

A confirmação da jornada é validada pela resposta final da compra.

## Critérios de aceitação

O desafio define os seguintes critérios:

```text
Throughput >= 250 req/s
P90 < 2 s
```

Além desses dois valores, a análise também considera:

- taxa de erros;
- p95;
- p99;
- média;
- mediana;
- tempo máximo de resposta.

## Arquivos

```text
performance/
├── data/
│   └── passengers.csv
├── jmeter/
│   ├── blazedemo-load.jmx
│   └── blazedemo-spike.jmx
└── README.md
```

Os planos utilizam somente componentes nativos do JMeter.

A correlação do voo é feita com `Regular Expression Extractor`. Os valores obtidos na pesquisa são reaproveitados nas requisições seguintes, evitando dados de voo fixos no script.

## Pré-requisitos

- Java 17 ou superior;
- Apache JMeter 5.6.x.

Validar a instalação:

```bash
java -version
jmeter -v
```

No Windows, caso o JMeter não esteja configurado no `PATH`, utilize o executável diretamente:

```cmd
C:\caminho\apache-jmeter-5.6.3\bin\jmeter.bat
```

## Smoke test

Antes de gerar carga, foi executado um smoke com 1 usuário para confirmar o funcionamento da jornada.

Exemplo:

```bash
jmeter -n \
  -t performance/jmeter/blazedemo-load.jmx \
  -Jusers=1 \
  -JrampUp=1 \
  -Jduration=20 \
  -JtargetRpm=60 \
  -l performance/results/smoke.jtl
```

Resultado observado:

```text
19 amostras
~1,0 req/s
Tempo médio: 628 ms
Máximo: 2.018 ms
Erros: 0,00%
```

O smoke foi considerado satisfatório para prosseguir com os testes de carga.

## Teste de carga

O plano de carga utiliza `Constant Throughput Timer`.

Como o componente trabalha em amostras por minuto:

```text
250 req/s × 60 = 15.000 req/min
```

### Configuração utilizada na execução

```text
Usuários: 600
Ramp-up: 30 s
Duração configurada: 60 s
Throughput alvo: 15.000 req/min
```

Comando utilizado:

```bash
jmeter -n \
  -t performance/jmeter/blazedemo-load.jmx \
  -Jusers=600 \
  -JrampUp=30 \
  -Jduration=60 \
  -JtargetRpm=15000 \
  -l performance/results/load.jtl
```

Para gerar o dashboard depois da execução:

```bash
jmeter -g performance/results/load.jtl \
  -o performance/results/load-report
```

### Resultado

| Métrica | Valor |
|---|---:|
| Amostras | 13.909 |
| Erros | 202 |
| Taxa de erro | 1,45% |
| Throughput | 195,76 req/s |
| Média | 1.926,90 ms |
| Mediana | 956 ms |
| Mínimo | 158 ms |
| Máximo | 10.598 ms |
| P90 | 5.815 ms |
| P95 | 8.158 ms |
| P99 | 10.139,8 ms |

Durante uma janela intermediária de 30 segundos o teste chegou a aproximadamente 248,6 req/s. Esse valor, porém, não foi sustentado durante a execução completa.

### Análise do teste de carga

Critério de throughput:

```text
Esperado: >= 250 req/s
Obtido:   195,76 req/s
Resultado: NÃO ATENDIDO
```

Critério de tempo de resposta:

```text
Esperado: P90 < 2.000 ms
Obtido:   P90 = 5.815 ms
Resultado: NÃO ATENDIDO
```

Também foram registrados 202 erros, equivalentes a aproximadamente 1,45% das amostras.

Nas condições desta execução, o cenário de carga não atendeu aos critérios definidos.

## Teste de pico

O plano de pico é executado em três fases sequenciais:

### 1. Baseline

```text
Alvo: 100 req/s
Threads: 300
Ramp-up: 30 s
Duração: 60 s
```

### 2. Pico

```text
Alvo: 500 req/s
Threads: 1.000
Ramp-up: 10 s
Duração: 60 s
```

### 3. Recuperação

```text
Alvo: 250 req/s
Threads: 600
Ramp-up: 15 s
Duração: 60 s
```

Comando:

```bash
jmeter -n \
  -t performance/jmeter/blazedemo-spike.jmx \
  -l performance/results/spike.jtl
```

Geração do dashboard:

```bash
jmeter -g performance/results/spike.jtl \
  -o performance/results/spike-report
```

### Resultado consolidado

Os valores abaixo representam o consolidado da execução completa das três fases.

| Métrica | Valor |
|---|---:|
| Amostras | 31.508 |
| Erros | 1.476 |
| Taxa de erro | 4,68% |
| Throughput | 149,09 req/s |
| Média | 3.133,13 ms |
| Mediana | 2.941 ms |
| Mínimo | 157 ms |
| Máximo | 21.426 ms |
| P90 | 8.958,8 ms |
| P95 | 10.254 ms |
| P99 | 12.536,88 ms |

### Análise do teste de pico

O resultado consolidado apresenta degradação em relação ao teste de carga:

- throughput menor;
- aumento do tempo médio;
- aumento de p90, p95 e p99;
- aumento da taxa de erros.

Em relação aos critérios do desafio:

```text
Throughput esperado: >= 250 req/s
Throughput obtido:   149,09 req/s
Resultado: NÃO ATENDIDO
```

```text
P90 esperado: < 2.000 ms
P90 obtido:   8.958,8 ms
Resultado: NÃO ATENDIDO
```

A taxa de erro consolidada foi de aproximadamente 4,68%.

Como os dados apresentados pelo dashboard são agregados para as três fases, esta conclusão não atribui isoladamente cada valor ao baseline, ao pico ou à recuperação. Para uma análise por fase, os gráficos temporais e/ou o `.jtl` devem ser considerados.

## Conclusão geral

Os testes de carga e pico não atenderam aos critérios definidos de 250 req/s e p90 inferior a 2 segundos.

No teste de carga:

```text
Throughput: 195,76 req/s
P90: 5,815 s
Error rate: 1,45%
```

No teste de pico:

```text
Throughput: 149,09 req/s
P90: 8,959 s
Error rate: 4,68%
```

O aumento da carga foi acompanhado por piora do tempo de resposta e aumento da taxa de erros.

A conclusão correta para esta execução é que **os critérios não foram atendidos nas condições em que o teste foi realizado**.

Não é possível concluir somente com esses dados que os números representam a capacidade máxima da aplicação. O BlazeDemo é um ambiente público e não controlado, portanto fatores como rede, infraestrutura compartilhada e outras execuções concorrentes podem influenciar os resultados.

Para uma investigação em ambiente controlado, os próximos pontos de análise seriam:

- recursos de CPU e memória da aplicação;
- utilização e limites de conexões;
- banco de dados e dependências;
- gargalos por endpoint;
- distribuição dos erros;
- comportamento das três fases do spike ao longo do tempo.

## Evidências

Após a execução, os principais arquivos são:

```text
performance/results/smoke.jtl
performance/results/load.jtl
performance/results/load-report/index.html
performance/results/spike.jtl
performance/results/spike-report/index.html
```

Caso a pasta `performance/results` esteja ignorada pelo Git, os relatórios devem ser anexados separadamente à entrega ou o `.gitignore` deve ser ajustado para versionar apenas as evidências que serão entregues.

## Observação sobre o ambiente

Por se tratar de um alvo público, testes de carga devem ser executados de forma consciente e somente quando autorizados.

A automação não altera os resultados para obter aprovação artificial. O relatório registra os valores efetivamente observados e compara esses valores diretamente com os critérios do desafio.
