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

  async upload(file: Express.Multer.File, bucket: string): Promise<string> {
    const filename = Date.now() + '-' + file.originalname;
    await this.client.putObject(bucket, filename, file.buffer);
    return filename;
  }
}