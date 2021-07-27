import { objHasOwnProperty, isEmptyObject } from '../../../helpers/baseHelper'

import Memory from './Memory'
import Service from './Service'
import Vuex from './Vuex'
import WebSocket from './WebSocket'

const availableSources = {
  Memory,
  Service,
  Vuex,
  WebSocket
}

export function initDataSource(props, store) {
  if (!props || isEmptyObject(props)) {
    throw new Error(`dataSource not defined`)
  }
  if (!objHasOwnProperty(props, 'type')) {
    throw new Error(`dataSource type not defined`)
  }
  if (objHasOwnProperty(availableSources, props['type'])) {
    return new availableSources[props['type']](props, store)
  }
  throw new Error(`dataSource ${props['type']} not implemented`)
}
