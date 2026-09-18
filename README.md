# Desafio Técnico QA — Web, API e Performance

Este repositório contém a solução para os três blocos do desafio técnico de QA, com scripts construídos por Silas Rodrigues:

- automação WEB da pesquisa de artigos do Blog do Agi;
- automação de API utilizando a Dog API;
- testes de performance do fluxo de compra do BlazeDemo.

A proposta foi manter a solução objetiva, reproduzível e fácil de avaliar, sem criar abstrações além do necessário.

## Tecnologias utilizadas

- JavaScript
- Node.js 22+
- Cypress 16
- Cucumber / Gherkin
- Apache JMeter 5.6.3
- GitHub Actions

## Estrutura do projeto

```text
.
├── cypress/
│   ├── e2e/
│   │   ├── web/
│   │   └── api/
│   └── support/
│       ├── pages/
│       ├── services/
│       └── step_definitions/
├── docs/
├── performance/
│   ├── data/
│   ├── jmeter/
│   └── README.md
├── .github/
│   └── workflows/
├── cypress.config.js
├── package.json
└── README.md
```

## Pré-requisitos

Para WEB e API:

- Node.js 22 ou superior;
- npm.

Para performance:

- Java 17 ou superior;
- Apache JMeter 5.6.x.

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Execução dos testes funcionais

Executar todos os cenários:

```bash
npm test
```

Somente WEB:

```bash
npm run test:web
```

Somente API:

```bash
npm run test:api
```

Smoke:

```bash
npm run test:smoke
```

Modo interativo do Cypress:

```bash
npm run cy:open
```

Os relatórios do Cucumber são gerados em `cypress/reports`.

## Cobertura WEB

O desafio solicita pelo menos dois cenários relevantes para a pesquisa de artigos.

Foram automatizados:

- pesquisa por um termo com resultados;
- pesquisa por um termo sem resultados.

Para o cenário positivo foi utilizado o termo `Pix`, que possui conteúdo publicado no blog.

Para o cenário negativo foi utilizado um valor propositalmente improvável de existir no conteúdo:

```text
qaautomatizado987654321
```

O endereço informado no desafio redireciona atualmente para `https://blog.agibank.com.br/`.

A busca do site utiliza a rota padrão de pesquisa do WordPress (`/?s=<termo>`). A automação valida a disponibilidade do acionador de pesquisa e o comportamento final da busca por essa rota, evitando dependência do JavaScript visual do tema do site.

## Cobertura API

Foram automatizados os endpoints solicitados:

```text
GET /breeds/list/all
GET /breed/{breed}/images
GET /breeds/image/random
```

Também foi incluído um cenário negativo para consulta de uma raça inexistente.

As validações não ficam restritas ao status HTTP. A suíte verifica, conforme o cenário:

- código de resposta;
- status retornado no payload;
- estrutura do JSON;
- tipos dos dados;
- conteúdo mínimo esperado;
- formato das URLs de imagem;
- comportamento de erro para entrada inválida.

As chamadas HTTP ficam concentradas em `DogApiService`, enquanto os steps permanecem responsáveis pela descrição e validação do comportamento.

## Performance

Os testes de performance foram implementados em JMeter para o fluxo de compra de passagem do BlazeDemo.

Scripts:

```text
performance/jmeter/blazedemo-load.jmx
performance/jmeter/blazedemo-spike.jmx
```

O fluxo exercitado é:

```text
Acessar página inicial
→ pesquisar voos
→ selecionar voo
→ preencher compra
→ confirmar compra
```

Os dados do voo selecionado são extraídos da resposta e reutilizados nas etapas seguintes. Isso evita depender de número de voo, companhia ou preço fixos.

### Critérios de aceitação

O desafio define:

- throughput igual ou superior a **250 requisições por segundo**;
- **p90 inferior a 2 segundos**.

Além dos critérios principais, foram observados p95, p99 e taxa de erros.

### Resultado da execução

| Cenário | Throughput | P90 | P95 | P99 | Erros | Resultado |
|---|---:|---:|---:|---:|---:|---|
| Carga | 195,76 req/s | 5,815 s | 8,158 s | 10,140 s | 1,45% | Não atendido |
| Pico | 149,09 req/s | 8,959 s | 10,254 s | 12,537 s | 4,68% | Não atendido |

Na execução de carga foram processadas 13.909 requisições. O teste chegou a aproximadamente 248,6 req/s em uma janela intermediária, mas não sustentou a vazão exigida durante toda a execução. O resultado consolidado foi de 195,76 req/s e p90 de 5,815 s.

No teste de pico foram processadas 31.508 requisições. O resultado consolidado apresentou throughput de 149,09 req/s e p90 de aproximadamente 8,959 s, além de aumento da taxa de erros para 4,68%.

Nas condições desta execução, os dois critérios de aceitação não foram atendidos.

Por se tratar de um ambiente público e fora do controle do executor, os números não devem ser interpretados isoladamente como capacidade máxima do sistema. Rede, infraestrutura compartilhada e condições do ambiente também podem influenciar o resultado.

A configuração, os comandos e a análise detalhada estão em:

```text
performance/README.md
```

## Decisões técnicas

### Cypress para WEB e API

Cypress foi utilizado para os testes funcionais por atender bem tanto a automação de navegador quanto chamadas HTTP e integração com pipeline.

### Cucumber

Os cenários foram escritos em Gherkin para deixar clara a intenção de negócio e separar a descrição do comportamento dos detalhes de implementação.

### Page Object

A camada WEB utiliza Page Object para concentrar seletores e ações da página. O objetivo é reduzir duplicação sem transformar uma suíte pequena em uma arquitetura excessivamente abstrata.

### Service Object

A API utiliza uma camada de serviço para centralizar endpoints e chamadas HTTP. Os steps não precisam conhecer detalhes de construção das requisições.

### JMeter para performance

Cypress não foi utilizado para geração de carga. Para throughput, concorrência e percentis foi utilizado JMeter, conforme solicitado no desafio.

O `Constant Throughput Timer` trabalha em amostras por minuto. Por isso, o alvo de 250 req/s corresponde a:

```text
250 × 60 = 15.000 requisições/minuto
```

## CI/CD

O workflow em:

```text
.github/workflows/quality-tests.yml
```

executa os testes funcionais em ambiente Linux e publica as evidências disponíveis como artefatos.

Os testes de performance não são executados automaticamente no pipeline, pois geram volume significativo contra um ambiente público. A execução deve ser feita de forma consciente e autorizada.

## Documentação complementar

```text
docs/TEST_STRATEGY.md
docs/TEST_CASES.md
docs/PERFORMANCE_REPORT_TEMPLATE.md
docs/EXECUTION_CHECKLIST.md
```

## Considerações finais

A quantidade de cenários foi mantida intencionalmente enxuta. A prioridade foi cobrir os comportamentos de maior valor do desafio, incluindo cenários negativos, validações de contrato, organização do código, documentação e análise dos resultados de performance.

Na parte de performance, o resultado não foi ajustado para aparentar aprovação. Os números apresentados são os observados na execução e a conclusão foi feita diretamente a partir dos critérios definidos no desafio.
