import NavDrawer from '../components/NavDrawer/store'
import FormViewer from '../components/FormViewer/FormViewer.store'
import Session from '../components/Session/store'
// import LongOperations from '../components/LongOperations/store'


export const coreModules = {
  Form: FormViewer,
  NavDrawer,
  Session,
  // LongOperations
}

export const coreGetters = {
  storeData: (state) => (namespace, uid, value) => {
    if (state[namespace] === undefined) {
      throw new Error(`namespace "${namespace}" not declared`)
    }
    if (Object.prototype.hasOwnProperty.call(state[namespace].data, uid)) {
      return state[namespace].data[uid]
    }
    return value
  }
}

