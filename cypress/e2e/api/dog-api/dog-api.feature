@api
Feature: Consulta de raças e imagens na Dog API
  Como aplicação consumidora da Dog API
  Quero consultar raças e imagens de cães
  Para disponibilizar essas informações de forma confiável

  @smoke @contract
  Scenario: Listar todas as raças disponíveis
    When consulto a lista completa de raças
    Then a API deve responder com status HTTP 200
    And a resposta deve indicar sucesso
    And a lista de raças deve possuir a estrutura esperada

  @smoke @contract
  Scenario: Consultar imagens de uma raça válida
    When consulto as imagens da raça "hound"
    Then a API deve responder com status HTTP 200
    And a resposta deve indicar sucesso
    And devo receber uma lista não vazia de URLs de imagens

  @smoke @contract
  Scenario: Consultar uma imagem aleatória
    When consulto uma imagem aleatória
    Then a API deve responder com status HTTP 200
    And a resposta deve indicar sucesso
    And devo receber uma URL de imagem válida

  @regression @negative
  Scenario: Consultar imagens de uma raça inexistente
    When consulto as imagens da raça "qa-nonexistent-breed"
    Then a API deve responder com status HTTP 404
    And a resposta deve indicar erro
    And o payload de erro deve informar o código 404
