describe('Debug: Botón Ingresar en DetailView', () => {
  beforeEach(() => {
    cy.visit('/servicios');
    cy.get('app-grid').should('be.visible');
  });

  it('debe hacer click en card y abrir DetailView', () => {
    // Verificar que hay cards
    cy.get('[data-cy="service-card"]').should('have.length.greaterThan', 0);
    
    // Click en la primera card
    cy.get('[data-cy="service-card"]').first().click();
    
    // Verificar que se abre el DetailView
    cy.get('app-detail-view').should('be.visible');
    cy.get('.detail-card').should('be.visible');
    
    // Verificar que hay un botón en el DetailView
    cy.get('.detail-btn-primary').should('exist');
    cy.get('.detail-btn-primary').should('be.visible');
    
    // Verificar el texto del botón
    cy.get('.detail-btn-primary').then(($btn) => {
      cy.log('Texto del botón:', $btn.text());
    });
  });

  it('debe hacer click en el botón y verificar logs', () => {
    // Interceptar console.log para capturar los logs
    cy.window().then((win) => {
      cy.stub(win.console, 'log').as('consoleLog');
    });

    // Navegar a DetailView
    cy.get('[data-cy="service-card"]').first().click();
    cy.get('app-detail-view').should('be.visible');
    
    // Click en el botón
    cy.get('.detail-btn-primary').click();
    
    // Verificar que se llamaron los logs de debugging
    cy.get('@consoleLog').should('have.been.called');
    
    // Esperar un poco para ver si hay navegación
    cy.wait(2000);
    
    // Verificar la URL actual
    cy.url().then((url) => {
      cy.log('URL actual después del click:', url);
    });
  });
});
