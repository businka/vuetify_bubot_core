export function isEmptyObject (obj) {
  for (let elem in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, elem)) {
      return false
    }
  }
  return true
}

export function getType (value) {
  let baseType = typeof value
  switch (typeof value) {
    case 'object':
      if (value instanceof Array)
        return 'array'
      else if (value === null)
        return 'null'
      return 'object'
    case 'symbol':
      return 'string'
    default:
      return baseType
  }
}

function _updateObject (base, source) {
  if (isEmptyObject(source))
    return base
  for (let elem in source) {
    if (!Object.prototype.hasOwnProperty.call(source, elem))
      continue
    let elemType = getType(source[elem])
    switch (elemType) {
      case 'object':
        if (!Object.prototype.hasOwnProperty.call(base, elem)) {
          base[elem] = {}
        }
        _updateObject(base[elem], source[elem])
        break;
      case 'array':
        base[elem] = base[elem].concat(source[elem])
        break;
      default:
        base[elem] = source[elem]
    }
  }
  return base
}

export function updateObject (base) {
  if (arguments.length < 2)
    return base
  for (let i = 1; i < arguments.length; i++) {
    _updateObject(base, arguments[i])
  }
  return base
}
