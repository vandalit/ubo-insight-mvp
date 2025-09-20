/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(): Chainable<void>
    navigateToServiceDetail(serviceName?: string): Chainable<void>
    waitForPageLoad(): Chainable<void>
  }
}
