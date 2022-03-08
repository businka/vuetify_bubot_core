// import axios from 'axios'
// import Cookies from 'js-cookie'
// import {Base64} from '../../components/Cert/base64'
// import { setToken } from './auth'
import { getSession, redirectToSignIn } from './session'
import buxios from '../../helpers/buxios'
// import { getUrlParam } from '../../helpers/UrlParam'

export default {
  namespaced: true,
  state: {
    _id: null,
    user: {},
    account: {},
    accounts: []
  },
  getters: {},
  mutations: {
    set (state, data) {
      state._id = data._id
      state.user = data.user
    },
    clear (state) {
      state._id = null
      state.user = null
      state.account = null
      state.accounts = []
    }
    // setCert(state, data) {
    //   state.cert = data
    // },
  },
  actions: {
    signIn: async (store) => {
      try {
        // this.visible = true
        // this.title = ''
        // this.loading = true
        const session = getSession()
        const response = await buxios.get('/api/AuthService/User/read_session_info')
        if (!response.data.session)
          redirectToSignIn(window.location.pathname + window.location.search)
        if (session !== response.data.session) console.error('cookie != session_info')
        store.commit('set', {
          _id: response.data.session,
          user: response.data.user,
          account: response.data.account,
          accounts: response.data.accounts
        })
        return !!response.data.user;

      } catch (e) {
        console.error(e)
        store.commit('clear')
        return false
      } finally {
        // this.loading = false
      }
    },
    signOut: async (store) => {
      await buxios.post('/api/AuthService/User/sign_out')
      store.commit('clear')
      redirectToSignIn(window.location.pathname + window.location.search)
    }
  }
}
