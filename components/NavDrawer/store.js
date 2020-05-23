import axios from 'axios'

export default {
  state: {
    items: [],
    index: {},
    visible: true,
    default: null
  },
  mutations: {
    NavDrawerVisible(state, value) {
      state.visible = value
    },
    NavDrawerItems(state, data) {
      state.items = data.items
      state.index = data.index
      state.default = data.default
    }
  },
  actions: {
    Load: async (store, payload) => {
      let resp
      try {
        resp = await axios.get(
          '/api/Catalog/User/navigation',
          { headers: { 'Accept-Language': payload.locale } }
        ) //, { params: payload })
      } catch (error) {
        if (error.response.status === 401){
          payload.router.push({ path: '/login', query: {redirect: payload.path }})
        }
        throw error
      }
      let navData = resp.data.result.items
      let result = { items: navData, index: {}, default: resp.data.result.default }
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
      store.commit('NavDrawerItems', result)
    }
  }
}
