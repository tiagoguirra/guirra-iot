import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common'
import { UserService } from 'src/user/service/user.service'
import { Response } from 'express'
import * as _ from 'lodash'

@Controller('v1/user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Post('/signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Res() res: Response
  ) {
    try {
      const user = await this.UserService.create(name, email, password)
      return res.status(HttpStatus.CREATED).json(user.toJson())
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
