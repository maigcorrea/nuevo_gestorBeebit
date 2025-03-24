import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsDate, IsDateString, IsIn } from 'class-validator';
 
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
     //LA FECHA PUEDE SER FUTURA POR SI NOS MANDAN UN PROYECTO Y LO QUEREMOS TENER REGISTRADO, PERO NO LO EMPEZAMOS HASTA DENTRO DE UNA SEMANA, POR EJEMPLO
     start_date: string;





 
     @ApiPropertyOptional({
         description:"Fecha límite para la entrega del proyecto",
         example:"2025-05-30",
     })
     @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
     @IsOptional()
     //COMPROBAR QUE LA FECHA SEA FUTURA SÍ O SÍ
     deadline:string;





 
 
     @ApiProperty({
         description:"Última fecha en la que se actualizó/modificó el proyecto. Fecha de la última tarea completada",
         example:"2025-03-21",
     })
     @IsDateString({}, { message: 'La fecha debe estar en formato ISO (yyyy-mm-dd)' })
     //COMPROBAR QUE NO SEA UNA FECHA FUTURA, SÓLO PUEDE IR DESDE LA FECHA DE INICIO DEL PROYECTO HASTA LA FECHA PRESENTE
     last_update:string;
 
 




     @ApiProperty({
         description:"Estado en el que se encuentra el proyecto: En progreso, pausado, finalizado",
         example:"paused"
     })
     @IsString()
     //LIMITAR SÓLO A "EN PROGRESO, FINALIZADO, PAUSADO"
     @IsIn(['pending', 'paused', 'active', 'completed'], {
        message: 'El estado debe ser pending, paused, active o completed',
      })
     status:string;
 
     
 }