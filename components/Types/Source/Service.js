import Source from './Source'
import buxios from '../../../helpers/buxios'
// import ExtException from '../../../helpers/ExtException'

export default class Service extends Source {
  async query () {
    this.loading = true
    let resp
    try {
      const limit = this.dataTableOptions.itemsPerPage
      const page = this.dataTableOptions.page
      let params = Object.assign({
        limit,
        page
      }, this.filter)
      resp = await buxios.get(`/api/${this.props.appName}/${this.props.objName}/query`,
        { params }
      )
      this.rows = resp.data.rows
      this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
    } catch (err) {
      this.error = err
      // let e = new ExtException({parent:err, action: 'Service.query'})
      // throw e
    }
    this.loading = false
  }

  async read (id) {
    this.loading = true
    let resp
    try {
      resp = await buxios.get(`/api/${this.props.appName}/${this.props.objName}/read`,
        { id: id }
      )
      this.loading = false
      return resp.data
    } catch (err) {
      this.loading = false
      switch (err.response.status) {
        case 400:
          throw new Error(err.response.data)
        default:
          throw new Error(`${err.response.status}: ${err.response.statusText}`)
      }
    }
  }
}
