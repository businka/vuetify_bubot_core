import Memory from './Memory'

export default class Vuex extends Memory {
  data = []

  query () {
    this.rawData = this.store.getters[`${this.props['storeName']}/getRawDataSource`](this.props.filter || {}, { root: true }) || []
    super.query()
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

  async call (payload) {
    // payload.actionName = `${this.props.appName}/${this.props.objName}/${this.props.method}`
    payload.actionName = `${this.props.appName}/${this.props.objName}/${payload.method}`
    return await this.store.dispatch(`${this.props.storeName}/${this.props.dispatchName}`, payload, { root: true })
  }
}


