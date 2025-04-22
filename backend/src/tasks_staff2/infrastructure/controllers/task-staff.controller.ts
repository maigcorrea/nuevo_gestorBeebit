import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  import { AbilitiesGuard } from 'src/casl/abilities.guard';
  import { CheckAbilities } from 'src/casl/check-abilities.decorator';
  import { TaskStaff } from 'src/tasks_staff2/domain/entities/task-staff.entity';
  import { CreateTaskStaffDto } from '../dto/create-task-staff-dto';
  import { TaskStaffMapper } from '../mappers/task-staff.mapper';
  import { CreateTaskStaffUseCase } from 'src/tasks_staff2/application/use-cases/create-task-staff.use-case';
  import { Staff } from 'src/staff2/domain/entities/staff.entity';
  import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
  import { TaskStaffOrmEntity as TaskStaffSubject } from '../persistence/task-staff.typeorm.entity';
  import { TaskStaffOrmEntity } from '../persistence/task-staff.typeorm.entity';
  import { StaffOrmEntity } from 'src/staff2/infrastructure/persistence/staff.orm-entity';
  
  @ApiTags('task_staff')
  @Controller('task_staff')
  export class TaskStaffController {
    constructor(
      private readonly createTaskStaffUseCase: CreateTaskStaffUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}
  
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: TaskStaffSubject })
    @Post()
    @ApiOperation({ summary: 'Crear relación entre un empleado y una tarea' })
    @ApiResponse({ status: 200, description: 'Relación creada correctamente' })
    @ApiResponse({ status: 404, description: 'Error. No se ha podido crear la relación' })
    async create(@Body() dto: CreateTaskStaffDto, @Req() req: Request) {
      const ability = this.caslAbilityFactory.createForUser(req.user as StaffOrmEntity);
      const input = TaskStaffMapper.toCreateInput(dto);
      return this.createTaskStaffUseCase.execute(input, ability);
    }
  }
  