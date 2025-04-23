import { FindReceivedMessagesByUserUseCase } from '../find-received-messages-by-user.use-case';
import { MessageRepositoryPort } from 'src/messages2/domain/ports/message.repository.port';
import { Message } from 'src/messages2/domain/entities/messages.entity';

describe('FindReceivedMessagesByUserUseCase', () => {
  let useCase: FindReceivedMessagesByUserUseCase;
  let mockRepository: jest.Mocked<MessageRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findAllBySender: jest.fn(),
      findAllByReceiver: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    useCase = new FindReceivedMessagesByUserUseCase(mockRepository);
  });

  it('debería devolver los mensajes recibidos por el usuario', async () => {
    const mockMessages: Message[] = [
      new Message('1', 'user-2', 'user-1', 'Asunto 1', 'Texto 1', new Date()),
      new Message('2', 'user-3', 'user-1', 'Asunto 2', 'Texto 2', new Date()),
    ];

    mockRepository.findAllByReceiver.mockResolvedValue(mockMessages);

    const result = await useCase.execute({ receiverId: 'user-1' });

    expect(mockRepository.findAllByReceiver).toHaveBeenCalledWith('user-1');
    expect(result).toEqual(mockMessages);
  });
});
