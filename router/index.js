export const coreRoutes = [
  // {
  //   path: '/',
  //   component: () => import('../components/FormViewer/LayoutFormViewer')
  // },

  {
    path: '/:objName/:subtype/:objForm',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  },
  {
    path: '/:objName/:objForm',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  }
]

export default coreRoutes

