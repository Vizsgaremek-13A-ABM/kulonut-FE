describe('Login Tests', () => {

  it('should show error popup on invalid login', () => {
    cy.visit('/')

    cy.contains('Bejelentkezés').click()

    cy.get('[data-cy="login-submit"]').click()
    cy.get('.swal2-popup', { timeout: 5000 })
      .should('be.visible')
    cy.get('.swal2-title')
      .should('contain', 'Hibás e-mail cím vagy jelszó!')
  })

  it('should login on valid login', () => {
    cy.visit('/')

    cy.contains('Bejelentkezés').click()

    cy.fixture('user').then((user) => {
      cy.get('[data-cy="email"] input').type(user.email)
      cy.get('[data-cy="password"] input').type(user.password)
      cy.get('[data-cy="login-submit"]').click()
      cy.get('[data-cy="user-display-name"]').should('contain', user.display_name)
      cy.get('[data-cy="user-role"]').should('contain', user.role)
    })

  })

})
