import Vue from 'vue'

export function updateProp(result, {action, path, value}) {
    if (!result) {
        return
    }
    const _path = path.split('.')
    let i
    for (i = 0; i < _path.length - 1; i++) {
        if (Object.prototype.hasOwnProperty.call(result, _path[i])) {
            result = result[_path[i]]
        } else {
            if (i === _path.length - 1) {  // мы добавляем этот элемент
                Vue.set(result, _path[i], value)
                return
            }
            throw new Error(`props "${_path[i]}" not found in source object`)
        }
    }
    if (_path[i] === '')
        return
    if (!action || action === 'change') {
        Vue.set(result, _path[i], value)
    } else if (action === 'push') {
        if (!result[_path[i]]) {
            Vue.set(result, _path[i], [])
        }
        result[_path[i]].push(value)
    } else if (action === 'delete') {
        result[_path[i]].splice(value, 1)
        // Vue.delete(result[_path[i]], value)
        // Vue.set(result, _path[i], result[_path[i]])
    }
}

