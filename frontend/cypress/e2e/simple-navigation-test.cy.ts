describe('Test de Navegación Simplificado', () => {
  
  it('debe cargar la página de servicios correctamente', () => {
    cy.visit('/servicios');
    cy.contains('h1', 'Servicios Digitales').should('be.visible');
    cy.get('app-grid').should('be.visible');
    cy.get('[data-cy="service-card"]').should('have.length.greaterThan', 0);
  });

  it('debe abrir DetailView al hacer click en una card', () => {
    cy.visit('/servicios');
    cy.get('[data-cy="service-card"]').first().click();
    cy.get('app-detail-view').should('be.visible');
    cy.get('.detail-card').should('be.visible');
  });

  it('debe tener botón funcional en DetailView', () => {
    cy.visit('/servicios');
    cy.get('[data-cy="service-card"]').first().click();
    cy.get('app-detail-view').should('be.visible');
    cy.get('.detail-btn-primary').should('be.visible');
    cy.get('.detail-btn-primary').should('contain.text', /Ingresar|Acceder/);
  });

  it('debe navegar a login desde DetailView', () => {
    cy.visit('/servicios');
    cy.get('[data-cy="service-card"]').first().click();
    cy.get('app-detail-view').should('be.visible');
    
    // Click en el botón y verificar navegación
    cy.get('.detail-btn-primary').click();
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('debe mostrar tabs dinámicos en login', () => {
    cy.visit('/login');
    cy.get('[data-cy="product-tab"]').should('have.length', 4);
    cy.get('[data-cy="product-tab"]').first().should('have.class', 'bg-blue-600');
  });

  it('debe permitir login rápido', () => {
    cy.visit('/login');
    cy.get('button').contains('uboinsight@ubo.cl').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });
});
