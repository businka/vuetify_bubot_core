// import { processInDataSource } from '../../helpers/mixinStore/index'
// import { initForm, error } from '../../helpers/mixinStore/actions'
// import { initStoreKey } from '../../helpers/mixinStore/mutations'
// import { processInDataSource } from '../../helpers/mixinStore'
import Vue from 'vue'
import { objHasOwnProperty } from '../../../Helpers/BaseHelper'
import { v4 as uuidv4 } from 'uuid'

export default {
  namespaced: true,
  state: {
    operations: {},
    executed: 0,
    showList: false,
    listTemplate: 'LoListSnackBar',
    currentUid: '',
    currentTemplate: '',
    showCurrent: false
  },
  getters: {
    getRawDataSource: state => uid => {
      if (!state.operations[uid]) {
        throw new Error(`for long operation ${uid} datasource not found`)
      }
      return state.operations[uid].result
    }

  },
  mutations: {
    run (state, { uid, operation }) {
      Vue.set(state.operations, uid, operation)
      if (state.operations[uid].show)
        state.executed++;
      if (state.executed)
        state.showList = true
    },
    notify (state, { uid, data }) {
      Object.assign(state.operations[uid], data)
    },
    error (state, payload) {
      let operation = state.operations[payload.uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }
      operation.status = 'error'
      operation.result = payload.data
      operation.message = `${payload.data.message} ${payload.data.detail}`
    },
    success (state, payload) {
      let operation = state.operations[payload.uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }
      operation.result = payload.data
      // Object.assign(operation, payload)
      operation.status = 'success'
    },
    showList (state) {
      state.showList = true
    },
    hideList (state) {
      state.showList = false
    },
    showOperation (state, uid) {
      state.currentUid = uid
      state.showCurrent = true
    },
    hideOperation (state) {
      state.showCurrent = false
      state.currentUid = ''
    },
    canceling (state, uid) {
      state.operations[uid].status = 'canceling'
    },
    cancel (state, uid) {
      state.operations[uid].status = 'cancel'
    },
    delete (state, uid) {
      if (state.operations[uid].show)
        state.executed--;
      Vue.delete(state.operations, uid)
      if (!state.executed) {
        state.currentUid = ''
        state.showCurrent = false
        state.showList = false
      }
    },
  },
  actions: {
    cancel: ({ commit }, uid) => {
      Vue.prototype.$socket.sendObj({
        uid,
        type: 'cancel'
      }, { root: true })
      commit('canceling', uid)
    },
    run: ({ commit, state }, payload) => {
      let new_operation = payload.operation || {}
      const uid = new_operation.uid || uuidv4()
      let operation = state.operations.uid
      if (operation && (operation.status === 'pending' || operation.status === 'run'))
        return uid
      Vue.prototype.$socket.sendObj({
        uid,
        type: 'call',
        name: payload.actionName,
        data: payload.actionData
      })
      operation = new_operation
      operation.result = null
      operation.progress = -1
      operation.status = 'pending'
      commit('run', { uid, operation })
      return uid
    },
    on_cancel: (store, payload) => {
      store.commit('cancel', payload.uid)
    },
    on_complete: (store, payload) => {
      const uid = payload.uid
      const operation = store.state.operations[uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }

      store.commit(payload.type, payload)
      if (operation['autoDelete'])
        store.commit('delete', uid)
      if (operation.resolve) {
        operation.resolve(payload.data)
      }
    },
    on_error: (store, payload) => {
      const uid = payload.uid
      const operation = store.state.operations[uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }

      store.commit(payload.type, payload)
      if (operation['autoDelete'])
        store.commit('delete', uid)
      if (operation.reject) {
        operation.reject(payload.data)
      }
    },
    on_notify: (store, payload) => {
      store.commit('notify', payload)
    },
    on_success: (store, payload) => {
      store.dispatch('on_complete', payload)
    },
    delete: ({ state, commit }, uid) => {
      if (state.currentUid === uid) {
        commit('hideOperation')
      }
      if (objHasOwnProperty(state.operations, uid)) {
        commit('delete', uid)
      }

    }
  }
}
