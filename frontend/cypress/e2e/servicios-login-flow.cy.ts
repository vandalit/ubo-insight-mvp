describe('Flujo Servicios → Card → Ingresar → Login', () => {
  beforeEach(() => {
    // Visitar la página de servicios
    cy.visit('/servicios');
    
    // Esperar a que la página cargue completamente
    cy.get('app-grid').should('be.visible');
    cy.get('[data-cy="service-card"]').should('have.length.greaterThan', 0);
  });

  it('debe navegar correctamente desde servicios hasta login', () => {
    // Paso 1: Verificar que estamos en la página de servicios
    cy.url().should('include', '/servicios');
    cy.contains('h1', 'Servicios Digitales').should('be.visible');

    // Paso 2: Hacer click en la primera card disponible
    cy.get('[data-cy="service-card"]')
      .first()
      .click();

    // Paso 3: Verificar que se abre la vista detalle
    cy.get('app-detail-view', { timeout: 10000 }).should('be.visible');
    cy.get('.detail-card').should('be.visible');

    // Paso 4: Esperar a que el botón esté disponible y hacer click
    cy.get('.detail-btn-primary', { timeout: 10000 })
      .should('be.visible')
      .should('contain.text', /Ingresar|Acceder/)
      .click();

    // Paso 5: Verificar que navegamos a la página de login
    cy.url({ timeout: 15000 }).should('include', '/login');
    cy.contains('h2', 'UBO Insight').should('be.visible');
    cy.get('form').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('debe mostrar los tabs dinámicos en la página de login', () => {
    // Navegar directamente a login para probar los tabs
    cy.visit('/login');

    // Verificar que los tabs están presentes
    cy.get('[data-cy="product-tab"]').should('have.length', 4);
    
    // Verificar que el primer tab está activo por defecto
    cy.get('[data-cy="product-tab"]').first().should('have.class', 'bg-blue-600');

    // Hacer click en diferentes tabs y verificar que cambia el contenido
    cy.get('[data-cy="product-tab"]').eq(1).click();
    cy.contains('Servicios Digitales Centralizados').should('be.visible');

    cy.get('[data-cy="product-tab"]').eq(2).click();
    cy.contains('Seguridad Institucional Avanzada').should('be.visible');

    cy.get('[data-cy="product-tab"]').eq(3).click();
    cy.contains('Análisis de Datos y Gestión de Contenido').should('be.visible');
  });

  it('debe permitir login con credenciales de testing', () => {
    cy.visit('/login');

    // Usar el botón de acceso rápido
    cy.get('button').contains('uboinsight@ubo.cl').click();

    // Verificar que se redirige al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('UBO Insight').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
  });

  it('debe mostrar el botón dashboard en el footer de manera discreta', () => {
    cy.visit('/');

    // Scroll hasta el footer
    cy.get('footer').scrollIntoView();

    // Verificar que el botón dashboard está presente pero discreto
    cy.get('.dashboard-access', { timeout: 10000 }).should('exist');
    cy.get('.dashboard-access').should('be.visible');

    // Hacer hover y verificar que se hace más visible
    cy.get('.dashboard-access').trigger('mouseover');

    // Click en el botón dashboard (necesita login primero)
    cy.get('.dashboard-access').click();
    
    // Debería redirigir a login porque no estamos autenticados
    cy.url({ timeout: 10000 }).should('include', '/login');
    
    // Ahora hacer login y verificar que llegamos al dashboard
    cy.get('button').contains('uboinsight@ubo.cl').click();
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
  });
});
