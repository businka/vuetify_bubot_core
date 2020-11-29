import { initDataSource } from '../../Types/Source/DataSourceLoader'
import { updateObject, objHasOwnProperty } from '../../../helpers/baseHelper'

export default {
  data () {
    return {
      singleSelect: false,
      showOperationsPanel: this.alwaysShowOperationsPanel,
      selected: [],
      selectAll: false,
      loading: true,
      source: undefined,
      options: {},
      editForm: {},
      actionForm: {}
    }
  },
  methods: {
    init () {
      this.selected = []
      const dataSource = updateObject({}, { filterFields: this.filterFields }, this.dataSource, this.options)
      this.source = initDataSource(dataSource, this.$store)
    },
    actionLoading (data) {
      this.$store.commit(`${this.namespace}/loading`, {
        uid: this.store.uid,
        data: data.value
      }, { root: true })
    },
    // async query () {
    //   this.emitAction({ name: 'Loading', data: { value: true } })
    //   try {
    //     await this.$store.dispatch(`${this.namespace}/query`, {
    //       store: this.store,
    //       params: this.params,
    //       data: this.data
    //     }, { root: true })
    //   } finally {
    //     this.emitAction({ name: 'Loading', data: { value: false } })
    //   }
    //
    // },
    // async actionChangeFilter (data) {
    //   await this.$store.commit(`${this.namespace}/setFilter`, {
    //     uid: this.store.uid,
    //     filter: data,
    //   }, { root: true })
    //   this.query()
    // },
    // getSelected() {
    //   return this.$refs[this.store.uid].selection
    //   return
    // },
    // onChangeSelect (event) {
    //   let find = this.selected.indexOf(event['item'])
    //   if (event['value']) {
    //     if (find < 0)
    //       this.selected.push(event['item'])
    //   } else {
    //     this.selectAll = false;
    //     if (find < 0)
    //       return;
    //     this.selected.splice(find, 1)
    //   }
    // },
    // onChangeSelectAll (event) {
    //   if (event['value']) {
    //     this.selectAll = true
    //     this.selected = event['items']
    //   } else {
    //     this.selectAll = false
    //     this.selected = []
    //   }
    // },
    // actionRemoteItemAction: function (actionData) {
    //   // const payload = updateObject({}, actionData.data, {item: this.itemFull, })
    //   const source = objHasOwnProperty(actionData, 'dataSource')? initDataSource(actionData.dataSource.type, this.dataSource): this.source
    //   source.call(actionData.name, this.itemFull)
    // },
    actionDataSourceItemsOperation (actionData) {
      let source
      let payload = updateObject({ data: {} }, actionData)
      if (objHasOwnProperty(actionData, 'dataSource')) {
        source = initDataSource(actionData.dataSource, this.$store)
      } else {
        source = this.source
      }
      payload.method = payload.name
      if (this.selectAll) {
        payload.data.items = null
        payload.data.filter = this.source.filter
      } else {
        payload.data.items = this.selected
        payload.data.filter = null
      }
      source.call(payload)
    },

    async actionRowActivate (data) {
      if (!data.row) {
        console.error('rowActivate - "row" not found')
        return
      }
      if (this.rowActivateHandler.name === 'emitAction') {
        this.$emit('action', { name: 'RowActivate', data })
      } else {

        const form = data.row.form || this.rowActivateHandler.form

        this.editForm = {
          handler: this.rowActivateHandler.name,
          formUid: form,
          // params,
          visible: true,
          formData: { item: data.row, index: data.index },
        }
      }
    },
    async actionHandler (data) {
      this.$store.commit(`${this.store.namespace}/showActionForm`, {
        uid: this.store.uid,
        data: {
          handler: data.handler,
          formUid: data.form,
          visible: true,
          formData: { item: data.item }
        }
      })
    },
    actionCloseEditForm (data) {
      this.editForm.visible = false
      if (data.result) {
        this.source.query()
      }
    },
    actionCloseActionForm (data) {
      this.actionForm.visible = false
      if (data.result) {
        this.source.query()
      }
    },
    setDefaultFilter () {
      this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
        uid: this.store.uid,
        filter: this.modeParams.filter
      })
    },

  }
}
