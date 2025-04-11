export class Tarea {
    constructor(
      public readonly id: string,
      public titulo: string,
      public readonly creadaEn: Date = new Date(),
      public estado: 'pendiente' | 'completada' = 'pendiente',
    ) {}
  
    completar() {
      this.estado = 'completada';
    }
  }