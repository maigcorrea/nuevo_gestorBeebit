export enum StaffType {
    ADMIN = 'admin',
    USER = 'user',
}

export class Staff{
    constructor(
        public readonly id: string,
        public name: string,
        public email: string,
        public phone: string,
        public password: string,
        public register_date: Date = new Date(),
        public type: StaffType = StaffType.USER,
        public resetToken: string | null = null,
        public resetTokenExpiry: Date | null = null,
        public profileImage: string | null = null,
    ) {}
    
}