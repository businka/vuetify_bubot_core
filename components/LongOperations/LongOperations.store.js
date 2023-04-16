// import { processInDataSource } from '../../helpers/mixinStore/index'
// import { initForm, error } from '../../helpers/mixinStore/actions'
// import { initStoreKey } from '../../helpers/mixinStore/mutations'
// import { processInDataSource } from '../../helpers/mixinStore'
import Vue from 'vue'
// import { objHasOwnProperty } from '../../../Helpers/BaseHelper'
import { findIndexInArrayObj, findInArrayObj } from '../../../Helpers/ArrayHelper'
import { v4 as uuidv4 } from 'uuid'

export default {
  namespaced: true,
  state: {
    operations: [],
    executed: 0,
    showList: false,
    listTemplate: 'LoListSnackBar',
    currentUid: '',
    currentTemplate: '',
    showCurrent: false
  },
  getters: {
    find: state => uid => {
      return findInArrayObj(state.operations, uid, 'uid')
    },
    getRawDataSource: state => uid => {
      if (!state.operations[uid]) {
        throw new Error(`for long operation ${uid} datasource not found`)
      }
      return state.operations[uid].result
    }

  },
  mutations: {
    run (state, operation) {

      state.operations.push(operation)
      // Vue.set(state.operations, uid, operation)
      if (operation.show)
        state.executed++;
      if (state.executed)
        state.showList = true
    },
    notify (state, { uid, data }) {
      let operation = findInArrayObj(state.operations, uid, 'uid')
      Object.assign(operation, data)
    },
    error (state, payload) {
      let operation = findInArrayObj(state.operations, payload.uid, 'uid')
      // let operation = state.operations[payload.uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }
      operation.status = 'error'
      operation.result = payload.data
      operation.message = `${payload.data.message} ${payload.data.detail}`
    },
    success (state, payload) {
      // let operation = findInArrayObj(state.operations, payload.uid, 'uid')
      let index = findIndexInArrayObj(state.operations, payload.uid, 'uid')
      let operation = state.operations[index]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }
      console.log(`before ${state.operations[index]['status']}`)
      state.operations.splice(index, 1, Object.assign(operation,{
        result: payload.data,
        status: 'success'
      }))
      console.log(`after ${state.operations[index]['status']}`)
      // operation.result = payload.data
      // Object.assign(operation, payload)
      // operation.status =
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
      let operation = findInArrayObj(state.operations, uid, 'uid')
      operation.status = 'canceling'
    },
    cancel (state, uid) {
      let operation = findInArrayObj(state.operations, uid, 'uid')
      operation.status = 'cancel'
    },
    delete (state, uid) {
      let index = findIndexInArrayObj(state.operations, uid, 'uid')
      let operation = state.operations[index]
      state.operations.splice(index, 1)

      if (operation.show)
        state.executed--;

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
      operation.uid = uid
      operation.result = null
      operation.progress = -1
      operation.status = 'pending'
      commit('run', operation)
      return uid
    },
    on_cancel: (store, payload) => {
      store.commit('cancel', payload.uid)
    },
    on_complete: (store, payload) => {
      console.warn(`on complete ${payload.uid}`)
      const uid = payload.uid
      let operation = store.getters.find(payload.uid)
      // const operation = store.state.operations[uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }

      store.commit(payload.type, payload)

      if (operation['autoDelete'])
        store.commit('delete', uid)
      if (operation && operation.resolve) {
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
      console.log('store on_success')
      store.dispatch('on_complete', payload)
    },
    delete: ({ state, commit }, uid) => {
      if (state.currentUid === uid) {
        commit('hideOperation')
      }
      commit('delete', uid)
    }
  }
}
