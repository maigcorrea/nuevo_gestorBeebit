import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn, Validate } from 'class-validator';
import { IsRecentDate } from '../validators/is-recent-date.validator';
import { IsDeadlineAfterStart } from '../validators/deadline-after-start.validator';
import { ProjectStatus } from '../entities/project.entity';
 
 export class CreateProjectDto {
     @ApiProperty({
         description:"Nombre del proyecto",
         example:"Tienda online",
     })
     @IsNotEmpty()
     @IsString({message: "El título del proyecto debe ser un texto"})
     @Length(1, 100, {message:"El título del proyecto debe tener entre 1 y 100 caracteres"})
     title:string;



 
     @ApiPropertyOptional({
         description:"Descripción del proyecto",
         example:"Tienda dedicada al comercio online al por mayor",
     })
     @IsString({message:"La descripción del proyecto debe ser un texto"})
     @IsOptional()
     @Length(0, 200, {message:"La descripción del proyecto puede tener un máximo de 200 caracteres"})
     description:string;




     //indica que es opcional (para Swagger).
     @ApiPropertyOptional({
         description: 'Fecha de inicio del proyecto (puede omitirse)',
         example: '2025-03-23', // formato ISO, ¡mejor que dd/mm/yyyy!
     })
     @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' }) //Mejor que isDate() porque @IsDate() espera un Date real, y los datos de entrada vienen como string.. Valida strings tipo fecha (ISO). 
     @IsOptional()
     @Validate(IsRecentDate)
     //LA FECHA PUEDE SER FUTURA POR SI NOS MANDAN UN PROYECTO Y LO QUEREMOS TENER REGISTRADO, PERO NO LO EMPEZAMOS HASTA DENTRO DE UNA SEMANA, POR EJEMPLO
     start_date?: string | null;





 
     @ApiPropertyOptional({
         description:"Fecha límite para la entrega del proyecto",
         example:"2025-05-30",
     })
     @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
     @IsOptional()
     @Validate(IsDeadlineAfterStart)
     deadline?:string | null;


     //No es necesario incluir el campo file en el dto porque los DTOs están diseñados para validar y documentar campos JSON, mientras que los archivos se reciben por multipart/form-data y se gestionan por Multer con @UploadedFile().


 
 
    
 
     
 }