// import { app } from '@/main.js'
// import { reactive } from 'vue'

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
                result[_path[i]] = value
                return
            }
            result[_path[i]] = {}
            result = result[_path[i]]
            //throw new Error(`props "${_path[i]}" not found in source object`)
        }
    }
    if (_path[i] === '')
        return
    switch (action) {
        case 'change':
            result[_path[i]] = value
            break
        case 'append':
            if (!result[_path[i]]) {
                result[_path[i]] = []
            }
            result[_path[i]].push(value)
            break
        case 'extend':
            if (!result[_path[i]]) {
                result[_path[i]] = []
            }
            result[_path[i]].push(...value)
            break
        case 'delete':
            result[_path[i]].splice(value, 1)
            break
        default:
            console.error(`Unknown action ${action}`)

    }
}

export function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

export function getPropByPath(src, path, defaultValue) {
    let _src = src
    const _path = path.split('.')
    let i
    try {
        for (i = 0; i < _path.length; i++) {
            if (Object.prototype.hasOwnProperty.call(_src, _path[i])) {
                _src = _src[_path[i]]
            } else {
                return defaultValue
            }
        }
    } catch (e) {
        return defaultValue
    }
    return _src
}


