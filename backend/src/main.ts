import { logDebug } from './libraries/logger'
import { config as envConfig } from 'dotenv'
import * as fs from 'fs-extra'
import * as path from 'path'

try {
  const startConfig = () => {
    const configPath = path.resolve(__dirname, '../.env')
    if (fs.existsSync(configPath)) {
      envConfig({ path: configPath })
    } else {
      throw new Error('Arquivo de variaveis de ambiente (.env) não encontrado')
    }
  }

  if (process.env.ENVIRONMENT !== 'Production') {
    logDebug.debug('Ambiente de desenvolvimento, usando variaveis do .env')
    startConfig()
  } else {
    logDebug.debug('Ambiente de produção, usando variaveis do processo')
  }
} catch (err) {
  logDebug.error('Falha ao iniciar variaveis de ambiente', err)
}
import './bootstrap'
