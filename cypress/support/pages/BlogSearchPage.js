class BlogSearchPage {
  selectors = {
    searchTrigger: '.ast-header-search a.astra-search-icon',
    resultArticle: 'article',
  }

  visit() {
    cy.viewport(1440, 900)
    cy.visit(Cypress.expose('webUrl'))
    cy.location('hostname').should('match', /blog\.agibank\.com\.br|blogdoagi\.com\.br/)
  }

  search(term) {
    // A busca do WordPress é baseada no parâmetro GET "s".
    // Validamos que o recurso está disponível no cabeçalho e seguimos para a URL real de pesquisa.
    cy.get(this.selectors.searchTrigger)
      .filter(':visible')
      .first()
      .should('be.visible')

    const baseUrl = Cypress.expose('webUrl').replace(/\/$/, '')
    cy.visit(`${baseUrl}/?s=${encodeURIComponent(term)}`)
  }

  validateSearchTerm(term) {
    cy.location('search', { timeout: 15000 }).should((queryString) => {
      const params = new URLSearchParams(queryString)
      expect((params.get('s') || '').toLowerCase()).to.eq(term.toLowerCase())
    })
  }

  validateResultsFor() {
    cy.get('body', { timeout: 15000 })
      .should('not.contain.text', 'Internal Server Error')
      .and('have.class', 'search-results')

    cy.get(this.selectors.resultArticle, { timeout: 15000 }).should(($articles) => {
      expect($articles.length, 'quantidade de artigos retornados').to.be.greaterThan(0)
    })
  }

  validateNoMatchingArticle() {
    cy.get('body', { timeout: 15000 })
      .should('not.contain.text', 'Internal Server Error')
      .and('have.class', 'search-no-results')
  }
}

module.exports = new BlogSearchPage()
