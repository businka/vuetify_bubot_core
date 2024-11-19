// import Vue from 'vue'
// import { ref } from 'vue'
import {updateProp } from '../../components/JsonEditor/JsonHelper'

export function initStoreKey(state, { uid, data }) {
  state.data = {...state.data, [uid]: data}
}

export function updateItemPropsArrayPath(state, { uid, path, value }) {
  let result = state[uid]
  let i
  for (i = 0; i < path.length - 1; i++) {
    if (Object.prototype.hasOwnProperty.call(result, path[i])) {
      result = result[path[i]]
    } else {
      throw new Error(`props ${name} not found in state[${uid}] `)
    }
  }
  // if (Object.prototype.hasOwnProperty.call(result, path[i])) {
  //   result[path[i]] = value
  // } else {
  result[path[i]] = value
  // }
}

export function updateItemProps(state, { uid, action, path, value }) {
  let result = state[uid]
  updateProp(result, {action, path, value})
}
