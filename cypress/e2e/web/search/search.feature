@web
Feature: Pesquisa de artigos no Blog do Agi
  Como leitor do blog
  Quero pesquisar conteúdos por palavra-chave
  Para encontrar artigos relacionados ao assunto de interesse

  Background:
    Given que acesso o Blog do Agi

  @smoke @positive
  Scenario: Pesquisar por um termo que possui resultados
    When pesquiso pelo termo "Pix"
    Then a busca deve ser realizada para o termo informado
    And devo visualizar ao menos um resultado relacionado à pesquisa

  @regression @negative
  Scenario: Pesquisar por um termo sem resultados
    When pesquiso pelo termo "qaautomatizado987654321"
    Then a busca deve ser realizada para o termo informado
    And não devo visualizar artigos correspondentes ao termo pesquisado
