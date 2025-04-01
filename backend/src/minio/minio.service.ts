import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'admin',
      secretKey: 'admin123',
    });
  }

  //Cargar la imagen al bucket en minio
  async upload(file: Express.Multer.File, bucket: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('Archivo no recibido o está vacío');
    }
    
    const filename = Date.now() + '-' + file.originalname;
    await this.client.putObject(bucket, filename, file.buffer);

    //Devolver una url pública para acceder a la imagen (bucket sin restricciones)
    const url = `http://localhost:9000/${bucket}/${filename}`;

    return url;
  }


}