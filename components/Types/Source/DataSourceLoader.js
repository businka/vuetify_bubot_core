import Memory from './Memory'
import Service from './Service'
const availableSources = {
  Memory,
  Service
}

export function initDataSource(dataSourceName, props, filterFields, store) {
  if (Object.prototype.hasOwnProperty.call(availableSources, dataSourceName)) {
    return new availableSources[dataSourceName](props, filterFields, store)
  }
}
