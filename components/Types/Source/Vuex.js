import Memory from './Memory'

export default class Vuex extends Memory {
  data = []

  query () {
    this.rawData = this.store.getters[`${this.props['objName']}/getRawDataSource`](this.props.filter || {}, { root: true })
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


}


