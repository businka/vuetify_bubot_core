import { initDataSource } from '../../DataSource/DataSourceLoader'
import { updateObject, objHasOwnProperty } from '../../../helpers/baseHelper'
// import Vue from 'vue'

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
      actionForm: {},
      actionError: undefined
    }
  },
  methods: {
    init () {
      this.selected = []
      this.editForm = {}
      this.actionForm = {}
      this.actionError = undefined
      this.selected = []
      this.selectAll = false
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
    //   // const payload = updateObject({}, actionData.data, {item: this.deviceLink, })
    //   const source = objHasOwnProperty(actionData, 'dataSource')? initDataSource(actionData.dataSource.type, this.dataSource): this.source
    //   source.call(actionData.name, this.deviceLink)
    // },
    actionReload: async function () {
      await this.source.fetchRows()
    },
    async actionCallDataSourceForSelectedItems (actionData) {
      try {
        let source
        let payload = updateObject({ data: {} }, actionData)
        if (objHasOwnProperty(actionData, 'dataSource')) {
          source = initDataSource(actionData.dataSource, this.$store)
        } else {
          source = this.source
        }
        if (objHasOwnProperty(payload.data, 'items')) {
          payload.data.filter = null

        } else {
          if (this.selectAll) {
            payload.data.items = this.source.queryAll()
            payload.data.filter = this.source.filter
          } else {
            payload.data.items = this.selected
            payload.data.filter = null
          }
        }
        await source.call(payload)
        await this.source.fetchRows()
      } catch (err) {
        // Vue.set(this, error,err)
        this.actionError = err
      }
    },
    actionUpdateTag: async function(data) {
      await this.source.call({method: 'update_tag', data})
      await this.source.fetchRow([data.id])
    },
    actionDeleteTag: async function(data) {
      await this.source.call({method: 'delete_tag', data})
      await this.source.fetchRow([data.id])
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
          panelName: 'editForm',
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
    actionCloseForm: async function (data, component) {
      this[component].visible = false
      if (data && data.reload) {
        await this.source.fetchRows()
      }
    },
    onDrop: async function (event) {
      console.log(event)
    },
    setDefaultFilter: function () {
      this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
        uid: this.store.uid,
        filter: this.modeParams.filter
      })
    },
  }
}
