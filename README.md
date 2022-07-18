## Running the app

```bash
# go to project root
cd ./docker
$ cp .env.example .env
# insert correct env values into .env file
$ docker-compose up -d
$ docker-compose exec node npm install

# development
$ docker-compose exec node npm run start

# watch mode
$ docker-compose exec node npm run start:dev

# production mode
$ docker-compose exec node npm run start:prod
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