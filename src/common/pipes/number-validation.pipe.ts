import {
    ArgumentMetadata,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

const POSITIVE_NUMBER_CONDITION = 0;

@Injectable()
export class NumberValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { data } = metadata;
        const isNumberPositive =
            isNaN(value) || typeof value !== 'number' || value < POSITIVE_NUMBER_CONDITION;
        if (isNumberPositive) {
            throw new HttpException(`${data} must be a positive number`, HttpStatus.BAD_REQUEST);
        }
        return value;
    }
}
