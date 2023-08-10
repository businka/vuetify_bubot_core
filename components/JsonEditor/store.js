import { processInDataSource } from '../../helpers/mixinStore/index'
import { initForm, error } from '../../helpers/mixinStore/actions'
import { initStoreKey, updateItemProps } from '../../helpers/mixinStore/mutations'
import { mode, getProps } from '../../helpers/mixinStore/getters'

export default {
  namespaced: true,
  state: {
    namespace: 'JsonForm',
    formCheckProperty: 'columns',
    data: {}
  },
  getters: {
    // get: get,
    mode: mode,
    getProps: getProps
  },
  mutations: {
    initStoreKey: initStoreKey,
    updateItemProps: updateItemProps,
    read(state, { uid, data }) {
      state[uid].item = data
      state[uid].loading = false
    },
    loading(state, { uid, value }) {
      state[uid].loading = value
    },
  },
  actions: {
    initForm: initForm,
    error: error,
    read: async (store, payload) => {
      store.commit('loading', { uid: payload.store.uid, value: true })
      let data = await processInDataSource('read', store, payload)
      store.commit('read', { uid: payload.store.uid, data: data })
    },
    update: async (store, payload) => {
      // store.commit('loading', { uid: payload.store.uid, value: true })
      payload.data = store.state[payload.store.uid].item
      await processInDataSource('update', store, payload)
      // store.commit('read', { uid: payload.store.uid, data: data })
    }
  }
}
