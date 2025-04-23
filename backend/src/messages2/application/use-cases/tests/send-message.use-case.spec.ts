import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageUseCase } from '../send-message.use-case';
import { Queue } from 'bull';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockQueue: Partial<Queue>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageUseCase,
        {
          provide: 'BullQueue_mailQueue',
          useValue: mockQueue,
        },
      ],
    }).compile();

    useCase = module.get<SendMessageUseCase>(SendMessageUseCase);
  });

  it('debería encolar correctamente el correo', async () => {
    const input = {
      senderId: 'user-1',
      to: 'user-2',
      subject: 'Hola',
      text: 'Este es el contenido del mensaje',
    };

    const result = await useCase.execute(input);

    expect(mockQueue.add).toHaveBeenCalledWith('sendMail', {
      senderId: input.senderId,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });

    expect(result).toEqual({ message: 'Correo encolado correctamente' });
  });
});
