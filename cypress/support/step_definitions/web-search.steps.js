const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const BlogSearchPage = require('../pages/BlogSearchPage')

let searchedTerm

Given('que acesso o Blog do Agi', () => {
  BlogSearchPage.visit()
})

When('pesquiso pelo termo {string}', (term) => {
  searchedTerm = term
  BlogSearchPage.search(term)
})

Then('a busca deve ser realizada para o termo informado', () => {
  BlogSearchPage.validateSearchTerm(searchedTerm)
})

Then('devo visualizar ao menos um resultado relacionado à pesquisa', () => {
  BlogSearchPage.validateResultsFor(searchedTerm)
})

Then('não devo visualizar artigos correspondentes ao termo pesquisado', () => {
  BlogSearchPage.validateNoMatchingArticle()
})
