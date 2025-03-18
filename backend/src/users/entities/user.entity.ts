import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Decorador para marcar la clase como entidad
export class User {
  @PrimaryGeneratedColumn() // Decorador para indicar que esta propiedad es la clave primaria
  id: number;

  @Column() // Decorador para una columna de la base de datos
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
