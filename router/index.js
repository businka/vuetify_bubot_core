import LayoutFormViewer from '../components/FormViewer/LayoutFormViewer.vue'

export const coreRoutes = [
  // {
  //   path: '/',
  //   component: () => import('../components/FormViewer/LayoutFormViewer')
  // },

  {
    path: '/:objName/:subtype/:objForm',
    component: LayoutFormViewer
  },
  {
    path: '/:objName/:objForm',
    component: LayoutFormViewer
  }
]

export default coreRoutes

