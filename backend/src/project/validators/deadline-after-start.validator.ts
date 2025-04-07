import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDeadlineAfterStart(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDeadlineAfterStart',
      target: object.constructor,
      propertyName,
      options: validationOptions || {
        message: 'La fecha de entrega no puede ser anterior a la fecha de inicio.',
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const deadline = new Date(value);
          const startDate = new Date((args.object as any).start_date);

          // Solo validar si ambos campos existen
          if (!value || !(args.object as any).start_date) return true;

          return deadline >= startDate;
        },
      },
    });
  };
}
