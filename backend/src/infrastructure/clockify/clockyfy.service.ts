import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class ClockifyService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CLOCKIFY_API_URL') || 'https://api.clockify.me/api/v1';
    this.apiKey = this.configService.get<string>('CLOCKIFY_API_KEY')!;
    console.log('[CLOCKIFY] API Key:', this.apiKey);
  }

  async getWorkspaces(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/workspaces`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Clockify error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }


  getWorkspaceId(): string {
    return this.configService.get<string>('CLOCKIFY_WORKSPACE_ID')!;
  }


  
  async getUser(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Clockify error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }



  //Añadir un proyecto que se acaba de crear a clockify
  async createProjectOnClockify({
    name,
    workspaceId,
  }: {
    name: string;
    workspaceId: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/projects`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        clientId: null,
        isPublic: true,
      }),
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error creando proyecto en Clockify: ${response.status} ${text}`);
    }
  
    return response.json();
  }


  //Añadir una tarea asociada a un proyecto a Clockify
  async createTaskOnClockify({
    name,
    projectId,
    workspaceId,
  }: {
    name: string;
    projectId: string;
    workspaceId: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error creando tarea en Clockify: ${response.status} ${text}`);
    }
  
    return response.json(); // contiene el clockifyTaskId como `id`
  }
 
}
