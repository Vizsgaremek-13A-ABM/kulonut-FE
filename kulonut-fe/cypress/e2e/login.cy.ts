describe('Login Tests', () => {

  it('should show login header', () => {
  cy.visit('/')
  cy.contains('Bejelentkezés')
  })
  it('should show error popup on empty login', () => {
    cy.visit('/')


    cy.get('[data-cy="login-submit"]').click()
    cy.get('.swal2-popup', { timeout: 5000 })
      .should('be.visible')
    cy.get('.swal2-title')
      .should('contain', 'Hibás e-mail cím vagy jelszó!')
  })

  it('should login on valid login', () => {
    cy.visit('/')

    cy.fixture('user').then((user) => {
      cy.get('[data-cy="email"] input').type(user.email)
      cy.get('[data-cy="password"] input').type(user.password)
      cy.get('[data-cy="login-submit"]').click()
      cy.get('[data-cy="user-display-name"]').should('contain', user.display_name)
      cy.get('[data-cy="user-role"]').should('contain', user.role)
    })

  })

})
