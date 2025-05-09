import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LoginUseCase {
  private directusUrl = process.env.DIRECTUS_URL;

  async execute(email: string, password: string) {
    // Paso 1: login como admin para obtener token
    try {
      const loginResponse = await fetch(`${this.directusUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!loginResponse.ok) {
        const errorData = await loginResponse.text(); // o .json() si estás seguro que responde JSON
        console.error('❌ Error de login en Directus:', errorData);
        throw new UnauthorizedException('No se pudo autenticar como admin');
      }
  
      const loginData = await loginResponse.json();
      const token = loginData.data.access_token;
      console.log("TOKEN", token);
  
  
      return {
        message:"Login correcto",
        token,
      };
    } catch (error) {
      console.error('❌ Error en LoginUseCase:', error);
      throw new UnauthorizedException('Error en el proceso de login');
    }
    
   
  }
}
