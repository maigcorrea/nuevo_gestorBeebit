import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity() // Decorador para marcar la clase como entidad (Una tabla en la base de datos)
export class Staff{
    @PrimaryGeneratedColumn() // Decorador para indicar que esta propiedad es la clave primaria. id autoincremental(PK)
    id: number;

    @Column({ length: 100, unique: true }) // Decorador para una columna de la base de datos. Puedes limitar el tamaño del campo
    name: string;

    @Column({ unique: true }) // añadimos restricción única
    email: string;

    @Column({ type: 'timestamp' })
    register_date:Date;

    @Column({ unique: true })
    phone:string;

    @Column({ select: false }) // no se selecciona por defecto para más seguridad. Estás diciendo: “No incluyas este campo en las consultas normales”, por seguridad. Para evitar devolver la contraseña en respuestas de find(), findOne()
    password: string;

}