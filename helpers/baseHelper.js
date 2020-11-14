export function isEmptyObject (obj) {
  for (let elem in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, elem)) {
      return false
    }
  }
  return true
}
