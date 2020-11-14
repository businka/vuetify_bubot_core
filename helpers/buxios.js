import axios from 'axios'
import { redirectToSignIn, getAppUrl } from '../components/Session/session'
import { navigate } from './UrlParam'
import ExtException from './ExtException'

export default {
  post: async function (url, data, config) {
    try {
      return await axios.post(url, data, config)
    } catch (err) {
      processError(err)
    }
  },
  get: async function (url, data, config) {
    try {
      return await axios.get(url, data, config)
    } catch (err) {
      processError(err)
    }
  }
}

function processError (err) {
  const contentType = err.response.headers['content-type']
  let destPath
  let url = getAppUrl()
  switch (err.response.status) {
    case 401:
      redirectToSignIn(window.location.pathname + window.location.search)
      break
    case 409:
      destPath = `${url.base}${url.app}Account/select`
      if (destPath !== window.location.pathname)
        navigate(`${destPath}?redirect=${url.base}${url.app}${url.path}${window.location.search}`)
      break
    default:
      if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
        throw  new ExtException(err.response.data)
      } else {
        throw(new ExtException({
          message: `${err.response.status} ${err.response.statusText}`,
          detail: err.response.data
        }))
      }
  }
}
