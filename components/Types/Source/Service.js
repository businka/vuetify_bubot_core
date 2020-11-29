import Source from './Source'
import buxios from '../../../helpers/buxios'
// import ExtException from '../../../helpers/ExtException'

export default class Service extends Source {
  async query () {
    this.loading = true
    let resp
    try {
      const limit = this.props.itemsPerPage
      const page = this.props.page
      let params = Object.assign({
        limit,
        page
      }, this.filter)
      resp = await buxios.get(`/api/${this.props.appName}/${this.props.objName}/query`,
        { params }
      )
      this.rows = resp.data.rows
      this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
    } finally {
      this.loading = false
    }
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
