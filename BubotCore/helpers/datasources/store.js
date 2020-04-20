// import { updateItemProps } from './mutations'

// import axios from 'axios/index'

function get_data(store, payload, form) {
  let data = store.rootGetters['storeData'](form.template, payload.store.form)
  let path = payload.store.mode.path.split('/')
  let result = data
  let _path = ''
  for (let i = 0; i < path.length; i++) {
    _path += '.' + path[i]
    if (result.hasOwnProperty(path[i])) {
      result = result[path[i]]
    } else {
      throw new Error(`path local storage not found ${_path} ${payload.store.form}`)
    }
  }
  return result
}


export default {
  query: async (store, payload) => {
    let form = store.rootGetters['storeData']('Form', payload.store.form)
    let data = get_data(store, payload, form)
    data = await { rows: data }
    store.commit('query', { uid: payload.store.uid, data: data })
    return data
  },
  read: async () => {
  },
  create: async (store, payload) => {
    let form = store.rootGetters['storeData']('Form', payload.store.form)
    let rows = get_data(store, payload, form)
    const namespace = form.template
    const uid = payload.store.form
    let new_row = payload.data
    store.commit(`${namespace}/updateItemProps`, {
      uid,
      action: 'push',
      path: payload.store.mode.path,
      value: new_row
    }, { root: true })
    const last_id = rows.length - 1

    form = new_row.form || payload.params.rowActivateHandler.form

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
        index: last_id,
        item: rows[last_id],
      }
    })
  },
  delete: async (store, payload) => {
    let formNamespace = await store.rootGetters['storeData']('Form', payload.store.form)
    store.commit(`${formNamespace.template}/updateItemProps`, {
      uid: payload.store.form,
      action: 'delete',
      path: payload.store.mode.path,
      value: payload.index
    }, { root: true })
  },
  updateRow: async (store, payload) => {
    let formNamespace = await store.rootGetters['storeData']('Form', payload.store.form)
    const path = `${payload.store.mode.path}/${payload.data.index}`
    store.commit(`${formNamespace.template}/updateItemProps`, {
      uid: payload.store.form,
      action: 'change',
      path,
      value: payload.data.value
    }, { root: true })
  }
}
