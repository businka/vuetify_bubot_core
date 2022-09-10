import buxios from '../../../Helpers/buxios'

export default {
  state: {
    items: [],
    index: {},
    visible: true,
    default: null
  },
  mutations: {
    NavDrawerVisible (state, value) {
      state.visible = value
    },
    NavDrawerItems (state, data) {
      state.items = data.items
      state.index = data.index
      state.default = data.default
    }
  },
  actions: {
    Load: async (store, payload) => {
      let resp
      resp = await buxios.get(
        `/api/${store.rootState.appName}/read_navigation`,
        { headers: { 'Accept-Language': payload.locale } }
      ) //, { params: payload })
      let navData = resp.data.items || []
      let result = { items: navData, index: {}, default: resp.data.default }
      if (navData) {
        navData.forEach((item, i) => {
          if (item.path) {
            result.index[item.path] = i
          }
          if (item.child && item.child.length) {
            item.child.forEach((child) => {
              if (child.path) {
                result.index[child.path] = i
              }
            })
          }
        })
      }
      store.commit('NavDrawerItems', result)
    }
  }
}
