import { FindSentMessagesByUserUseCase } from '../find-sent-messages-by-user.use-case';
import { MessageRepositoryPort } from 'src/messages2/domain/ports/message.repository.port';
import { Message } from 'src/messages2/domain/entities/messages.entity';

describe('FindSentMessagesByUserUseCase', () => {
  let useCase: FindSentMessagesByUserUseCase;
  let mockRepository: jest.Mocked<MessageRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findAllBySender: jest.fn(),
      save: jest.fn(),
      findAllByReceiver: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new FindSentMessagesByUserUseCase(mockRepository);
  });

  it('debería devolver los mensajes enviados por el usuario', async () => {
    const mockMessages: Message[] = [
      new Message('1', 'user-1', 'user-2', 'Asunto 1', 'Texto 1', new Date()),
      new Message('2', 'user-1', 'user-3', 'Asunto 2', 'Texto 2', new Date()),
    ];

    mockRepository.findAllBySender.mockResolvedValue(mockMessages);

    const result = await useCase.execute({ senderId: 'user-1' });

    expect(mockRepository.findAllBySender).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(mockMessages);
  });
});
