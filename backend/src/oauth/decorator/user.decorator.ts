import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import * as _ from 'lodash'

export const UserContext = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = _.get(request, 'oauth.user')
    return data ? _.get(user, data, user) : user
  }
)
