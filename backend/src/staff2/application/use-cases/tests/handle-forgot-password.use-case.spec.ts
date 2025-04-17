import { HandleForgotPasswordUseCase } from '../handle-forgot-password.use-case';
import { StaffRepositoryPort } from '../../../domain/ports/staff.repository.port';
import { MailQueueService } from 'src/mail/mail-queue/mail-queue.service';
import { Staff, StaffType } from '../../../domain/entities/staff.entity';

describe('HandleForgotPasswordUseCase', () => {
  let useCase: HandleForgotPasswordUseCase;
  let mockRepo: jest.Mocked<StaffRepositoryPort>;
  let mockMailQueue: jest.Mocked<MailQueueService>;

  const email = 'test@email.com';
  const staffMock = new Staff(
    'abc123',
    'Juan',
    email,
    '682543621',
    '',
    new Date(),
    StaffType.USER,
    null,
    null,
    null
  );

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      // otras funciones simuladas (no usadas aquí)
    } as any;

    mockMailQueue = {
      enqueuePasswordReset: jest.fn(),
    } as any;

    useCase = new HandleForgotPasswordUseCase(mockRepo, mockMailQueue);
  });

  it('debería devolver mensaje neutro si el usuario no existe', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({ email });
    expect(result).toEqual({
      message: 'Si el email está registrado, recibirás un correo',
    });
    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(mockMailQueue.enqueuePasswordReset).not.toHaveBeenCalled();
  });

  it('debería generar token, guardar y enviar correo si el usuario existe', async () => {
    mockRepo.findByEmail.mockResolvedValue({ ...staffMock });
    mockRepo.save.mockResolvedValue({ ...staffMock });

    const result = await useCase.execute({ email });

    expect(result).toEqual({
      message: 'Correo de recuperación enviado',
    });

    expect(mockRepo.save).toHaveBeenCalled();
    const savedUser = mockRepo.save.mock.calls[0][0];
    expect(savedUser.resetToken).toBeDefined();
    expect(savedUser.resetTokenExpiry).toBeInstanceOf(Date);
    expect(mockMailQueue.enqueuePasswordReset).toHaveBeenCalledWith(
      email,
      expect.stringContaining('reset-password?token='),
    );
  });
});
