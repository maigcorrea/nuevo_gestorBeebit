import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { SaveProfileImageInput } from '../../domain/interfaces/save-profile-image.input';

export class SaveProfileImageDto implements SaveProfileImageInput {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  imageUrl: string;
}
