export class Message {
    constructor(
      public readonly id: string,
      public senderId: string,
      public receiverId: string,
      public subject: string,
      public text: string,
      public sentAt: Date,
      public readonly receiverEmail?: string,
      public readonly receiverName?: string, 
    ) {}
  }