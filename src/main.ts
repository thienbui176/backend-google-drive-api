import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as compression from 'compression';
import { appConfig } from './config/app/app.config';

const PREFIX_API = 'v1/api';
const whitelist = ['http://localhost:3000'];
const allowMethod = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            enableDebugMessages: true,
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                const errors = {};

                validationErrors.forEach((error) => {
                    errors[error.property] = Object.values(error.constraints);
                });
                return new BadRequestException(errors);
            },
        }),
    );
    app.setGlobalPrefix(PREFIX_API, {
        exclude: [{ path: '/images/:name', method: RequestMethod.GET }],
    });
    app.use(compression());
    app.enableCors({
        origin: whitelist,
        methods: allowMethod,
        credentials: true,
    });

    await app
        .listen(appConfig.port)
        .then(() => console.log(`Server start on port ${appConfig.port}`))
        .catch((error) => {
            console.log(error);
        });
}
bootstrap();
