import { Module } from '@nestjs/common';
import { GoogleDriveController } from './google-drive.controller';
import { GoogleDrive } from './google-drive.service';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
    controllers: [GoogleDriveController],
    imports: [RedisModule],
    providers: [GoogleDrive],
})
export class GoogleDriveModule {}
