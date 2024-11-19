let Memory = require('./Memory')
import { updateObject } from 'bubot-helpers/BaseHelper'

export default class WebSocket extends Memory {
  data = []

  async list (filter, nav) {
    let params = updateObject({}, nav, this.props.filterConst, filter)
    // params = this.props.filter
    let actionName = `${this.props.appName}/${this.props.objName}/${this.props.list || 'list'}`
    let _reject, _resolve
    let result = new Promise(function (resolve, reject) {
      _reject = reject
      _resolve = resolve
    })
    this.store.dispatch('LongOperations/run', {
      actionName,
      actionData: params,
      operation: {
        show: false,
        resolve: _resolve,
        reject: _reject,
        autoDelete: true,
      }
    }, { root: true })
    let resp = await result

    return resp.rows || []
  }

  async read (id) {
    console.log(id)
  }

  async create (data) {
    console.log(data)
  }

  async update (data) {
    console.log(data)
  }
}


