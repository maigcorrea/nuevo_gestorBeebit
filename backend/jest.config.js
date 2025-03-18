module.exports = {
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',  // Usamos ts-jest para trabajar con TypeScript
    },
    testEnvironment: 'node',  // Especificamos que estamos usando un entorno de Node.js
    moduleFileExtensions: ['js', 'json', 'ts'],  // Extensiones de archivo que Jest reconocerá
    rootDir: './',  // Directorio raíz de la aplicación
    testRegex: '.*\\.spec\\.ts$',  // Archivos de pruebas que terminarán en .spec.ts
    collectCoverage: true,  // Opcional: para recolectar cobertura de código
    coverageDirectory: 'coverage',  // Carpeta donde se guardará la cobertura
  };
  
  