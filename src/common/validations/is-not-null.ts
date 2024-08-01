import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CheckNullOrUndefined implements ValidatorConstraintInterface {
    validate(value: any) {
        return value != null && value != undefined;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `$property must match ${relatedPropertyName}`;
    }
}

export function IsNotNull(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: CheckNullOrUndefined,
        });
    };
}
