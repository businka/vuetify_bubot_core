import Vue from 'vue'

export const coreRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  },
  {
    path: '/:objType/:objName/:objForm',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  }
]

export default coreRoutes

export function redirectToAuth (to, from, next, whiteList) {
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    const cookies = get_session()
    if (cookies && cookies.session) {// && sessionId !== 'deleted') {
      next()
    } else {
      const current = window.location.href
      const auth = current.substr(0, current.indexOf('/ui/')) + '/ui/AuthService/'
      window.location.href = `${auth}?redirect=${window.location.pathname}`
    }
  }
}

export function get_session() {
  return Vue.$cookies.get('session')
}

export function get_user() {
  const session = get_session()
  if (session)
    return session.user
  return undefined
}

export function get_account() {
  const session = get_session()
  if (session)
    return session.account
  return undefined
}
