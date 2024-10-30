# Technical Test - Irfandi

Implementation for technical test [Code.id](https://www.code.id/)

## Features

- **Backend**: using [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- **Logging**: using [Morgan](https://github.com/expressjs/morgan)
- **Environment vars**: using [Dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [Helmet](https://helmetjs.github.io/)
- **CORS**: Cross-Origin Resource-Sharing enabled using [Cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [Compression](https://github.com/expressjs/compression)
- **Database**: using [MongoDB Atlas](https://www.mongodb.com/atlas) with [Prisma](https://www.prisma.io)
- **Message Broker**: using [Kafka](https://kafka.apache.org/) ([KafkaJS](https://kafka.js.org/), [Confluent](https://www.confluent.io/))
- **Caching**: using [Redis](https://redis.io/) ([Upstash](https://upstash.com/))
- **API Documentation**: using [Scalar Docs](https://scalar.com/)
- **CI/CD**: deploy on [Vercel](https://vercel.com/)
- **Git hooks**: with [Husky](https://github.com/typicode/husky) and [Lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [Eslint](https://eslint.org/) and [Prettier](https://prettier.io/)
- **Validations**: schema validation with [Zod](https://zod.dev/)

## Get Started

- Clone this repo
  ```bash
  git clone https://github.com/irfnd/irfandi-betest
  ```
- Rename this boilerplate to whatever you want and move to that folder
  ```bash
  cd <your-project-name>
  ```
- Install all packages
  ```bash
  npm install
  ```
  or
  ```bash
  yarn
  ```
  or
  ```bash
  pnpm i
  ```
- Set up environment variables in `.env` file.

  ```env
  # Server
  PORT=<Set Server Port || 8080>

  # MongoDB
  DATABASE_URL=<Mongo Atlas URL>

  # Upstash Redis
  UPSTASH_REDIS_URL=<Upstash Redis URL>
  UPSTASH_REDIS_TOKEN=<Upstash Redis Token>

  # Hashing
  HASHING_SALT="secret_irfandi_betest"

  # JWT
  JWT_SECRET="secret-jwt_irfandi_betest"
  JWT_EXPIRES_IN="1d"

  # Confluent Kafka Cluster
  KAFKA_CLIENT_ID=<Confluent Client ID>
  KAFKA_BROKER=<Confluent Cluster URL>
  KAFKK_SASL_USERNAME=<Confluent Username>
  KAFKA_SASL_PASSWORD=<Confluent Password>
  ```

- Running project
  ```bash
  pnpm start
  ```
  or `development`
  ```bash
  pnpm dev
  ```
- Project running on port `8080` _(default port)_
- Open `/docs` to see API documentation.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- Fork the Project
- Create your Feature Branch `git checkout -b feature/AmazingFeature`
- Commit your Changes `git commit -m 'Add some AmazingFeature`
- Push to the Branch `git push origin feature/AmazingFeature`
- Open a Pull Request

## License

Distributed under the [MIT](https://github.com/irfnd/irfandi-betest/blob/master/LICENSE) License.
