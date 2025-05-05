export interface CreateTaskInput {
    title: string;
    description: string;
    associated_project_id: string;
    start_date?: string; // opcional, puede venir como string ISO
    priority: 'high' | 'medium' | 'low';
    staffIds?: string[];
  }