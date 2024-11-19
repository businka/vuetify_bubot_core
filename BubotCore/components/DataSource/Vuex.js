let Memory = require('./Memory')

export default class Vuex extends Memory {
  data = []

  _list () {
    this.rawData = this.store.getters[`${this.props['storeName']}/getRawDataSource`](this.props.filter.operation || {}, { root: true }) || [];
    return super._list();
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

  async call (data) {
    // payload.actionName = `${this.props.appName}/${this.props.objName}/${this.props.method}`
    data.actionName =  `${this.props.appName}/${this.props.objName}/${data.method}`
    data.dataSource = this.props
    return await this.store.dispatch(`${this.props.storeName}/${this.props.dispatchName}`, data, { root: true })
  }
}


