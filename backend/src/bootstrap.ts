import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logDebug, logFile } from './libraries/logger'
import * as cors from 'cors'

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule)

    app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
      })
    )

    await app.listen(
      process.env.APP_PORT || 3001,
      process.env.APP_HOST || 'localhost'
    )
    logDebug.info('Aplication running ', process.env.APP_PORT || 3000)
  } catch (err) {
    logDebug.error('Uma exceção quebrou a execução da aplicação: ', err)
    logFile(err, 'main')
  }
}

bootstrap()
