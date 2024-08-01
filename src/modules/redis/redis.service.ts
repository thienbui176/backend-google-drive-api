import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async set(key: string, value: any, ttl = 30000) {
        try {
            await this.cacheManager.set(key, JSON.stringify(value), ttl);
            return null;
        } catch (error) {
            throw error;
        }
    }

    async get(key: string) {
        try {
            const value = await this.cacheManager.get(key);
            if (!value) return null;
            return JSON.parse(value as string);
        } catch (error) {
            throw error;
        }
    }

    async delete(key: string) {
        try {
            await this.cacheManager.del(key);
            return null;
        } catch (error) {
            throw error;
        }
    }

    notAsync(key: string) {
        return new Promise((resolve, reject) => {
            this.cacheManager
                .get(key)
                .then((value) => {
                    if (!value) {
                        resolve(null);
                    } else {
                        resolve(JSON.parse(value as string));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
