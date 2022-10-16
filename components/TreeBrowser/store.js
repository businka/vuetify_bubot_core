import { processInDataSource } from '../../helpers/mixinStore/index'
import { initForm, error } from '../../helpers/mixinStore/actions'
import { initStoreKey } from '../../helpers/mixinStore/mutations'
import { mode } from '../../helpers/mixinStore/getters'

export default {
  namespaced: true,
  state: {
    namespace: 'DataGrid',
    formCheckProperty: 'columns'
  },
  getters: {
    // get: get,
    mode: mode
  },
  mutations: {
    initStoreKey: initStoreKey,
    list(state, { uid, data }) {
      state[uid].rows = data.rows
    },
    showEditForm(state, payload) {
      let uid = payload.uid
      state[uid].editForm = payload.data
    },
    hideEditForm(state, payload) {
      let uid = payload.uid
      state[uid].editForm = {
        visible: false,
        index: null
      }
    },
    massOperationsBarVisible (state, payload) {
      state[payload.uid].massOperationsBarVisible = payload.value
    },
  },
  actions: {
    initForm: initForm,
    error: error,

    create: async (store, payload) => {
      await processInDataSource('create', store, payload)
    },

    delete: async (store, payload) => {
      await processInDataSource('delete', store, payload)
    },
    list: async (store, payload) => {
      await processInDataSource('list', store, payload)
    },
    updateRow: async (store, payload) => {
      store.commit('hideEditForm', { uid: payload.store.uid })
      await processInDataSource('updateRow', store, payload)
    }
  }
}
