import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as tracer from 'tracer'
import * as colors from 'colors'
import * as _ from 'lodash'

export const logDebug = tracer.console({
  level: 'log',
  format: [
    '{{timestamp}} [{{title}}] ({{file}}:{{line}}) {{message}} ',
    {
      error:
        '{{timestamp}} [{{title}}] ({{file}}:{{line}}) {{message}}\nCall Stack:\n{{stack}}'
    }
  ],
  filters: {
    log: colors.cyan,
    trace: colors.magenta,
    debug: colors.yellow,
    info: colors.blue,
    warn: colors.yellow.bgBlue,
    error: colors.red
  }
})

export const logFile = (data: string | object, prefix: string= '') => {
  if (typeof data == 'string') {
    return saveLog(data)
  } else if (typeof data == 'object') {
    let message = _.get(data,'message','Erro desconhecido')
    let trace = _.get(data,'stack',data)

    return saveLog(`${message}\n${trace}`,prefix)
  } else {
    return 'data_to_log_invalid'
  }
}

const saveLog = (data: string,prefix: string= '') => {
  try {
    let pathLog =
      process.env.LOG_PATH || path.resolve(__dirname, '..', '..', 'logs')
    let pathLogFile = path.resolve(pathLog, `${prefix != '' ? `${prefix}-` : ''}${new Date().toISOString()}.log`)
    fse.ensureDirSync(pathLog)
    fs.writeFileSync(pathLogFile, data)
    return pathLogFile
  } catch (err) {
    console.log('Falha ao gerar log', err)
    return 'log_failure'
  }
}
