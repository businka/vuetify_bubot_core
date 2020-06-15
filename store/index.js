import NavDrawer from '../components/NavDrawer/store'
// import User from '../views/Login/store'
import FormViewer from '../components/FormViewer/FormViewer.store'
// import LongOperations from '../components/LongOperations/store'


export const coreModules = {
  Form: FormViewer,
  NavDrawer,
  // User,
  // LongOperations
}

export const coreGetters = {
  storeData: (state) => (namespace, uid, value) => {
    if (state[namespace] === undefined) {
      throw new Error(`namespace "${namespace}" not declared`)
    }
    if (Object.prototype.hasOwnProperty.call(state[namespace], uid)) {
      return state[namespace][uid]
    }
    return value
  }
}

