import { Model, ModelWithPaginate } from '../entity/model'

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface ModelPagination {
  take: number
  skip: number
}
export const calculePagination = (page: number = 1, perpage: number = 20) => {
  let take: number = Number(perpage * 1 || 20)
  let skip: number = ((page * 1 || 1) - 1) * take
  return { take, skip }
}

export const normalizeListResponse = <T>(
  edges: Model[] | any[],
  totalresult: number,
  page: number = 1,
  perpage: number = 20
): ModelWithPaginate<T> => {
  const totalpage: number = Math.ceil(totalresult / perpage)
  return {
    edges: (edges || []).map(item => {
      if (typeof item.toJson == 'function') {
        return item.toJson()
      }
      return item
    }),
    pagination: {
      page,
      perpage,
      totalpage,
      totalresult
    }
  }
}
