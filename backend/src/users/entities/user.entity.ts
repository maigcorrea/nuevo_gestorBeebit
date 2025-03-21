import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Decorador para marcar la clase como entidad (Una tabla en la base de datos)
export class User {
  @PrimaryGeneratedColumn() // Decorador para indicar que esta propiedad es la clave primaria. id autoincremental(PK)
  id: number;

  @Column({ length: 100 }) // Decorador para una columna de la base de datos. Puedes limitar el tamaño del campo
  name: string;

  @Column({ unique: true }) // añadimos restricción única
  email: string;

  @Column({ select: false }) // no se selecciona por defecto para más seguridad. Estás diciendo: “No incluyas este campo en las consultas normales”, por seguridad. Para evitar devolver la contraseña en respuestas de find(), findOne()
  password: string;
}
