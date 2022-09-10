// import { processInDataSource } from '../../Helpers/mixinStore/index'
// import { initForm, error } from '../../Helpers/mixinStore/actions'
// import { initStoreKey, updateItemProps } from '../../Helpers/mixinStore/mutations'
// import { mode, getProps } from '../../Helpers/mixinStore/getters'
import axios from 'axios'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {},
  // getters: {},
  mutations: {
    schema (state, { uid, schema }) {
      Vue.set(state, uid, schema)
    },
  },
  actions: {
    async read (store, schemaUid) {
      if (!schemaUid) {
        return {}
      }
      // if (!payload.href && !payload.schemaUid) {
      //   console.error(`not defined schema for "${payload.href}"`)
      //   return {}
      // }
      // const schemaUid = payload.schemaUid
      // const schemaId = rt.join('+')
      if (Object.prototype.hasOwnProperty.call(store.state, schemaUid)) {
        return await store.state[schemaUid]
      } else {
        console.log('load scheme ' + schemaUid)
        let result = {}
        try {
          const response = await axios.get(`/api/${store.rootState.appName}/ObjSchema/read`, { params: { id: schemaUid } })
          result = response.data
        } catch (e) {
          result = {}
        }
        store.commit('schema', {
          uid: schemaUid, schema: result
        })
        return result
      }
    }
  }
}
