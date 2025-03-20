describe('Página de inicio', () => {
    it('Debería cargar el home y mostrar el título', () => {
      cy.visit('http://localhost:3001'); // Cambia la URL si es diferente
      cy.contains('Login');              // Busca un texto "Login" en la página
    });
  });