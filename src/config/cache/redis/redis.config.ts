import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import * as env from 'dotenv';

env.config();

export const redisConfig: ClientProviderOptions = {
    name: process.env.REDIS_NAME,
    transport: Transport.REDIS,
    options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },
};
