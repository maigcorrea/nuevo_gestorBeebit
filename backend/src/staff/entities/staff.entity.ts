import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';

export enum StaffType {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity() // Decorador para marcar la clase como entidad (Una tabla en la base de datos)
export class Staff{
    @PrimaryGeneratedColumn() // Decorador para indicar que esta propiedad es la clave primaria. id autoincremental(PK)
    id: number;

    @Column({ length: 100, unique: true }) // Decorador para una columna de la base de datos. Puedes limitar el tamaño del campo
    name: string;

    @Column({ unique: true }) // añadimos restricción única
    email: string;

    // Fecha de registro con valor automático al insertar
    @CreateDateColumn({ type: 'timestamp' })
    register_date:Date;

    @Column({ unique: true })
    phone:string;

    @Column({ select: false }) // no se selecciona por defecto para más seguridad. Estás diciendo: “No incluyas este campo en las consultas normales”, por seguridad. Para evitar devolver la contraseña en respuestas de find(), findOne()
    password: string;

    // Tipo de usuario: 'admin' o 'user'
    @Column({
        type: 'enum',
        enum: StaffType,
        default: StaffType.USER,
    })
    type: StaffType;


    //Guardar un token único que se le enviará al usuario para la recuperación de contraseña
    @Column({ type: 'varchar', nullable: true })
    resetToken: string | null;

    //Tiempo de expiración del token
    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiry: Date | null;


    //Foto de perfil del usuario
    @Column({ nullable: true })
    profileImage: string;
}