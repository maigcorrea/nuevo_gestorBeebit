import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Get,
    NotFoundException,
    Param
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
  import { FindAllProjectsUseCase } from 'src/project2/application/use-cases/find-all-projects.use-case';
  import { Project as ProjectSubject } from 'src/project/entities/project.entity';
  import { FindProjectsByTitleUseCase } from 'src/project2/application/use-cases/find-projects-by-title.use-case';
  import { FindProjectsByStatusUseCase } from 'src/project2/application/use-cases/find-projects-by-status.use-case';
  import { OrderProjectsByStartDateDescUseCase } from 'src/project2/application/use-cases/order-projects-by-start-date-desc.use-case';
  import { OrderProjectsByStartDateAscUseCase } from 'src/project2/application/use-cases/order-projects-by-start-date-asc.use-case';
  
  @ApiTags('Projects')
  @Controller('projects')
  export class ProjectController {
    constructor(
      private readonly createProjectUseCase: CreateProjectUseCase,
      private readonly caslAbilityFactory: CaslAbilityFactory,
      private readonly findAllProjectsUseCase: FindAllProjectsUseCase,
      private readonly findProjectsByTitleUseCase: FindProjectsByTitleUseCase,
      private readonly findProjectsByStatusUseCase: FindProjectsByStatusUseCase,
      private readonly orderProjectsByStartDateDescUseCase: OrderProjectsByStartDateDescUseCase,
      private readonly orderProjectsByStartDateAscUseCase: OrderProjectsByStartDateAscUseCase,
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







    @ApiBearerAuth('jwt')
    @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
    @CheckAbilities({ action: 'read', subject: ProjectSubject })
    @Get()
    @ApiOperation({ summary: 'Listar todos los proyectos' })
    @ApiResponse({
        status: 200,
        description: 'Listado de proyectos',
        type: [ProjectResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No se encontraron proyectos' })
    async findAll(@Req() req: Request): Promise<ProjectResponseDto[]> {
        const ability = this.caslAbilityFactory.createForUser(req.user as Staff);
        const projects = await this.findAllProjectsUseCase.execute(ability);

        if (!projects.length) {
            throw new NotFoundException('No se encontraron proyectos');
        }

        return projects.map(ProjectMapper.toResponseDto);
    }











    @Get('filter/title/:title')
    @ApiOperation({ summary: 'Listar proyectos según su título' })
    @ApiResponse({
        status: 200,
        description: 'Listado de proyectos según título',
        type: [ProjectResponseDto],
    })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async findByTitle(@Param('title') title: string): Promise<ProjectResponseDto[]> {
        const projects = await this.findProjectsByTitleUseCase.execute(title);

        if (!projects.length) {
            throw new NotFoundException('No se encontraron proyectos con ese título');
        }

        return projects.map(ProjectMapper.toResponseDto);
    }








    @Get('filter/state/:state')
    @ApiOperation({ summary: 'Listar proyectos según su estado' })
    @ApiResponse({
      status: 200,
      description: 'Listado de proyectos según estado',
      type: [ProjectResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No se encontraron proyectos' })
    async findByStatus(
      @Param('state') state: string,
    ): Promise<ProjectResponseDto[]> {
      const projects = await this.findProjectsByStatusUseCase.execute(state);

      if (!projects.length) {
        throw new NotFoundException(
          'No se encontraron proyectos con ese estado',
        );
      }

      return projects.map(ProjectMapper.toResponseDto);
    }

    



    @Get('order/start-date/desc')
    @ApiOperation({ summary: 'Listar proyectos ordenados por fecha de inicio (más reciente a más antigua)' })
    @ApiResponse({
      status: 200,
      description: 'Listado de proyectos ordenados',
      type: [ProjectResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No se encontraron proyectos' })
    async orderByStartDateDesc(): Promise<ProjectResponseDto[]> {
      const projects = await this.orderProjectsByStartDateDescUseCase.execute();
  
      if (!projects.length) {
        throw new NotFoundException('No se encontraron proyectos');
      }
  
      return projects.map(ProjectMapper.toResponseDto);
    }





    @Get('order/start-date/asc')
    @ApiOperation({ summary: 'Listar proyectos ordenados por fecha de inicio (más antigua a más reciente)' })
    @ApiResponse({
      status: 200,
      description: 'Listado de proyectos ordenados',
      type: [ProjectResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No se encontraron proyectos' })
    async orderByStartDateAsc(): Promise<ProjectResponseDto[]> {
      const projects = await this.orderProjectsByStartDateAscUseCase.execute();

      if (!projects.length) {
        throw new NotFoundException('No se encontraron proyectos');
      }

      return projects.map(ProjectMapper.toResponseDto);
    }

  }
  