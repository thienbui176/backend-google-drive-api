import { SlackConfig } from 'nestjs-slack/dist/types';
import * as env from 'dotenv';

env.config();

export const slackConfig: SlackConfig = {
    type: 'webhook',
    webhookOptions: {
        url: process.env.SLACK_WEBHOOK_API,
    },
};
