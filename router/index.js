import { get_user, redirect_to_sign_in } from '../components/Session/session'

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
    if (get_user()) {
      next()
    } else {
      redirect_to_sign_in(window.location.pathname)
    }
  }
}

