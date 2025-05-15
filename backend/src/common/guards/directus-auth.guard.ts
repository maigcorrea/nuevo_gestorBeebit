import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DirectusAuthGuard implements CanActivate {
  private directusUrl = process.env.DIRECTUS_URL; // ejemplo: http://directus:8055

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se encontró el token');
    }

    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Formato de token inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      const response = await fetch(`${this.directusUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Token inválido');
      }

      const userData = await response.json();

      request.user = userData; // Guardamos los datos del usuario en req.user, como hacía AuthGuard('jwt')

      return true;
    } catch (error) {
      console.error('Error en DirectusAuthGuard:', error);
      throw new UnauthorizedException('Autenticación fallida');
    }
  }
}
