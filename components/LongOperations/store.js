// import { processInDataSource } from '../../helpers/mixinStore/index'
// import { initForm, error } from '../../helpers/mixinStore/actions'
// import { initStoreKey } from '../../helpers/mixinStore/mutations'
// import { processInDataSource } from '../../helpers/mixinStore'
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  namespaced: true,
  state: {
    operations: {
      // a1: {
      //   title: 'test1',
      //   status: 'run',
      //   cancelable: true,
      //   show: true,
      //   progress: -1,
      // },
      // a2: {
      //   title: 'test3',
      //   status: 'run',
      //   cancelable: false,
      //   show: true,
      //   message: 'processed',
      //   progress: 70,
      // },
      // a23: {
      //   title: 'test4',
      //   status: 'run',
      //   cancelable: false,
      //   show: true,
      //   progress: 50,
      //
      // },
      // a223: {
      //   title: 'test4',
      //   status: 'error',
      //   cancelable: false,
      //   message: 'Какая то фигня',
      //   show: true,
      //   progress: 50,
      //
      // },
      // a3: {
      //   title: 'test1',
      //   status: 'success',
      //   cancelable: true,
      //   show: true,
      //   progress: 100
      // },
    },
    executed: 0,
    showList: false,
    listTemplate: 'LoListSnackBar',
    currentUid: '',
    currentTemplate: '',
    showCurrent: false
  },
  mutations: {
    run (state, { uid, operation }) {
      Vue.set(state.operations, uid, operation)
      if (state.operations[uid].show)
        state.executed ++;
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
      operation.message = `${payload.data.msg} ${payload.data.detail}`
    },
    success (state, payload) {
      let operation = state.operations[payload.uid]
      if (operation === undefined) {
        console.warn('long operation not found')
        return
      }

      Object.assign(operation, payload.data)
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
    },
    canceling (state, uid) {
      state.operations[uid].status = 'canceling'
    },
    cancel (state, uid) {
      state.operations[uid].status = 'cancel'
    },
    delete (state, uid) {
      if (state.operations[uid].show)
        state.executed --;
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
      payload.operation = payload.operation || {}
      const uid = payload.operation.uid || uuidv4()
      let operation = state.operations.uid
      if (operation && (operation.status === 'pending' || operation.status === 'run'))
        return uid
      Vue.prototype.$socket.sendObj({
        uid,
        name: payload.name,
        type: 'call',
        data: payload.data
      })
      operation = Object.assign({
        message: '',
        template: '',
        templateParams: {},
        title: '',
        result: null,
        callback: null
      }, payload.operation, {
        progress: -1,
        status: 'pending',
      })
      commit('run', { uid, operation })
      return uid
    },
    on_cancel: (store, payload) => {
      store.commit('cancel', payload)
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
      if (operation.resolve){
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
      if (operation.reject){
        operation.reject(payload.data)
      }
    },
    on_notify: (store, payload) => {
      store.commit('notify', payload)
    },
    on_success: (store, payload) => {
      store.dispatch('on_complete', payload)
    }
  }
}
