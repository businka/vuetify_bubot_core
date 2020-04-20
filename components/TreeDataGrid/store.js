import { processInDataSource } from '../../helpers/mixinStore/index'
import { initForm, error } from '../../helpers/mixinStore/actions'
import { initStoreKey } from '../../helpers/mixinStore/mutations'
import { mode } from '../../helpers/mixinStore/getters'

export default {
  namespaced: true,
  state: {
    namespace: 'treeDataGrid',
    formCheckProperty: 'columns'
  },
  getters: {
    // get: get,
    mode: mode
  },
  mutations: {
    initStoreKey: initStoreKey,
    child (state, { key, row, child }) {
      state[key].rows[row.__index]['child'] = child
    },
    setDefaultFilter(state, { uid, filter }) {
      state[uid].filterDefault = filter
      state[uid].filter = filter
    },
    setFilter(state, { uid, filter }) {
      state[uid].filter = Object.assign({}, state.filterDefault, filter)
    },
    query (state, { uid, rows }) {
      state[uid].rows = rows
    },
    showForm (state, { key, data }) {
      state[key].currentForm = {
        template: state[key].defaultForm.template,
        parentUid: state[key].defaultForm.name,
        parentNamespace: state[key].defaultForm.name,
        visible: true,
        form: data

      }
    }
  },
  actions: {
    initForm: initForm,
    error: error,

    child: async (store, payload) => {
      let key = payload.store.uid
      let row = payload.row
      payload.filter = { parent: row.id }
      let child = await processInDataSource('query', store, payload)
      store.commit('child', { key: key, row: payload.row, child })
    },
    query: async (store, payload) => {
      await processInDataSource('query', store, payload)
      // store.commit('query', { uid, rows: result.items })
    },
    rowActivate: (store, payload) => {
      store.commit('showEditForm', payload)
    }
  }
}
