import { StaffType } from '../entities/staff.entity';

export interface CreateStaffInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  register_date?: Date;
  type?: StaffType;
}