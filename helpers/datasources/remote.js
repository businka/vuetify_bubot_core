import axios from 'axios'

export default {
  // initForm: async (store, data) => {
  //   let result
  //   try {
  //     result = await axios.get(`/form/${data.store.uid}`)
  //     data.params = result.data
  //     return data
  //   } catch (error) {
  //     console.error(error)
  //     return false
  //   }
  // },
  list: async (store, payload) => {
    let resp
    let result = []
    let error = null
    try {
      let params = Object.assign(payload.store.mode.filter || {}, payload.filter || {})
      resp = await axios.get(`/${store.rootState.appName}/api/${payload.store.mode.objName}/list`,
        { params }
      )
      result = resp.data
    } catch (err) {
      switch (err.response.status) {
        case 400:
          error = { msg: err.response.data }
          break
        default:
          error = { msg: `${err.response.status}: ${err.response.statusText}` }
      }
    }
    store.commit('list', { uid: payload.store.uid, data: result, error })
    return []
  },
  create: async (store, payload) => {
    let resp
    try {
      resp = await axios.post(`/${store.rootState.appName}/api/${payload.store.mode.objName}/create`, payload.data)
      const form = resp.data.form || payload.params.rowActivateHandler.form

      let params = store.rootGetters['storeData']('Form', form)
      if (!params) {
        // this.loading = true
        params = await store.dispatch(`Form/load`, {
          uid: form,
          params: payload.params
        }, { root: true })
        // this.loading = false
      }

      store.commit('showEditForm', {
        uid: payload.store.uid,
        data: {
          handler: payload.params.rowActivateHandler.name,
          form,
          params,
          visible: true,
          item: resp.data.result,
        }
      })
    } catch (error) {
      console.error(error)
    }
  },
  read: async (store, payload) => {
    let data
    try {
      data = await axios.get(`/${store.rootState.appName}/api/${payload.store.mode.objName}/read?id=${payload.id}`)
      return data.data
    } catch (error) {
      console.error(error)
    }
  },
  delete: async (store, payload) => {
    let data
    try {
      data = await axios.post(`/${store.rootState.appName}/api/${payload.store.mode.objName}/delete`, payload.value)
      return data.data
    } catch (error) {
      console.error(error)
    }
  },
  update: async (store, payload) => {
    let data
    try {
      // let fieldId = payload.store.modeParams[payload.store.mode.fieldId || 'id']
      data = await axios.post(`/${store.rootState.appName}/api/${payload.store.mode.objName}/update`, payload.data)
      return data.data
    }
    catch
      (error) {
      console.error(error)
    }
  },
  action: async (store, payload) => {
    let resp
    let result
    let error = null
    try {
      resp = await axios.post(`/${store.rootState.appName}/api/${payload.store.mode.objName}/action`,
        { data: { name: payload.name, data: payload.data }}
      )
      result = resp.data.result
    } catch (err) {
      if (err.response && err.response.status){
        switch (err.response.status) {
          case 400:
            error = { msg: err.response.data }
            break
          default:
            error = { msg: `${err.response.status}: ${err.response.statusText}` }
        }

      } else {
        throw err
      }
      throw error
    }
    // store.commit('list', { uid: payload.store.uid, data: result, error })
    return result
  },
}
