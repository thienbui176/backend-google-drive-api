import { redisConfig } from '@/config/cache/redis/redis.config';
import { ClientProviderOptions, ClientsModuleOptions } from '@nestjs/microservices';

export const redisProvider: ClientProviderOptions = redisConfig;
