import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch'; // Asegúrate de tener fetch o usar import si lo tienes global

@Injectable()
export class CreateProjectUseCase {
  async execute(data: any, authToken: string): Promise<any> {
    try {
      const response = await fetch(`${process.env.DIRECTUS_URL}/items/Project`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Directus devuelve errores en result.errors
        throw new Error(result.errors?.[0]?.message || 'Error creando el proyecto');
      }

      return result.data;
    } catch (error) {
      throw new Error(`Error creando proyecto: ${error.message}`);
    }
  }
}
