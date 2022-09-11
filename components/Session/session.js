import Vue from 'vue'
import { navigate } from '../../../Helpers/UrlParam'

export function getSession() {
  return Vue.$cookies.get('session')
}

// export function get_user() {
//   const session = getSession()
//   if (session)
//     return session.user
//   return undefined
// }
//
// export function get_account() {
//   const session = getSession()
//   if (session)
//     return session.account
//   return undefined
// }
//
// export function signOut() {
//   const session = getSession()
//   if (session)
//     return session.account
//   return undefined
// }

export function redirectToSignIn (redirect) {
  let url = getAppUrl()
  if (redirect === undefined) {
    redirect = window.location.pathname
  }
  let destUrl = `${url.base}AuthService/ui/`
  if (destUrl !== window.location.pathname)
    navigate(redirect?`${destUrl}?redirect=${redirect}`:destUrl)
}

export function getAppUrl() {
  let _path = window.location.pathname.split('/')
  let first = _path.indexOf('ui')
  if (first < 1)
    throw new Error('Url not bubot app')
  return {
    base: first > 2 ? `/${_path.slice(0, first - 2).join('/')}/`: '/',
    app: `${_path.slice(first - 1, first + 1).join('/')}/`,
    path: _path.slice(first + 1).join('/')
  }
}
