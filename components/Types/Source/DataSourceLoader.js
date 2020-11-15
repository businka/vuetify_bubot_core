import Memory from './Memory'
import Service from './Service'
import Vuex from './Vuex'
const availableSources = {
  Memory,
  Service,
  Vuex
}

export function initDataSource(dataSourceName, props, filterFields, store) {
  if (Object.prototype.hasOwnProperty.call(availableSources, dataSourceName)) {
    return new availableSources[dataSourceName](props, filterFields, store)
  }
  throw new Error(`dataSource ${dataSourceName} not implemented`)
}
