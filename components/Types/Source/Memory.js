import Source from './Source'
import { isEmptyObject, objHasOwnProperty } from '../../../helpers/baseHelper'

const conditions = {
  'equals': function (filterField, filterValue, row) {
    if (row[filterField['name']] === filterValue)
      return true
    return false
  },
  'in': function (filterField, filterValue, row) {
    if (filterValue[0] && row[filterField['name']] < filterValue[0]) {
      return false
    }
    if (filterValue[1] && row[filterField['name']] > filterValue[1]) {
      return false
    }
    return true
  }
}

export default class Memory extends Source {
  data = []

  queryAll() {
    this.loading = true;
    this.filteredRawData = []
    for (let i = 0; i < this.rawData.length; i++) {
      const row = this.rawData[i]
      let match = true
      if (!isEmptyObject(this.filter)) {
        for (let i = 0; i < this.filterFields.length; i++) {
          if (Object.prototype.hasOwnProperty.call(this.filter, this.fields[i]['name'])) {
            let condition = conditions[this.fields[i]['type'] || 'equals']
            if (!condition(this.fields[i], this.filter[this.fields[i]['name']], row)) {
              match = false
              break
            }
          }
        }
      }
      if (!match)
        continue
      if (objHasOwnProperty(this.filter, 'searchString') && this.filter['searchString']) {
        match = false
        for (let elem in row) {
          if (Object.prototype.hasOwnProperty.call(row, elem)) {
            try {
              if (row[elem].indexOf(this.filter['searchString']) >= 0) {
                match = true
                break;
              }
            } catch (e) {
              // continue regardless of error
            }
          }
        }
      }
      if (match) {
        this.filteredRawData.push(row)
      }
    }
    return this.filteredRawData
  }

  query () {
    this.queryAll()
    const limit = this.props.itemsPerPage
    const page = this.props.page
    const start = (page - 1) * limit;
    const end = start + limit;
    this.rows = this.filteredRawData.slice(start, end);
    this.total = this.filteredRawData.length
    this.loading = false;
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


