const coreRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  },
  {
    path: '/:objType/:objName/:objForm',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  },
  {
    path: '/login',
    component: () => import('../views/Login/Login')
  },
  {
    path: '/logout',
    component: () => import('../views/Login/Logout')
  },

]

export default coreRoutes
