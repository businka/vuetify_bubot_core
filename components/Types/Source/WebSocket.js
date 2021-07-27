import Memory from './Memory'
import { updateObject } from '../../../helpers/baseHelper'

export default class WebSocket extends Memory {
  data = []

  async query () {
    this.loading = true
    try {
      const limit = this.props.itemsPerPage
      const page = this.props.page
      let params = updateObject({
        limit,
        page
      }, this.props.filter)
      let actionName = `${this.props.appName}/${this.props.objName}/${this.props.query||'query'}`
      let _reject, _resolve
      let result = new Promise(function(resolve, reject) {
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

      this.rows = resp.rows || []
      this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
    } catch (e) {
      this.error = e
    }
    this.loading = false
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


