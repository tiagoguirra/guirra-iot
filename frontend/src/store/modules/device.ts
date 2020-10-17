import { ERRORS_SHOW } from '../actions/errors'
import {
  DEVICE_LIST,
  DEVICE_STATUS,
  DEVICE_CHANGE,
  DEVICE_GET,
  DEVICE_UPDATE,
} from '../actions/device'
import { Commit, Dispatch } from 'vuex'
import Api from '../../services/api'
import * as _ from 'lodash'
import { Pagination } from '@/types/pagination'

interface Device {
  category: string[]
  device_id: string
  modes: {
    name: string
    values: string
    initial: string
  }[]
  name: string
  properties: {
    name: string
    initial: any
    proactively: boolean
    retrievable: boolean
  }[]
  template: string
  user_id: string
  device_shadow: string
}

interface DeviceStatus {
  property: string
  state: any
  last_report: number
  timestamp: number
  delta?: any
}

export interface DeviceState {
  devices: Device[]
  status: {
    [deviceId: string]: DeviceStatus[]
  }
  pagination: Pagination
}
const state: DeviceState = {
  devices: [],
  pagination: { page: 1, perpage: 20, totalpage: 0, totalresult: 0 },
  status: {},
}
const getters = {
  getDevices: (state: DeviceState) => state.devices || [],
  getDevicePagination: (state: DeviceState) => state.pagination,
  getDeviceStatus: (state: DeviceState) => (deviceId: string) =>
    _.get(state.status, [deviceId]),
  getDevicePropertyStatus: (state: DeviceState) => (
    deviceId: string,
    property: string
  ) => _.find(_.get(state.status, [deviceId], []), { property }) || {},
  getDeviceModeStatus: (state: DeviceState) => (
    deviceId: string,
    mode: string
  ) => _.find(_.get(state.status, [deviceId], []), { mode }) || {},
}

const actions = {
  [DEVICE_LIST]: (
    {
      commit,
      dispatch,
    }: {
      commit: Commit
      dispatch: Dispatch
    },
    {
      page = 1,
      perpage = 20,
      orderBy = 'name',
      orderDir = 'ASC',
      search = '',
    }: {
      page?: number
      perpage?: number
      orderBy?: string
      orderDir?: string
      search?: string
    } = {}
  ) => {
    return new Promise((resolve, reject) => {
      Api.get('/v1/device', {
        params: { page, perpage, orderBy, orderDir, search },
      })
        .then(resp => {
          const edges = _.get(resp, 'data.edges', [])
          const pagination = _.get(resp, 'data.pagination')
          commit(DEVICE_LIST, {
            devices: edges || [],
            pagination: {
              page: _.get(pagination, 'page', page),
              perpage: _.get(pagination, 'perpage', perpage),
              totalpage: _.get(pagination, 'totalresult', 0),
              totalresult: _.get(pagination, 'totalresult', 0),
            },
          })
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          reject(err)
          dispatch(ERRORS_SHOW, err)
        })
    })
  },
  [DEVICE_STATUS]: (
    { dispatch, commit }: { dispatch: Dispatch; commit: Commit },
    { deviceId }: { deviceId: string }
  ) => {
    return new Promise((resolve, reject) => {
      Api.get(`/v1/device/${deviceId}/status`)
        .then(resp => {
          commit(DEVICE_STATUS, {
            status: _.get(resp, 'data'),
            device_id: deviceId,
          })
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          dispatch(ERRORS_SHOW, err)
          reject(err)
        })
    })
  },
  [DEVICE_CHANGE]: (
    { dispatch }: { dispatch: Dispatch },
    {
      deviceId,
      property,
      value,
    }: { deviceId: string; property: string; value: any }
  ) => {
    return new Promise((resolve, reject) => {
      Api.post(`/v1/device/${deviceId}/change`, {
        property,
        value,
      })
        .then(() => {
          resolve()
        })
        .catch(err => {
          dispatch(ERRORS_SHOW, err)
          reject(err)
        })
    })
  },
  [DEVICE_GET]: (
    { dispatch }: { dispatch: Dispatch },
    { deviceId }: { deviceId: string }
  ) => {
    return new Promise((resolve, reject) => {
      Api.get(`/v1/device/${deviceId}`)
        .then(resp => {
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          dispatch(ERRORS_SHOW, err)
          reject(err)
        })
    })
  },
  [DEVICE_UPDATE]: (
    { dispatch }: { dispatch: Dispatch },
    {
      device_id,
      name,
      category = [],
    }: { device_id: string; name: string; category: string[] }
  ) => {
    return new Promise((resolve, reject) => {
      Api.put(`/v1/device/${device_id}`, { name, category })
        .then(resp => {
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          dispatch(ERRORS_SHOW, err)
          reject(err)
        })
    })
  },
}
const mutations = {
  [DEVICE_LIST]: (
    state: DeviceState,
    { devices, pagination }: { devices: Device[]; pagination: Pagination }
  ) => {
    state.devices = devices
    state.pagination = pagination
  },
  [DEVICE_STATUS]: (
    state: DeviceState,
    { status, device_id }: { status: any[]; device_id: string }
  ) => {
    state.status = {
      ...state.status,
      [device_id]: status,
    }
  },
}

export default { state, getters, actions, mutations }
