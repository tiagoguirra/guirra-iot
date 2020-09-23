export class Model {
  protected _hide: string[]

  toJson(): this | any{
    const internlaProps = ['_hide']
    const resp = Object.keys(this).reduce((obj, prop) => {
      if (typeof prop != 'function' && !internlaProps.includes(prop)) {
        obj[prop] = this[prop]
      }
      return obj
    },{})
    return resp as this
  }
}

export interface ModelWithPaginate<T>{
  edges: T[],
  pagination: {
    page: number,
    perpage: number
    totalpage: number
    totalresult: number
  }
}
