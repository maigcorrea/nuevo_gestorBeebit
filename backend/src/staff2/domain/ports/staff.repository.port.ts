import { Staff } from '../entities/staff.entity';

export interface StaffRepositoryPort {
  save(staff: Staff): Promise<Staff>;
  findAll(): Promise<Staff[]>;
  findByEmail(email: string): Promise<Staff | null>; // por si luego lo necesitas para login
  findById(id: string): Promise<Staff | null>;       // útil para detalle o edición
  findByName(name: string): Promise<Staff | null>;
  update(staff: Staff): Promise<Staff>;              // útil para edición o recuperación
  delete(id: string): Promise<void>;                 // si luego añades soft/hard delete
}
