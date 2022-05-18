// import axios from 'axios'
// import Cookies from 'js-cookie'
// import {Base64} from '../../components/Cert/base64'
// import { setToken } from './auth'
import {getSession, redirectToSignIn} from './session'
import buxios from '../../../Helpers/buxios'
// import { getUrlParam } from '../../helpers/UrlParam'

export default {
    namespaced: true,
    state: {
        _id: null,
        user: {},
        account: {},
        accounts: [],
        available: true
    },
    getters: {},
    mutations: {
        set(state, data) {
            state._id = data._id
            state.user = data.user
        },
        clear(state) {
            state._id = null
            state.user = null
            state.account = null
            state.accounts = []
        },
        notAvailable(state) {
            state.available = false
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
                const response = await buxios.get('/public_api/AuthService/User/read_session_info', {params: session})
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
                store.commit('notAvailable')
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
