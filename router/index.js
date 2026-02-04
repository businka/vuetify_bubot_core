import LayoutFormViewer from '../components/FormViewer/LayoutFormViewer.vue'

export const coreRoutes = [
  {
    path: '/',
    component: () => import('../components/FormViewer/LayoutFormViewer')
  },
  {
    path: '/form/:objName/:subtype/:objForm',
    component: LayoutFormViewer
  },
  {
    path: '/form/:objName/:objForm',
    component: LayoutFormViewer
  }
]

export default coreRoutes

