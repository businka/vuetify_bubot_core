import { objHasOwnProperty } from '../../../helpers/baseHelper'

import Memory from './Memory'
import Service from './Service'
import Vuex from './Vuex'
const availableSources = {
  Memory,
  Service,
  Vuex
}

export function initDataSource(props, store) {
  if (!objHasOwnProperty(props, 'type')) {
    throw new Error(`dataSource type not defined`)
  }
  if (objHasOwnProperty(availableSources, props['type'])) {
    return new availableSources[props['type']](props, store)
  }
  throw new Error(`dataSource ${props['type']} not implemented`)
}
