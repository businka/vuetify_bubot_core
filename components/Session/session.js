import Vue from 'vue'
import { navigate } from '../../helpers/UrlParam'

export function get_session() {
  return Vue.$cookies.get('session')
}

// export function get_user() {
//   const session = get_session()
//   if (session)
//     return session.user
//   return undefined
// }
//
// export function get_account() {
//   const session = get_session()
//   if (session)
//     return session.account
//   return undefined
// }
//
// export function signOut() {
//   const session = get_session()
//   if (session)
//     return session.account
//   return undefined
// }

export function redirect_to_sign_in (redirect) {
  navigate('/ui/AuthService/' + redirect?`?redirect=${redirect}`:'')
}
