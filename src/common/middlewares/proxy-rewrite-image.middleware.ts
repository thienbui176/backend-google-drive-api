import { RedisService } from '@/modules/redis/redis.service';
import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NestMiddleware,
    NotFoundException,
} from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyRewriteImageMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) {}

    async use(req: any, res: any, next: () => void) {
        try {
            const { name } = req.params;
            if (!name) throw new BadRequestException('Image name is required');

            const id = await this.redisService.get(name);

            if (!id) {
                res.status(404).send({
                    message: 'Image not found',
                    data: null,
                    status: HttpStatus[404],
                });
            }

            const proxy = createProxyMiddleware({
                target: ` https://lh3.googleusercontent.com`,
                changeOrigin: true,
                pathRewrite: () => {
                    const newPath = `/d/${id}=w1000-h1000?authuser=0`;
                    return newPath;
                },
            });

            proxy(req, res, next);
        } catch (error) {
            throw new InternalServerErrorException('Get image failed');
        }
    }
}
