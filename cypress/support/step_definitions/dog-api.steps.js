const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const DogApiService = require('../services/DogApiService')

let response

function expectHttpUrl(value) {
  expect(value, 'URL retornada pela API').to.be.a('string')
  expect(value).to.match(/^https?:\/\//)
}

When('consulto a lista completa de raças', () => {
  DogApiService.getAllBreeds().then((apiResponse) => {
    response = apiResponse
  })
})

When('consulto as imagens da raça {string}', (breed) => {
  DogApiService.getBreedImages(breed).then((apiResponse) => {
    response = apiResponse
  })
})

When('consulto uma imagem aleatória', () => {
  DogApiService.getRandomImage().then((apiResponse) => {
    response = apiResponse
  })
})

Then('a API deve responder com status HTTP {int}', (statusCode) => {
  expect(response.status).to.eq(statusCode)
})

Then('a resposta deve indicar sucesso', () => {
  expect(response.body).to.have.property('status', 'success')
})

Then('a resposta deve indicar erro', () => {
  expect(response.body).to.have.property('status', 'error')
  expect(response.body.message).to.be.a('string').and.not.be.empty
})

Then('a lista de raças deve possuir a estrutura esperada', () => {
  expect(response.body).to.have.all.keys('message', 'status')
  expect(response.body.message).to.be.an('object').and.not.be.empty

  Object.entries(response.body.message).forEach(([breed, subBreeds]) => {
    expect(breed).to.be.a('string').and.not.be.empty
    expect(subBreeds, `sub-raças de ${breed}`).to.be.an('array')
  })
})

Then('devo receber uma lista não vazia de URLs de imagens', () => {
  expect(response.body.message).to.be.an('array').and.not.be.empty
  response.body.message.forEach(expectHttpUrl)
})

Then('devo receber uma URL de imagem válida', () => {
  expectHttpUrl(response.body.message)
})

Then('o payload de erro deve informar o código {int}', (errorCode) => {
  expect(response.body).to.have.property('code', errorCode)
})
