
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

