import Memory from './Memory'

export default class Vuex extends Memory {
  data = []

  queryAll () {
    this.rawData = this.store.getters[`${this.props['storeName']}/getRawDataSource`](this.props.filter.operation || {}, { root: true }) || [];
    return super.queryAll();
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
    let payload = {
      actionName: `${this.props.appName}/${this.props.objName}/${data.method}`,
      dataSource: this.props,
      'data': data.data,
      resultForm: data.resultForm
    }
    return await this.store.dispatch(`${this.props.storeName}/${this.props.dispatchName}`, payload, { root: true })
  }
}


