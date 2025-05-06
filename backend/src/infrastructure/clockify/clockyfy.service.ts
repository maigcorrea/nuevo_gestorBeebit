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
    assigneeIds=[],
  }: {
    name: string;
    projectId: string;
    workspaceId: string;
    assigneeIds?: string[];
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        assigneeIds,
      }),
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error creando tarea en Clockify: ${response.status} ${text}`);
    }
  
    return response.json(); // contiene el clockifyTaskId como `id`
  }
 

  //NO ME SIRVE PORQUE CON EL PLAN GRATUITO NO SE PUEDE INVITAR A TRAVÉS DE LA API
  //Invitar un usuario al Workspace
  /*async inviteUserToWorkspace({
    email,
    workspaceId,
  }: {
    email: string;
    workspaceId: string;
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/users`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error invitando al usuario a Clockify: ${response.status} - ${errorText}`);
    }
  }*/




  //Recuperar el id de Clockify de un empleado después de que haya aceptado la invitación a Clockify
  async getClockifyUserIdByEmail(email: string): Promise<string | null> {
    const workspaceId = this.getWorkspaceId(); // puedes cambiar esto si prefieres pasarlo como parámetro
  
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/users`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al obtener usuarios de Clockify: ${response.status} ${text}`);
    }
  
    const users = await response.json();
  
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
    return user ? user.id : null;
  }


  async startTimeEntry({
    userId,
    projectId,
    taskId,
    description = 'Trabajo en tarea',
  }: {
    userId: string;
    projectId: string;
    taskId: string;
    description?: string;
  }): Promise<any> {
    const workspaceId = this.getWorkspaceId();
    const now = new Date().toISOString();// hora actual en formato UTC
  
    const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/time-entries`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start:now,
        description: description || 'Entrada de tiempo',
        projectId,
        taskId,
        billable: false,
        type: 'REGULAR',
      }),
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al iniciar time entry en Clockify: ${response.status} ${text}`);
    }
  
    return response.json();
  }



  //Obtener la entrada activa actual del usuario
  async getRunningTimeEntry(userId: string): Promise<any> {
    const workspaceId = this.getWorkspaceId();

    const res = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/user/${userId}/time-entries?in-progress=true`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error al obtener time entry: ${res.status} ${text}`);
    }
  
    const data = await res.json();
    if (!data.length) throw new Error('No hay time entry activo para este usuario');
  
    return data[0];
  }







  async getAllRunningTimeEntries(): Promise<any[]> {
    const workspaceId = this.getWorkspaceId();
  
    const res = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/time-entries/status/in-progress`, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error al obtener time entries en progreso: ${res.status} ${text}`);
    }
  
    const data = await res.json();
    return data; // Devuelve todas las entradas en progreso
  }





  async stopTimeEntryById(timeEntryId: string): Promise<any> {
    const workspaceId = this.getWorkspaceId();
  const now = new Date().toISOString();

  // 1. Obtener el time entry actual para saber el valor de `start`
  const getResponse = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/time-entries/${timeEntryId}`, {
    headers: {
      'X-Api-Key': this.apiKey,
    },
  });

  if (!getResponse.ok) {
    const text = await getResponse.text();
    throw new Error(`Error obteniendo time entry: ${getResponse.status} ${text}`);
  }

  const timeEntry = await getResponse.json();

  // 2. Enviar PUT con start original y end actual
  const putResponse = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/time-entries/${timeEntryId}`, {
    method: 'PUT',
    headers: {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start: timeEntry.timeInterval.start,
      end: now,
    }),
  });

  if (!putResponse.ok) {
    const text = await putResponse.text();
    throw new Error(`Error al detener time entry: ${putResponse.status} ${text}`);
  }

  return putResponse.json();
  }






  async deleteTaskOnClockify(clockifyProjectId: string, clockifyTaskId: string): Promise<void> {
    console.log("ENTRANDO A DELETETASKONCLOCKIFY");
    const workspaceId = this.getWorkspaceId();

     // 1. Cambiar estado a DONE (requerido por Clockify para poder eliminar)
  const updateUrl = `${this.baseUrl}/workspaces/${workspaceId}/projects/${clockifyProjectId}/tasks/${clockifyTaskId}`;
  const updateRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Tarea eliminada', // Clockify requiere nombre aunque solo cambies status
      status: 'DONE',
    }),
  });

  if (!updateRes.ok) {
    const text = await updateRes.text();
    throw new Error(`Error al actualizar la tarea en Clockify: ${updateRes.status} ${text}`);
  }
  
    const res = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/projects/${clockifyProjectId}/tasks/${clockifyTaskId}`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error al borrar la tarea en Clockify: ${res.status} ${text}`);
    }
  }
}
