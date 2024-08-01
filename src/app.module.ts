import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform-interceptor';
import { JwtModule } from '@nestjs/jwt';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { SlackModule } from 'nestjs-slack';
import { slackProvider } from './providers/logging/slack.provider';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module';
import { ProxyRewriteImageMiddleware } from './common/middlewares/proxy-rewrite-image.middleware';
import { AppController } from './app.controller';
import { RedisModule } from './modules/redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GoogleDriveModule,
        RedisModule,
        JwtModule,
        SlackModule.forRootAsync(slackProvider),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        MorganMiddleware.configure('dev');
        consumer.apply(MorganMiddleware).forRoutes('*');
        consumer
            .apply(ProxyRewriteImageMiddleware)
            .forRoutes({ path: '/images/:name', method: RequestMethod.GET });
    }
}
