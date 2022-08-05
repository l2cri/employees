// https://docs.cypress.io/api/table-of-contents

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h2', 'Список сотрудников')
  })

  function editElement( el= []) {
    cy.get('div.col-sm-12.col-12:nth-child(1) input').clear().type(el[0]).should('have.value', el[0])

    cy.get('div.col-sm-12.col-12:nth-child(2) input').click()
    cy.get('button.v-btn.v-date-picker-table__current').click()

    cy.get('div.col-sm-12.col-12:nth-child(3) input').clear().type(el[1]).should('have.value', el[1])

    cy.get('div.col-sm-12.col-12:nth-child(4) input').clear().type(el[2]).should('have.value', el[2])

    cy.contains('button', 'Сохранить').click()
  }

  function checkElement(el) {
    cy.contains('tbody tr:last-child td:nth-child(1)', el[0])
    cy.contains('tbody tr:last-child td:nth-child(3)', el[1])
    cy.contains('tbody tr:last-child td:nth-child(4)', el[2])
  }

  it('add form', () => {
    cy.contains('button', 'Добавить').click()

    editElement(['Mr Simon', 'Engineer', 100000])

    checkElement(['Mr Simon', 'Engineer', 100000])
  })

  it('edit element', () => {
    cy.get('tbody tr:last-child button.mdi-pencil').click()

    editElement(['Mrs Kelsy', 'Farmer', 200000])
    checkElement(['Mrs Kelsy', 'Farmer', 200000])
  })

  it('delete element', () => {
    cy.get('tbody tr:last-child button.mdi-delete').click()

    cy.get('tbody tr:last-child').should('not.have.text', 'Mr Simon2022-08-05Engineer1000028293031')
  })
})
