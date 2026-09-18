class DogApiService {
  get baseUrl() {
    return Cypress.expose('apiUrl')
  }

  getAllBreeds() {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/breeds/list/all`,
    })
  }

  getBreedImages(breed) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/breed/${breed}/images`,
      failOnStatusCode: false,
    })
  }

  getRandomImage() {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/breeds/image/random`,
    })
  }
}

module.exports = new DogApiService()
