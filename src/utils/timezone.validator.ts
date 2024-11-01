import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment-timezone';

@ValidatorConstraint({ async: false })
export class IsTimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: string, args: ValidationArguments) {
    console.log(timezone);
    // Check if timezone is valid using moment-timezone
    return moment.tz.zone(timezone) !== null;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The value must be a valid timezone in the "Continent/City" format (e.g., "Asia/Bangkok").';
  }
}

export function IsTimezone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimezoneConstraint,
    });
  };
}
