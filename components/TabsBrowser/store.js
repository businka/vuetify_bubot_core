import { initForm, error } from '../../helpers/mixinStore/actions'
import { initStoreKey} from '../../helpers/mixinStore/mutations'
import { mode, getProps } from '../../helpers/mixinStore/getters'

export default {
  namespaced: true,
  state: {
    namespace: 'TabsBrowser',
    formCheckProperty: 'columns'
  },
  getters: {
    // get: get,
    mode: mode,
    getProps: getProps
  },
  mutations: {
    initStoreKey: initStoreKey,
    loading(state, { uid, value }) {
      state[uid].loading = value
    },
  },
  actions: {
    initForm: initForm,
    error: error,
  }
}
