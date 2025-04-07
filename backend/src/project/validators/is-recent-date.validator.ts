import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRecentDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRecentDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {
        message: 'La fecha de inicio no puede ser anterior a hace 7 días.',
      },
      validator: {
        validate(value: any) {
          const date = new Date(value);
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);

          return date >= sevenDaysAgo && date <= today;
        }
      }
    });
  };
}