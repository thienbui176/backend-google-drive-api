import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('images/:name')
    getImage() {}
}
