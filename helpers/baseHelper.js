module.exports = {
  objHasOwnProperty,
  isEmptyObject,
  getType,
  updateObject,
  sortArrayNumber,
  sortArrayObject,
  getPropValueByPath
}

function objHasOwnProperty (obj, prop) {
  if (!obj || !prop)
    return false
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isEmptyObject (obj) {
  for (let elem in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, elem)) {
      return false
    }
  }
  return true
}

function getType (value) {
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
        if (!objHasOwnProperty(base, elem)) {
          base[elem] = {}
        }
        _updateObject(base[elem], source[elem])
        break;
      case 'array':
        // if (!objHasOwnProperty(base, elem)) {
        //   base[elem] = []
        // }
        // base[elem] = base[elem].concat(source[elem])
        base[elem] = []
        base[elem] = base[elem].concat(source[elem])
        break;
      default:
        base[elem] = source[elem]
    }
  }
  return base
}

function updateObject (base) {
  if (arguments.length < 2)
    return base
  for (let i = 1; i < arguments.length; i++) {
    _updateObject(base, arguments[i])
  }
  return base
}

function sortArrayNumber (arr) {
  return arr.sort((a, b) => a - b)
}

function sortArrayObject (arr, key) {
  arr.sort(function (a, b) {
    let keyA = a[key].toLowerCase()
    let keyB = b[key].toLowerCase()
    if (keyA < keyB) //сортируем строки по возрастанию
      return -1
    if (keyA > keyB)
      return 1
    return 0
  })
}

function getPropValueByPath (obj, path, def) {
  try {
    let _obj = obj
    let _path = path.split('.')
    let i
    for (i = 0; i < _path.length; i++) {
      if (Object.prototype.hasOwnProperty.call(_obj, _path[i])) {
        _obj = _obj[_path[i]]
      } else {
        return def
      }
    }
    return _obj
  } catch (e) {
    return def
  }
}

