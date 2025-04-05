import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService], // 👈 Esto permite que otros módulos usen el servicio
})
export class MinioModule {}