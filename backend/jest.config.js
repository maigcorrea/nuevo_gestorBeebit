module.exports = {
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',  // Usamos ts-jest para trabajar con TypeScript. Transforma TypeScript a JavaScript
    },
    testEnvironment: 'node',  // Especificamos que estamos usando un entorno de Node.js
    moduleFileExtensions: ['js', 'json', 'ts'],  // Extensiones de archivo que Jest reconocerá
    rootDir: 'src',  // Empieza a buscar los .spec.ts dentro de la carpeta src
    testRegex: '.*\\.spec\\.ts$', // Busca archivos que terminen en .spec.ts
    collectCoverage: true,  // Opcional: para recolectar cobertura de código
    coverageDirectory: '../coverage', // ✅ Cambiado porque ahora rootDir es src (hay que subir un nivel)
  };
  
  