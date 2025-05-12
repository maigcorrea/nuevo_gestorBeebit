// src/backend/directus/tasks_staff/dto/task-by-user-response.dto.ts

export class TaskByUserResponseDto {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    status: 'pending' | 'active' | 'completed';
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    associated_project: {
      id: string | null;
      name: string | null;
    };
  }
  