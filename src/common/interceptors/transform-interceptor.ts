import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/metadata/response-message.decorator';

export interface Response<T> {
    status: string;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                status: HttpStatus[context.switchToHttp().getResponse().statusCode],
                message: this.reflector.get(RESPONSE_MESSAGE_KEY, context.getHandler()) || '',
                data: data,
            })),
        );
    }
}
