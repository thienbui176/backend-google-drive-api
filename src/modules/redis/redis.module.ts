import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: await redisStore({
                    url: 'redis://localhost:6379',
                    ttl: 30000,
                }),
            }),
        }),
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
