import Source from './Source'
import buxios from '../../../helpers/buxios'
import { updateObject } from '../../../helpers/baseHelper'
// import ExtException from '../../../helpers/ExtException'

export default class Service extends Source {
  getAll() {
    return null
  }

  async _query() {
    return null
  }

  async query () {
    this.loading = true
    let resp
    try {
      const limit = this.props.itemsPerPage
      const page = this.props.page
      let params = updateObject({
        limit,
        page
      }, this.props.filter)
      // params = this.props.filter
      let actionName = `${this.props.appName}/${this.props.objName}/${this.props.query||'query'}`

      resp = await buxios.get(`/api/${actionName}`,
        { params }
      )
      this.rows = resp.data.rows
      this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async read (id) {
    this.loading = true
    let resp
    try {
      resp = await buxios.get(`/api/${this.props.appName}/${this.props.objName}/read`,
        { params: { id } }
      )
      this.loading = false
      return resp.data
    } finally {
      this.loading = false
    }
  }

  async call (payload) {
    this.loading = true
    let resp
    try {
      resp = await buxios.post(`/api/${this.props.appName}/${this.props.objName}/${payload.method}`, payload.data)
      this.loading = false
      return resp.data
    } finally {
      this.loading = false
    }

  }
}
