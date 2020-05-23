export async function processInDataSource (method, store, payload) {
  const mode = store.getters.mode(payload.store)
  if (!Object.prototype.hasOwnProperty.call(mode, method)){
    throw new Error(`method '${method}' not found in datasource ${payload.store.mode.name}`)
  }

  const result = await mode[method](store, payload)
  return result
}

/**
 * @return {boolean}
 */
export function DataAvailabilityCheck (data, prop) {
  return Object.prototype.hasOwnProperty.call(data, prop)
}

export function hasMode (store, mode, storeKey) {
  let modeGetter
  try {
    modeGetter = store.getters.mode
  } catch (e) {
    store.dispatch('error', {
      key: storeKey,
      error: {
        message: 'getter node not found'
      }
    })
    return false
  }
  if (modeGetter({ key: storeKey, mode })) {
    return true
  } else {
    store.dispatch('error', {
      key: storeKey,
      error: {
        message: 'not supported datasource mode',
        detail: `mode: ${mode}, storeKey: ${storeKey}`
      }
    })
    return false
  }
}
