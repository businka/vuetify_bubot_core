import axios from 'axios/index'
import { commandTo1C } from '../c1/connector1C'
import UrlParam from '../../../Helpers/UrlParam'

async function query_ie(store, payload, method, config) {

  config.method = 'post'
  config.url = `/${payload.store.mode.objType}/api/${payload.store.mode.objName}/get_query`

  const resp1 = await axios.request(config)

  let form = ''

  if (new UrlParam().get('test')) {
    form = payload.store.modeParams.connector
    method = payload.store.modeParams.config
  }

  const data2 = await commandTo1C(form, method, resp1.data.result)

  config.url = `/${payload.store.mode.objType}/api/${payload.store.mode.objName}/parse_response_query`
  config.data.response = data2
  let data3
  data3 = await axios.request(config)
  return data3
}


export default {
  initForm: async (store, data) => {
    let result
    try {
      result = await axios.get(`/form/${data.store.uid}`)
      data.params = result.data
      return data
    } catch (error) {
      // console.error(error)
      return false
    }
  },
  query: async (store, payload) => {
    let data = []
    let error = {}
    try {
      let config = Object.assign({
        filter: payload.filter,
        method: 'query',
      }, payload.store.modeParams)

      let resp = await query_ie(store, payload, 'query', {
        data: config
      })
      data = resp.data.result

    } catch (err) {
      error.msg = err.toString()
      console.error(err)
    }
    store.commit('query', { uid: payload.store.uid, data, error })
  },
  import: async (store, payload) => {
    const method = 'read'
    let error = {}
    try {
      let config = Object.assign({
        item: payload.item,
        method,
      }, payload.store.modeParams)

      let resp = await query_ie(store, payload, method, {
        data: config
      })
      return resp.data.result

    } catch (err) {
      error.msg = err.toString()
      console.error(err)
    }
  },

  read: async (store, payload) => {
    try {
      let fieldId = payload.store.modeParams[payload.store.mode.fieldId || 'id']
      const data = await query_ie(store, payload, 'read', {
        url: `/${payload.store.mode.objType}/api/${payload.store.mode.objName}/read`,
        params: { id: fieldId }
      })
      return data.data.data.items
    } catch (error) {
      console.error(error)
    }
  },
}
