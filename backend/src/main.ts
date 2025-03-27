import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Si el frontend y el backend están en puertos diferentes, es necesario activar el CORS para transferir los datos
  app.enableCors({
    origin: 'http://localhost:3001', // tu frontend
    credentials: true,
  })

  // ✅ Activamos el ValidationPipe globalmente para todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Ignora campos que no están en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían campos que no están en el DTO
      transform: true,            // Convierte automáticamente tipos de datos
    }),
  );

  // ✅ Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Gestor de Proyectos')
    .setDescription('API del gestor Beebit')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt' // <- este nombre debe coincidir con tu AuthGuard('jwt')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  // ✅ Arrancamos el servidor en el puerto que indique la variable de entorno o 3000
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

