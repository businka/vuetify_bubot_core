// import { processInDataSource } from '../../mixinStore/index'
import { initForm, error } from '../../helpers/mixinStore/actions'
import { initStoreKey } from '../../helpers/mixinStore/mutations'
// import { get, mode } from '../../mixinStore/getters'

export default {
  namespaced: true,
  state: {
    namespace: 'Browser',
    formCheckProperty: 'dataSource'
  },
  getters: {
    // get: get,
    // mode: mode
  },
  mutations: {
    initStoreKey: initStoreKey,
    massOperationsBarVisible (state, payload) {
      state[payload.uid].massOperationsBarVisible = payload.value
    },
    // query (state, { uid, rows }) {
    //   state[uid].rows = rows
    // },
    // error (state, { uid, error }) {
    //   state[uid].error = error
    // },
    // showEditForm (state, payload) {
    //   let uid = payload.uid
    //   state[uid].editForm = payload.data
    // },
    // hideEditForm (state, payload) {
    //   let uid = payload.uid
    //   state[uid].editForm = {
    //     visible: false
    //   }
    // }
  },
  actions: {
    initForm: initForm,
    error: error
  }
}
