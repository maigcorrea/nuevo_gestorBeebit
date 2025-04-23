export interface SendMessageInput {
    to: string; // ID del receptor
    subject: string;
    text: string;
    senderId: string;
  }