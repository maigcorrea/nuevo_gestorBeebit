import { Injectable, BadRequestException } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';


@Injectable()
export class UploadProfilePictureUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(fileBuffer: Buffer, filename: string, token: string, userId: string): Promise<{ url: string }> {
    if (!fileBuffer || !filename) {
      throw new BadRequestException('Archivo no válido');
    }

    const formData = new FormData();
    formData.append('file', fileBuffer, { filename });

    const uploadResponse = await axios.post<any>(`${this.directusUrl}/files`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    });

    if (!uploadResponse.data?.data?.id) {
      console.error('❌ Error subiendo imagen:', uploadResponse.data);
      throw new BadRequestException('Error subiendo imagen de perfil');
    }

    const fileId = uploadResponse.data.data.id;

    const patchResponse = await axios.patch<any>(`${this.directusUrl}/users/${userId}`, {
      avatar: fileId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!patchResponse.data?.data?.id) {
      console.error('❌ Error actualizando avatar:', patchResponse.data);
      throw new BadRequestException('Error actualizando el avatar del usuario');
    }

    const imageUrl = `${this.directusUrl}/assets/${fileId}`;

    return { url: imageUrl };
  }
}
