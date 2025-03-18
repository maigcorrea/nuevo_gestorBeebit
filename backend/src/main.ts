import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuración
  const config = new DocumentBuilder()
  .setTitle('Gestor de Proyectos')
  .setDescription('API del gestor Beebit')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api


  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
