import * as _ from 'lodash'
export const getRequestProperty = (context: any | any[], name: string = '') => {
  if (Array.isArray(context)) {
    const ctx = _.find(context, 'req')
    return name ? _.get(ctx, `req.${name}`) : _.get(ctx, 'req')
  }
  return name ? _.get(context, `req.${name}`) : _.get(context, 'req')
}
