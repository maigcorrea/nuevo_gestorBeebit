import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';


@Injectable()
export class MinioService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: (this.configService.get('MINIO_ENDPOINT')|| 'localhost'),
      port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000'),
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    })
  }

  
  //Cargar la imagen al bucket en minio
  async upload(file: Express.Multer.File, path: string): Promise<{url: string, filename: string}> {
    
    if (!file || !file.buffer) {
      throw new Error('Archivo no recibido o está vacío');
    }
    const bucketName = this.configService.get('MINIO_BUCKET') || 'archivos';
    const publicUrl = this.configService.get('MINIO_PUBLIC_URL');

    //const filename = Date.now() + '-' + file.originalname;
    await this.client.putObject(bucketName, path, file.buffer);

    //Devolver una url pública para acceder a la imagen (bucket sin restricciones)
    const url = `${publicUrl}/${bucketName}/${path}`;

    return {
      url,
      filename: file.originalname,
    };
  }


  getUrl(fileName: string): string {
    const bucket = this.configService.get('MINIO_BUCKET');
    const publicUrl = this.configService.get('MINIO_PUBLIC_URL');
  
    return `${publicUrl}/${bucket}/${fileName}`;
  }

}