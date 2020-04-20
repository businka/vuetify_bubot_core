import Vue from 'vue'

export function initStoreKey(state, { uid, data }) {
  Vue.set(state, uid, data)
}

export function updateItemPropsArrayPath(state, { uid, path, value }) {
  let result = state[uid]
  let i
  for (i = 0; i < path.length - 1; i++) {
    if (result.hasOwnProperty(path[i])) {
      result = result[path[i]]
    } else {
      throw new Error(`props ${name} not found in state[${uid}] `)
    }
  }
  // if (result.hasOwnProperty(path[i])) {
  //   result[path[i]] = value
  // } else {
  Vue.set(result, path[i], value)
  // }
}

export function updateItemProps(state, { uid, action, path, value }) {
  let result = state[uid]
  const _path = path.split('/')
  let i
  for (i = 0; i < _path.length - 1; i++) {
    if (result.hasOwnProperty(_path[i])) {
      result = result[_path[i]]
    } else {
      if (i === _path.length - 1){  // мы добавляем этот элемент
        Vue.set(result, _path[i], value)
        return
      }
      throw new Error(`props "${_path[i]}" not found in state[${uid}] `)
    }
  }
  // if (result.hasOwnProperty(path[i])) {
  //   result[path[i]] = value
  // } else {
  if (!action || action==='change'){
    Vue.set(result, _path[i], value)
  } else if (action==='push') {
    result[_path[i]].push(value)
  } else if (action==='delete') {
    result[_path[i]].splice(value, 1)
  }

  // }
}