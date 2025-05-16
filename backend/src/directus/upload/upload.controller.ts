// src/directus/upload/upload.controller.ts

import { Controller, Post, UploadedFile, UseInterceptors, Req, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('directus/upload')
export class UploadController {

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('No se encontró el token de autorización');
    }

    const token = authorization.split(' ')[1];

    const formData = new FormData();
    formData.append('file', new Blob([file.buffer]), file.originalname);

    const response = await fetch(`${process.env.DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData as any,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Error subiendo archivo');
    }

    return data.data;
  }
}
