describe('Blog ', function () {

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Sepi Myrsky',
      username: 'sepi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Log in')
  })

  it('login form can be opened', function () {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('sepi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Sepi Myrsky logged in')
      cy.get('#logout-button').click()
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('seppo')
      cy.get('#password').type('vaara')
      cy.get('#login-button').click()

      cy.get('.fail').should('contain', 'wrong credentials')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('login').click()
      cy.get('#username').type('sepi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function () {
      cy.contains('add blog').click()
      cy.get('#newtitle').type('testing with cypress')
      cy.get('#newauthor').type('author is cypress')
      cy.get('#newurl').type('www.cypress.com')

      cy.contains('save').click()

      cy.contains('testing with cypress')
      cy.contains('author is cypress')

      cy.get('#logout-button').click()
    })

    it('a blog can be liked', function () {
      cy.contains('add blog').click()
      cy.get('#newtitle').type('testing with cypress')
      cy.get('#newauthor').type('author is cypress')
      cy.get('#newurl').type('www.cypress.com')

      cy.contains('save').click()
      cy.contains('View').click()
      cy.contains('like').click()

      cy.contains('1')
      cy.get('#logout-button').click()
    })

    it('a blog can be deleted', function () {
      cy.contains('add blog').click()
      cy.get('#newtitle').type('testing with cypress')
      cy.get('#newauthor').type('author is cypress')
      cy.get('#newurl').type('www.cypress.com')

      cy.contains('save').click()
      cy.contains('View').click()
      cy.contains('remove').click()

      cy.get('body').should('not.contain', 'www.cypress.com')
      cy.get('#logout-button').click()
    })

    it('blogs are ordered by likes', function () {
      cy.contains('add blog').click()
      cy.get('#newtitle').type('testing with cypress')
      cy.get('#newauthor').type('author is cypress')
      cy.get('#newurl').type('www.cypress.com')

      cy.contains('save').click()
      cy.contains('add blog').click()

      cy.get('#newtitle').type('second blog')
      cy.get('#newauthor').type('other author')
      cy.get('#newurl').type('www.some.com')

      cy.contains('save').click()

      cy.get('.borderStyle').then(blogDivs => {
        cy.wrap(blogDivs[0]).contains('View').click()
        cy.wrap(blogDivs[1]).contains('View').click()
        cy.wrap(blogDivs[0]).contains('0')
        cy.wrap(blogDivs[1]).contains('0')
      })

      cy.contains('www.cypress.com').parent().contains('like').click()

      cy.get('.borderStyle').then(blogDivs => {
        cy.wrap(blogDivs[0]).contains('1')
        cy.wrap(blogDivs[1]).contains('0')
        cy.wrap(blogDivs[0]).contains('testing with cypress')
        cy.wrap(blogDivs[1]).contains('second blog')
      })

      cy.contains('www.some.com').parent().contains('like').click()

      cy.get('.borderStyle').then(blogDivs => {
        cy.wrap(blogDivs[0]).contains('1')
        cy.wrap(blogDivs[1]).contains('1')
        cy.wrap(blogDivs[0]).contains('testing with cypress')
        cy.wrap(blogDivs[1]).contains('second blog')
      })

      cy.contains('www.some.com').parent().contains('like').click()
      cy.contains('www.some.com').parent().contains('like').click()
      cy.contains('www.some.com').parent().contains('like').click()

      cy.wait(500)

      cy.get('.borderStyle').then(blogDivs => {
        cy.wrap(blogDivs[0]).contains('4')
        cy.wrap(blogDivs[1]).contains('1')
        cy.wrap(blogDivs[0]).contains('second blog')
        cy.wrap(blogDivs[1]).contains('testing with cypress')
      })
    })
  })
})

