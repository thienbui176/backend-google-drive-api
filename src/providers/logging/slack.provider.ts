import { SlackAsyncConfig } from 'nestjs-slack/dist/types';
import { slackConfig } from '@/config/logging/slack.config';

export const slackProvider: SlackAsyncConfig = {
    useFactory: async () => ({
        ...slackConfig,
    }),
};
