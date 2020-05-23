import axios from 'axios'
import Cookies from 'js-cookie'
import {Base64} from '../../components/Cert/base64'
// import { setToken } from './auth'


export default {
  namespaced: true,
  state: {
    session: {},
    cert: null
  },
  getters: {},
  mutations: {
    setSession(state, data) {
      state.session = data
    },
    setCert(state, data) {
      state.cert = data
    },
  },
  actions: {
    login: async (store, payload) => {
      const cert = payload.cert
      let sessionSig
      let sessionId
      try {
        const resp = await axios.get('/auth/login_by_cert', payload)
        // sessionId = Base64.encode(resp.data)
        sessionId = resp.data
        // console.log(sessionId, Base64.encode(resp.data))
        // alert(sessionId)
        if (payload.cert.sha1){
          sessionSig = await store.dispatch('cades/signBase64String', {data: Base64.encode(resp.data), cert}, {root: true})
        } else {
          sessionSig = null
        }

        // console.log(resp.data)
      } catch (err) {
        sessionSig = null
        throw err
      }
      try {
        const resp = await axios.post('/auth/login_by_cert', { sessionId, sessionSig})
        store.commit('setSession', resp.data)
        store.commit('setCert', cert)
        Cookies.set('X-Session', store.state.session.session_id)
      } catch (err) {
        store.commit('setSession', null)
        store.commit('setCert', null)
        throw err
      }
    },
    logout: async (store) => {
      store.commit('setSession', {})
      Cookies.remove('X-Session')
    }
  }
}
