import { StaffRepositoryPort } from '../../domain/ports/staff.repository.port';
import { MailQueueService } from 'src/infrastructure/mail/mail-queue/mail-queue.service';
import { HandleForgotPasswordInput } from '../../domain/interfaces/handle-forgot-password.input';
import { randomBytes } from 'crypto';

export class HandleForgotPasswordUseCase {
  constructor(
    private readonly staffRepo: StaffRepositoryPort,
    private readonly mailQueueService: MailQueueService,
  ) {}

  async execute(input: HandleForgotPasswordInput): Promise<{ message: string }> {
    const user = await this.staffRepo.findByEmail(input.email);

    if (!user) {
      // No revelamos si el email está o no registrado, por seguridad
      return { message: 'Si el email está registrado, recibirás un correo' };
    }

    const token = randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await this.staffRepo.save(user);

    const resetLink = `http://localhost:3001/reset-password?token=${token}`;
    await this.mailQueueService.enqueuePasswordReset(user.email, resetLink);

    return { message: 'Correo de recuperación enviado' };
  }
}
