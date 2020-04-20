// import Vue from 'vue'
// import 'es6-promise/auto'
import '@/vendor/cadesplugin'

export let dateFormatter = new Intl.DateTimeFormat('ru')

function removeQuites(str) {
  if (!str || str[0] !== '"' || str[str.length - 1] !== '"') {
    return str
  }
  return str.slice(1, str.length - 1).replace(new RegExp('""', 'g'), '"')
}

export function parseCertProps(data, prefix = '', result = {}) {
  let prop
  let props = data.split(',')
  props.forEach((item) => {
    prop = item.trim().split('=')
    result[prefix + prop[0]] = removeQuites(prop[1])
  })
  return result
}

// let certObj = {}

export let mutations = {
  setCertificates(state, payload) {
    state.certs = payload
  },
  addCertificate(state, payload) {
    state.certs.push(payload.cert)
    // certObj[payload.cert.index] = payload.certObj
  },
  updateProgress(state, payload) {
    state.progress = payload
  }
}

export let state = {
  certs: null,
  progress: 0
}

export async function find(store, filter) {
  let result = []
  if (!store.state.certs) {
    await store.dispatch('getCertificates')
  }
  const certs = store.state.certs
  let i, len
  for (i = 0, len = certs.length; i < len; ++i) {
    let found = true
    for (let elem in filter) {
      if (!filter.hasOwnProperty(elem)) {
        continue
      }
      if (certs[i][elem] !== filter[elem]) {
        found = false
        break
      }
    }
    if (found) {
      result.push(certs[i])
    }
  }
  return result
}