import remote from '../datasources/remote'
import store from '../datasources/store'
import ie1c from '../datasources/ie1c'


export const modes = {
  remote,
  store,
  ie1c
}

export function mode (state) {
  return function (payload) {
    let mode
    if (payload && payload.hasOwnProperty('mode')) { // если указан режим - берем его
      mode = payload.mode
    } else if (payload.hasOwnProperty('key')) { // иначе перем из сохраненного значения
      mode = state[payload.uid].mode
    }
    if (!mode) {
      throw new Error(`${payload.uid} not defined mode`)
    }
    if (modes.hasOwnProperty(mode.name)) {
      return modes[mode.name]
    }
    throw new Error(`${payload.uid} not supported mode "${mode.name}"`)
  }
}

export function get (state) {
  return function (uid, name, value) {
    if (name) {
      if (!state.hasOwnProperty(uid)) {
        throw new Error(`not found key '${uid}' in state ${state.namespace}`)
      }
      if (!state[uid].hasOwnProperty(name)) {
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
      if (!state.hasOwnProperty(uid)) {
        throw new Error(`not found key '${uid}' in state ${state.namespace}`)
      }
      let result = state[uid]
      for (let i = 0; i < path.length; i++) {
        if (result.hasOwnProperty(path[i])) {
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
