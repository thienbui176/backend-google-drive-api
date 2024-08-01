import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SlackService } from 'nestjs-slack';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly slackService: SlackService) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            const errorMessage = `
                :beetle: *Exception occurred* :beetle: **
                - *Method:* \`${request.url}\`
                - *Error Message:* ${exception.message}
                - *Stack Trace:* \`\`\`${exception.stack}\`\`\`
            `;
            this.slackService.postMessage({
                channel: 'developer',
                text: errorMessage,
                unfurl_links: true,
                mrkdwn: true,
                icon_emoji: ':beetle:',
                username: 'ErrorBot',
            });
        }

        let errorResponse: any = {
            message:
                exception instanceof HttpException ? exception.message : 'Internal Server Error',
            status: HttpStatus[status],
            data: null,
        };

        if (exception instanceof HttpException && status === HttpStatus.BAD_REQUEST) {
            const validationErrors = exception.getResponse();
            if (validationErrors) {
                errorResponse = {
                    ...errorResponse,
                    message: 'Validation errors in your request',
                    errors: validationErrors,
                };
            }
        }

        response.status(status).json(errorResponse);
    }
}
