export function getUrlParams () {
  let result = {}
  let pos = location.href.indexOf('?')
  if (pos !== -1) {
    let query = location.href.substr(pos + 1)
    query.split('&').forEach(function (param) {
      if (!param) return
      let _param = param.split('=')
      if (!_param) return
      result[_param[0]] = _param[1]
    })
  }
  return result
}

export function getUrlParam (name, def) {
  let params = getUrlParams()
  return Object.prototype.hasOwnProperty.call(params, name) ? params[name] : def
}

export function addUrlParam (name, value) {
  let params = getUrlParams()
  params[name] = value
  updateUrlParams(params)
}

export function del_param (name) {
  delete this.param[name]
  updateUrlParams()
}

function updateUrlParams (params) {
  let param = ''
  for (let key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      param += param ? '&' : '?'
      param += key + '=' + params[key]
    }
  }
  window.history.pushState(null, null, param)
}

export function navigate (url) {
  url = decodeURIComponent(url)
  const dest_url = window.location.origin + url
  if ('/?#'.indexOf(url[0]) === -1) {
    throw new Error(`Bad url for redirect: ${dest_url}`)
  }
  window.location.href = dest_url
}
