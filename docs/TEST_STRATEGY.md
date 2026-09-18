# Estratégia de Testes

## 1. Objetivo

Cobrir os comportamentos solicitados no desafio nas camadas WEB, API e Performance, mantendo a solução simples de executar e com evidências suficientes para análise de falhas.

## 2. Escopo

### WEB

Funcionalidade de pesquisa de artigos do Blog do Agi.

Riscos principais:

- pesquisa não retorna conteúdo existente;
- pesquisa sem correspondência apresenta conteúdo indevido;
- mudanças de layout quebrarem seletores da automação.

### API

Endpoints cobertos:

- `GET /breeds/list/all`;
- `GET /breed/{breed}/images`;
- `GET /breeds/image/random`.

Riscos principais:

- indisponibilidade/erro HTTP;
- payload incompatível com o contrato esperado;
- lista ou URL de imagem em formato inválido;
- tratamento inadequado de raça inexistente.

### Performance

Fluxo de compra no BlazeDemo até a confirmação.

Riscos principais:

- não sustentar 250 req/s;
- p90 acima de 2 s;
- aumento de erros durante carga/pico;
- degradação sem recuperação após o pico.

## 3. Priorização

Foi usada uma combinação simples de impacto e frequência:

| Cobertura | Prioridade | Motivo |
| --- | --- | --- |
| Busca WEB positiva | Alta | Fluxo principal solicitado |
| Busca WEB sem resultado | Alta | Tratamento funcional relevante |
| Lista de raças | Alta | Base para consumo da aplicação |
| Imagens por raça | Alta | Endpoint principal do caso de uso |
| Imagem aleatória | Alta | Endpoint obrigatório |
| Raça inexistente | Média/Alta | Valida tratamento de erro |
| Carga a 250 req/s | Alta | Critério de aceite explícito |
| Pico e recuperação | Alta | Critério explícito do desafio |

## 4. Abordagem de automação

### Cypress + JavaScript + Cucumber

Cypress é usado para WEB e API funcional. Cucumber mantém os cenários legíveis sem colocar detalhes de implementação no Gherkin.

Na WEB, Page Object concentra interação e seleção de elementos. Na API, Service Object concentra endpoints e chamadas HTTP. As asserções continuam próximas dos cenários para evitar esconder regra de negócio em excesso de abstrações.

### JMeter

Performance fica isolada em JMeter. O Cypress não foi usado para gerar carga porque seu foco é teste funcional, não geração de throughput controlado.

## 5. Dados de teste

- WEB: `cartão` como termo conhecido e uma string improvável como termo sem correspondência.
- API: `hound` como raça válida e `qa-nonexistent-breed` como inválida.
- Performance: dados fictícios de usuário/cartão em CSV.

Os dados não dependem de credenciais ou informações pessoais reais.

## 6. Critérios de entrada

- URLs públicas acessíveis;
- Node.js e dependências instaladas para Cypress;
- Java/JMeter disponíveis para performance;
- autorização para executar carga no ambiente alvo.

## 7. Critérios de saída

Funcional:

- cenários obrigatórios executados;
- falhas analisadas e evidenciadas;
- relatório HTML do Cypress disponível.

Performance:

- `.jtl` e dashboard HTML gerados;
- throughput e p90 coletados;
- taxa de erro registrada;
- conclusão objetiva sobre o critério de aceite.

## 8. Limitações e premissas

O domínio informado no desafio (`blogdoagi.com.br`) atualmente redireciona para `blog.agibank.com.br`. A automação usa o domínio final para evitar instabilidade causada exclusivamente pelo redirecionamento.

O Blog do Agi não expõe identificadores de teste. Por isso, os seletores priorizam atributos semânticos existentes na página. Caso o time controle a aplicação, a recomendação seria adicionar `data-testid` estáveis aos elementos críticos.

BlazeDemo é público. Resultado de performance nesse ambiente não deve ser interpretado como benchmark de uma infraestrutura controlada pelo candidato.
