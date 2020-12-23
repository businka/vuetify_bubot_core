import { updateObject } from '../../../helpers/baseHelper'

export default class Source {
  rawData = []
  filteredRawData = []
  total = 0
  filter = {}
  rows = []
  props = {
    rows: [],
    page: 1,
    itemsPerPage: 25,
    appName: '',
    objName: '',
    dataTableOptions: {},
    filterFields: [],
    keyProperty: 'id'
  }
  store
  keyProperty;
  loading = false
  filterFields = []

  constructor (props, store) {
    this.props.appName = store.state.app
    this.store = store
    this.changeProps(props)
    this.rawData = this.props.rows || []
    this.keyProperty = this.props.keyProperty || 'id'
  }

  changeProps (props) {
    this.props = updateObject(this.props, props)
  }

  changeFilter (filter) {
    this.filter = updateObject(this.filter, filter)
    this.props.dataTableOptions.page = 1
    this.query()
  }

  query () {
    throw new Error('method query not implemented in source class')
  }

  call () {
    throw new Error('method call not implemented in source class')
  }

  read () {
    throw new Error('method read not implemented in source class')
  }
}
