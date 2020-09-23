import { ConnectionOptions } from 'typeorm'
import { config as envConfig } from 'dotenv'
import * as path from 'path'

if (
  process.env.ENVIRONMENT !== 'Production' &&
  process.env.DATABASE_HOST === undefined
) {
  const configPath = path.resolve(__dirname, '../../.env')
  envConfig({ path: configPath })
}

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: ['./**/*.entity{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  logging: true,
  logger: 'file',
  migrations: [path.resolve(__dirname, '..') + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations'
  },
  cache: false
}

export = config
