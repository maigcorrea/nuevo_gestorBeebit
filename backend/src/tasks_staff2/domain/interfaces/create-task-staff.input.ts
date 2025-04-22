export class CreateTaskStaffInput {
    constructor(
      public readonly id_task: string,
      public readonly id_staff: string[],
    ) {}
  }
  