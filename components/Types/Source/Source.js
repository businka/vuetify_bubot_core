export default class Source {
  rawData = []
  filteredRawData = []
  rows = []
  dataTableOptions = {}
  total = 0
  filter = {}
  props = {
    rows: []
  }
  store
  keyProperty = 'id'
  loading = false
  filterFields = []

  constructor (props, filterFields, store) {
    this.props = Object.assign(this.props, props)
    this.filterFields = filterFields
    this.keyProperty = this.props['keyProperty'] || 'id'
    this.rawData = this.props.rows
    this.store = store
  }

  changeFilter (filter) {
    this.filter = Object.assign(this.filter, filter)
    this.dataTableOptions.page = 1
    this.query()
  }

  query () {
  }
}
