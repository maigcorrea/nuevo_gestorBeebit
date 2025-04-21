import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { CreateProjectDto } from '../dto/create-project.dto';
  import { ProjectResponseDto } from '../dto/project-response.dto';
  import { CreateProjectUseCase } from 'src/project2/application/use-cases/create-project.use-case';
  import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
  import { AuthGuard } from '@nestjs/passport';
  import { AbilitiesGuard } from 'src/casl/abilities.guard';
  import { CheckAbilities } from 'src/casl/check-abilities.decorator';
  import { Project } from 'src/project2/domain/entities/project.entity';
  import { Request } from 'express';
  import { Staff } from 'src/staff2/domain/entities/staff.entity';
  import { ProjectMapper } from '../mappers/project.mapper';
  
  @ApiTags('Projects')
  @Controller('projects')
  export class ProjectController {
    constructor(
      private readonly createProjectUseCase: CreateProjectUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}
  
    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'create', subject: Project })
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Formulario para crear un proyecto con archivo',
      type: CreateProjectDto,
    })
    @ApiOperation({ summary: 'Crear proyecto' })
    @ApiResponse({
      status: 201,
      description: 'Proyecto creado correctamente',
      type: ProjectResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() createProjectDto: CreateProjectDto,
      @Req() req: Request,
    ): Promise<ProjectResponseDto> {
      const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
  
      const createdProject = await this.createProjectUseCase.execute(
        createProjectDto,
        ability,
        file,
      );
  
      return ProjectMapper.toResponseDto(createdProject);
    }
  }
  