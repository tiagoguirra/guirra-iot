import { Controller, Post, Body, HttpStatus, Res, Get } from '@nestjs/common'
import { Response } from 'express'
import * as _ from 'lodash'
import { UserContext } from '../../oauth/decorator/user.decorator'
import { AlexaAuthorizationService } from '../../alexa/service/alexa-authorization.service'
import { AlexaResponseService } from '../../alexa/service/alexa-response.service'
import { DeviceService } from '../../device/service/device.service'
import { AlexaControllerService } from '../../alexa/service/alexa-controller.service'

@Controller('v1/alexa')
export class AlexaController {
  constructor(
    private readonly AuthorizationService: AlexaAuthorizationService,
    private readonly ResponseService: AlexaResponseService,
    private readonly ChangeService: AlexaControllerService,
    private readonly DeviceService: DeviceService
  ) {}
  @Post('/authorization')
  async authorization(
    @Body('code') code: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      await this.AuthorizationService.create(code, userId)
      return res.json(this.ResponseService.authorization())
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }

  @Get('/discovery')
  async discovery(
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const devices = await this.DeviceService.getAll(userId)
      return res.send(this.ResponseService.discovery(devices))
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }

  @Post('/change')
  async change(
    @UserContext('user_id') userId: string,
    @Body('device_id') deviceId: string,
    @Body('name') name: string,
    @Body('namespace') namespace: string,
    @Body('correlationToken') correlationToken: string,
    @Body('messageId') messageId: string,
    @Body('endpoint') endpoint: any,
    @Body('payload') payload: any,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.getById(userId, deviceId)
      const response = await this.ChangeService.change(
        device,
        {
          name,
          namespace,
          endpoint,
          correlationToken,
          messageId
        },
        payload
      )
      return res.send(response)
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }
  @Post('/report')
  async reportState(
    @UserContext('user_id') userId: string,
    @Body('device_id') deviceId: string,
    @Body('correlationToken') correlationToken: string,
    @Body('messageId') messageId: string,
    @Body('endpoint') endpoint: any,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.getById(userId, deviceId)
      const report = await this.ChangeService.reportState(device, {
        endpoint,
        correlationToken,
        messageId
      })
      return res.status(HttpStatus.OK).send(report)
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }
}
