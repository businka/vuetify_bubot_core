import { processInDataSource } from '../../../helpers/mixinStore/index'
import { initForm, error } from '../../../helpers/mixinStore/actions'
import { initStoreKey } from '../../../helpers/mixinStore/mutations'
import { mode } from '../../../helpers/mixinStore/getters'
// import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    namespace: 'DataGrid',
    'data': {}
  },
  getters: {
    // get: get,
    mode: mode
  },
  mutations: {
    initStoreKey: initStoreKey,
    setDefaultFilter(state, { uid, filter }) {
      state[uid].filterDefault = filter
      state[uid].filter = filter
    },
    setFilter(state, { uid, filter }) {
      if (!uid && !state[uid]) {
        return
      }
      state[uid].filter = Object.assign({}, state.filterDefault, state[uid].filter, filter)
      // Vue.set(this.groupShow, name, true)
    },
    list(state, { uid, data, error }) {
      state[uid].rows = data.rows || []
      state[uid].error = error
    },
    loading(state, { uid, data }) {
      state[uid].loading = data
    },
    showEditForm(state, payload) {
      let uid = payload.uid
      state[uid].editForm = payload.data
    },
    showActionForm(state, payload) {
      let uid = payload.uid
      state[uid].actionForm = payload.data
    },
    hideEditForm(state, payload) {
      let uid = payload.uid
      state[uid].editForm = {
        visible: false,
        index: null
      }
    },
    hideActionForm(state, payload) {
      let uid = payload.uid
      state[uid].actionForm = {
        visible: false
      }
    },
    massOperationsBarVisible(state, payload) {
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
    setFilter: async (store, payload) => {
      store.commit('setFilter', payload)
      await store.dispatch('list', payload)
    },
    list: async (store, payload) => {
      // console.log('list - ' + payload)
      // store.commit("loading", { uid: payload.store.uid, data: true})
      payload.filter = store.state[payload.store.uid].filter
      await processInDataSource('list', store, payload)
      // store.commit("loading", { uid: payload.store.uid, data: false})
    },
    updateRow: async (store, payload) => {
      store.commit('hideEditForm', { uid: payload.store.uid })
      await processInDataSource('updateRow', store, payload)
    }
  }
}
