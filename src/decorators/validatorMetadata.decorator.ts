import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isObject,
  isString,
} from 'class-validator';

export function IsMetadataObject(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMetadataObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!isObject(value)) {
            return false;
          }
          const keys = Object.keys(value);
          if (keys.length > 10) {
            return false;
          }
          for (const key of keys) {
            if (!isString(value[key]) || value[key].length > 30) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Metadata must be an object with a maximum of 10 keys, and each value must be a string with a maximum of 30 characters';
        },
      },
    });
  };
}
