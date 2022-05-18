import remote from '../datasources/remote'
import store from '../datasources/store'
import ie1c from '../datasources/ie1c'
import websocket from '../datasources/websocket'
import {objHasOwnProperty} from '../../../Helpers/BaseHelper'
// import '../ExtException'


export const modes = {
  remote,
  store,
  ie1c,
  websocket
}

export function mode (state) {
  return function (payload) {
    let mode
    if (payload && objHasOwnProperty(payload, 'mode')) { // если указан режим - берем его
      mode = payload.mode
    } else if (objHasOwnProperty(payload, 'key')) { // иначе перем из сохраненного значения
      mode = state[payload.uid].mode
    }
    if (!mode) {
      throw new Error(`${payload.uid} not defined mode`)
    }
    if (objHasOwnProperty(modes, mode.name)) {
      return modes[mode.name]
    }
    throw new Error(`${payload.uid} not supported mode "${mode.name}"`)
  }
}

export function get (state) {
  return function (uid, name, value) {
    if (name) {
      if (!objHasOwnProperty(state, uid)) {
        throw new Error(`not found key '${uid}' in state ${state.namespace}`)
      }
      if (!objHasOwnProperty(state[uid], name)) {
        if (value) {
          return value
        }
        throw new Error(`props ${name} not found in state[${uid}] `)
      }
      return state[uid][name]
    } else {
      if (state[uid]) {
        return state[uid]
      }
    }
    return {}
  }
}

export function getProps (state) {
  return function (uid, path, value) {
    if (path) {
      if (!objHasOwnProperty(state, uid)) {
        throw new Error(`not found key '${uid}' in state ${state.namespace}`)
      }
      let result = state[uid]
      for (let i = 0; i < path.length; i++) {
        if (objHasOwnProperty(result, path[i])) {
          result = result[path[i]]
        } else {
          return value
        }
      }
      return result
    } else {
      if (state[uid]) {
        return state[uid]
      }
    }
    return {}
  }
}
