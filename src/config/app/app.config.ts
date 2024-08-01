import * as env from 'dotenv';

env.config();

export const appConfig = {
    port: process.env.PORT_SERVICE || 3007,
};
