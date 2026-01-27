// import { processInDataSource } from 'bubot-helper/mixinStore/index'
// import { initForm, error } from 'bubot-helper/mixinStore/actions'
// import { initStoreKey, updateItemProps } from 'bubot-helper/mixinStore/mutations'
// import { mode, getProps } from 'bubot-helper/mixinStore/getters'
import axios from 'axios'
import {initStoreKey} from "../../helpers/mixinStore/mutations"
// import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    'data': {}
  },
  // getters: {},
  mutations: {
    initStoreKey: initStoreKey,
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
      if (Object.prototype.hasOwnProperty.call(store.state.data, schemaUid)) {
        return await store.state.data[schemaUid]
      } else {
        // console.log('load scheme ' + schemaUid)
        let result = {}
        try {
          const response = await axios.get(`/${store.rootState.appName}/api/ObjSchema/read`, { params: { id: schemaUid } })
          result = response.data
        } catch (e) {
          result = {}
        }
        store.commit('initStoreKey', {
          uid: schemaUid, data: result
        })
        return result
      }
    }
  }
}
