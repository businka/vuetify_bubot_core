import axios from 'axios'
import { initStoreKey } from '../../helpers/mixinStore/mutations'

export default {
  namespaced: true,
  state: {
    namespace: 'form'
  },
  mutations: {
    initStoreKey: initStoreKey,
    NavDrawerItems (state, data) {
      state.items = data.items
      state.index = data.index
    }
  },
  actions: {
    load: async (store, payload) => {
      try {
        let uid = payload.uid
        let { data } = await axios.get(`/${store.rootState.appName}/form/${uid}`) //, { params: payload })
        store.commit('initStoreKey', { uid, data })
        return data
      } catch (err) {
        console.error(err)
        let error
        if (err.response && err.response.status){
          switch (err.response.status) {
            case 400:
            case 500:
              error = err.response.data
              break
            default:
              error = `${err.response.status}: ${err.response.statusText}`
          }
        }
        if (error) {
          throw error
        }
        throw err
      }
    }
  }
}
