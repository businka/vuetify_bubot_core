import Vue from 'vue'

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
  const current = window.location.href
  const auth = current.substr(0, current.indexOf('/ui/')) + '/ui/AuthService/'
  const dest_url = auth + redirect?`?redirect=${redirect}`:''
  window.location.href = `${auth}${dest_url}`
}
