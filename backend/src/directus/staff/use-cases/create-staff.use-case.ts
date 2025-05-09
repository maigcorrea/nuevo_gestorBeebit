// /directus/staff/use-cases/create-staff.use-case.ts

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CreateStaffUseCase {
  private directusUrl = process.env.DIRECTUS_URL || 'http://directus:8055';

  async execute({
    name,
    email,
    phone,
    password,
    type,
  }: {
    name: string;
    email: string;
    phone: string;
    password: string;
    type: 'admin' | 'user';
  }) {
    // Paso 1: login como API user
    const loginResponse = await fetch(`${this.directusUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gmail.com', // usa tu cuenta con permisos para crear usuarios
        password: 'holaMundo_2',
      }),
    });

    if (!loginResponse.ok) {
      throw new BadRequestException('Error autenticando en Directus');
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.access_token;

    // Paso 2: definir el rol
    const roleName = type === 'admin' ? 'Administrator' : 'StaffRole';

    // Paso 3: obtener el ID del rol por nombre
    const rolesResponse = await fetch(`${this.directusUrl}/roles?filter[name][_eq]=${roleName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rolesData = await rolesResponse.json();
    const roleId = rolesData.data[0]?.id;

    if (!roleId) {
      throw new BadRequestException('Rol no encontrado');
    }

    // Paso 4: crear el nuevo usuario
    
    try {
        const createResponse = await fetch(`${this.directusUrl}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              first_name: name,
              email,
              password,
              role: roleId,
              status: 'active',
              phone, // campo adicional, asegúrate de que existe en `users`
              type,  // campo adicional, asegúrate de que existe en `users`
            }),
          });
      
          if (!createResponse.ok) {
            const error = await createResponse.text();
            console.error('Error al crear el usuario:', error);
            throw new BadRequestException('No se pudo crear el usuario');
          }
      
          const newUser = await createResponse.json();
          return {
            message: 'Usuario creado correctamente',
            user: newUser.data,
          };
    } catch (error) {
        console.log("Error", error);
    }
    
  }
}
