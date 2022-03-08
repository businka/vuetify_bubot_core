const { updateObject } = require('../../helpers/baseHelper')
const { findIndexInArrayObj }= require('../../helpers/ArrayHelper')
const Vue = require('vue').default

module.exports = class Source {
  props = {
    // rows: [],
    page: 1,
    filter: {},
    filterConst: {},
    itemsPerPage: 25,
    appName: '',
    objName: '',
    dataTableOptions: {},
    filterFields: [],
    keyProperty: 'id'
  }
  total = 0
  rows = []
  store
  keyProperty;
  loading = false

  constructor (props, store) {
    this.props.appName = store.state.app
    this.store = store
    this.changeProps(props)
    // this.rawData = this.props.rows || []
    this.keyProperty = this.props.keyProperty || 'id'
  }

  changeProps (props) {
    this.props = updateObject(this.props, props)
  }

  async changeFilter (filter) {
    this.props.filter = updateObject(this.props.filterConst, this.props.filter, filter)
    this.props.dataTableOptions.page = 1
    await this.fetchRows()
  }

  async fetchRow (list_id) {
    if (!list_id.length) return
    let filter = updateObject({}, {[this.keyProperty]: list_id.toString()}, this.props.filter)
    let resp = await this.query(filter)
    for (let i = 0; i < list_id.length; i++) {
      let _id = list_id[i]
      let destValueIndex = findIndexInArrayObj(resp.rows, _id, this.keyProperty)
      let srcValueIndex = findIndexInArrayObj(this.rows, _id, this.keyProperty)
      if (srcValueIndex>=0 && destValueIndex >=0) {
        Vue.set(this.rows, srcValueIndex, resp.rows[destValueIndex])
        continue
      }
      if (srcValueIndex>=0 && destValueIndex === -1) { // запись больше не в выборке
        this.rows.splice(srcValueIndex, 1);
      }
    }
  }

  async fetchRows () {
    this.loading = true
    try {
      const limit = this.props.itemsPerPage
      const page = this.props.page
      let resp = await this.query(this.props.filter, {limit, page})
      this.rows = resp.rows || []
      this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }

  async query () {
    throw new Error('method query not implemented in source class')
  }

  async call () {
    throw new Error('method call not implemented in source class')
  }

  async read () {
    throw new Error('method read not implemented in source class')
  }

  async update () {
    throw new Error('method read not implemented in source class')
  }
}
