## Description

This NestJS base project is designed to streamline and simplify the setup of new projects. It provides a robust foundation with pre-configured modules, middleware, and best practices to accelerate development and ensure consistency across various projects

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

````bash
$ NODE_ENV = 'development' // 'production'

$ JWT_SECRET = 'secret'
$ PORT_SERVICE = 3001 (NUMBER)
$ ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC = '3000000000'

$ DB_HOST = localhost
$ DB_PORT = 3306
$ DB_USERNAME = user
$ DB_NAME = user_service_db
$ DB_PASSWORD = user123456

$ GOOGLE_CLIENT_ID = (STRING)
$ GOOGLE_CLIENT_SECRET = (STRING)
$ OAUTH_GOOGLE_REDIRECT_URL = http://localhost:3001/api/auth/google/redirect

$ FACEBOOK_CLIENT_ID = (STRING)
$ FACEBOOK_CLIENT_SECRET = (STRING)
$ OAUTH_FACEBOOK_REDIRECT_URL = http://localhost:3001/api/auth/google/redirect

$ SLACK_WEBHOOK_API = (SLACK WEB HOOK API)
$ LINK_REDIRECT_AUTH0_CALLBACK = 'http://localhost:3002'

$ REDIS_NAME = REDIS_SERVICE
$ REDIS_HOST = localhost
$ REDIS_PORT = 6379

## Docker

```bash

$ docker-compose up -d
```
