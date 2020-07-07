import axios from 'axios'

export default {
  post: async function (url, data, config) {
    try {
      return await axios.post(url, data, config)
    } catch (err) {
      const contentType = err.response.headers['content-type']
      if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
        throw(err.response.data)
      } else {
        throw({
          msg: `${err.response.status} ${err.response.statusText}`,
          detail: err.response.data
        })
      }
    }
  },
  get: async function (url, data, config) {
    try {
      return await axios.get(url, data, config)
    } catch (err) {
      const contentType = err.response.headers['content-type']
      if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
        throw(err.response.data)
      } else {
        throw({
          msg: `${err.response.status} ${err.response.statusText}`,
          detail: err.response.data
        })
      }
    }
  }
}
