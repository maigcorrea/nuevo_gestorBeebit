import { StaffType } from '../entities/staff.entity';

export interface UpdateStaffInput {
  email?: string;
  phone?: string;
  password?: string;
  type?: StaffType;
}
