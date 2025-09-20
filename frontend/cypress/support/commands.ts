/// <reference types="cypress" />

// Comandos personalizados para UBO Insight MVP
Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login');
  cy.get('button').contains('uboinsight@ubo.cl').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('navigateToServiceDetail', (serviceName?: string) => {
  cy.visit('/servicios');
  cy.get('app-grid').should('be.visible');
  
  if (serviceName) {
    cy.get('[data-cy="service-card"]').contains(serviceName).click();
  } else {
    cy.get('[data-cy="service-card"]').first().click();
  }
  
  cy.get('app-detail-view').should('be.visible');
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.wait(500); // Pequeña espera para asegurar que todo esté cargado
});
