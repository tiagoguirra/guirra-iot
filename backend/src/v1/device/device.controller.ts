import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Query
} from '@nestjs/common'
import { UserContext } from 'src/oauth/decorator/user.decorator'
import { Response } from 'express'
import * as _ from 'lodash'
import { DeviceInputDto, DeviceChangeInput } from 'src/dto/device.dto'
import { DeviceService } from 'src/device/service/device.service'
import { property } from 'lodash'
import { AlexaEventService } from '../../alexa/service/alexa-event.service'

@Controller('v1/device')
export class DeviceController {
  constructor(
    private readonly DeviceService: DeviceService,
    private readonly AlexaEventService: AlexaEventService
  ) {}
  @Post('/')
  async register(
    @UserContext('user_id') userId: string,
    @Body() _device: DeviceInputDto,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.create(userId, _device)
      if (device) {
        this.AlexaEventService.AddOrUpdateReport(device.toJson())
        return res.status(HttpStatus.CREATED).send(device)
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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

  @Get('/:id')
  async get(
    @Param('id') deviceId: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.getById(userId, deviceId)
      if (device) {
        return res.status(HttpStatus.OK).send(device.toJson())
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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
  @Put('/:id')
  async update(
    @Param('id') deviceId: string,
    @UserContext('user_id') userId: string,
    @Body() _device: DeviceInputDto,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.update(userId, deviceId, _device)
      if (device) {
        this.AlexaEventService.AddOrUpdateReport(device.toJson())
        return res.status(HttpStatus.OK).send(device.toJson())
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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
  @Delete('/:id')
  async remove(
    @Param('id') deviceId: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.remove(userId, deviceId)
      if (device) {
        return res.status(HttpStatus.OK).send(device.toJson())
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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

  @Get('/:id/status')
  async status(
    @Param('id') deviceId: string,
    @Query('property') property: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const status = await this.DeviceService.status(userId, deviceId, {
        property
      })
      if (status) {
        return res.status(HttpStatus.OK).send(status)
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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
  @Get('/:id/settings')
  async settings(
    @Param('id') deviceId: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const status = await this.DeviceService.settings(userId, deviceId)
      if (status) {
        return res.status(HttpStatus.OK).send(status)
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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

  @Get('/')
  async list(
    @Param('page') page: number = 1,
    @Param('perpage') perpage: number = 20,
    @Param('orderBy') orderBy: string = '',
    @Param('orderDir') orderDir: string = '',
    @Param('search') search: string = '',
    @Param('category') category: string = '',
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const devices = await this.DeviceService.list(userId, {
        page,
        perpage,
        orderDir,
        orderBy,
        search,
        category
      })
      return res.status(HttpStatus.OK).send(devices)
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

  @Post('/:id/change')
  async change(
    @Param('id') deviceId: string,
    @UserContext('user_id') userId: string,
    @Body() property: DeviceChangeInput,
    @Res() res: Response
  ) {
    try {
      const device = await this.DeviceService.change(userId, deviceId, property)
      if (device) {
        return res.status(HttpStatus.OK).send(device.toJson())
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        error: [
          {
            message: 'Device not found',
            code: 'device_not_found'
          }
        ]
      })
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
