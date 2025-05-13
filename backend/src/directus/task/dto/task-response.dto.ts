export class TaskResponseDto {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'completed' | 'active' | 'pending';
    completed: boolean;
  }
  