// /directus/directus.module.ts

import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [StaffModule],
})
export class DirectusModule {}
