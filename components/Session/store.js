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
    // login: async (store, payload) => {
    //   const cert = payload.cert
    //   let sessionSig
    //   let sessionId
    //   try {
    //     const resp = await axios.get('/auth/login_by_cert', payload)
    //     // sessionId = Base64.encode(resp.data)
    //     sessionId = resp.data
    //     // console.log(sessionId, Base64.encode(resp.data))
    //     // alert(sessionId)
    //     if (payload.cert.sha1){
    //       sessionSig = await store.dispatch('cades/signBase64String', {data: Base64.encode(resp.data), cert}, {root: true})
    //     } else {
    //       sessionSig = null
    //     }
    //
    //     // console.log(resp.data)
    //   } catch (err) {
    //     sessionSig = null
    //     throw err
    //   }
    //   try {
    //     const resp = await axios.post('/auth/login_by_cert', { sessionId, sessionSig})
    //     store.commit('setSession', resp.data)
    //     store.commit('setCert', cert)
    //     Cookies.set('X-Session', store.state.session.session_id)
    //   } catch (err) {
    //     store.commit('setSession', null)
    //     store.commit('setCert', null)
    //     throw err
    //   }
    // },
    signIn: async (store) => {
      try {
        // this.visible = true
        // this.title = ''
        // this.loading = true
        const session = getSession()
        const response = await buxios.get('/api/AuthService/User/read_session_info')
        if (session !== response.data.session) console.error('cookie != session_info')
        store.commit('set', {
          _id: response.data.session,
          user: response.data.user
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
