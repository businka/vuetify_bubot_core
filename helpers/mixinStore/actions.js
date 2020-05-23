import { jsonClone } from '../clone'

export async function error (store, { storeKey, error }) {
  // console.error(`${store.state.namespace}: ${error.message} (${error.detail})`)
  if (Object.prototype.hasOwnProperty.call(store.state, storeKey)) {
    store.commit('Error', error)
  }
}

export function initForm (store, data) {
  let _store = data.store
  let _params = data.params
  let uid = _store.uid
  store.commit('initStoreKey', { uid, data: jsonClone(_params.store || {}) })
}
