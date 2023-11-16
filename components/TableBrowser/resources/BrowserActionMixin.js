import {initDataSource} from '../../DataSource/DataSourceLoader'
import {updateObject, objHasOwnProperty} from '@/Helpers/BaseHelper'
// import Vue from 'vue'

export default {
  data() {
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
      actionError: undefined,
      needUpdate: false
    }
  },
  methods: {
    init() {
      // console.log(`Browser init ${this.dataSource.objName} filterConst ${JSON.stringify(this.filterConst)} options ${JSON.stringify(this.options)}`)
      this.selected = []
      this.editForm = {}
      this.actionForm = {}
      this.actionError = undefined
      this.selectAll = false
      let dataSource = updateObject({}, {
        filterFields: (this.filterFields || {}),
        filterConst: (this.filterConst || {})
      }, this.dataSource, this.options)
      this.needUpdate = true
      try {
        this.source = initDataSource(dataSource, this.$store)
      } catch (err) {
        this.source = initDataSource({type: 'Memory'}, this.$store)
        this.source.error = err
      }
    },
    actionLoading(data) {
      this.$store.commit(`${this.namespace}/loading`, {
        uid: this.store.uid,
        data: data.value
      }, {root: true})
    },
    // async list () {
    //   this.emitAction({ name: 'Loading', data: { value: true } })
    //   try {
    //     await this.$store.dispatch(`${this.namespace}/list`, {
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
    //   this.list()
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
      // console.log('actionReload')
      this.source.props.page = 1
      await this.source.fetchRows()
    },
    actionAdd: async function (data) {
      let res = await this.source.add(data)
      this.actionRowActivate(res)
    },

    actionCallDataSourceForSelectedItems: async function (actionData) {
      await this.actionCallDataSource(actionData, true)
    },
    actionCallDataSource: async function (actionData, addSelectionItems) {
      try {
        let source

        let payload = updateObject({data: {}}, actionData, {data: {filter: this.source.props.filterConst}})
        if (objHasOwnProperty(actionData, 'dataSource')) {
          source = initDataSource(actionData.dataSource, this.$store)
        } else {
          source = this.source
        }
        if (objHasOwnProperty(payload.data, 'items')) {
          // payload.data.filter = null

        } else {
          if (this.selectAll) {
            payload.data.items = this.source.listAll()
            payload.data.filter = this.source.filter
          } else {
            payload.data.items = this.selected
            // payload.data.filter = null
          }
        }
        await source.call(payload)
        // console.log('actionCallDataSourceForSelectedItems')

        await this.source.fetchRows()
      } catch (err) {
        // Vue.set(this, error,err)
        this.actionError = err
      }
    },
    actionUpdateTag: async function (data) {
      console.log('actionUpdateTag')
      await this.source.call({method: 'update_tag', data})
      await this.source.fetchRow([data.id])
    },
    actionDeleteTag: async function (data) {
      await this.source.call({method: 'delete_tag', data})
      await this.source.fetchRow([data.id])
    },
    RowActivateHandlerEmitAction(data) {
      this.$emit('action', {name: 'RowActivate', data})
    },
    RowActivateHandlerShowForm(data) {
      let formName = data.row.form || this.rowActivateHandler.form
      let formUid
      if (formName.indexOf('/') < 0) {
        formUid = `${this.source.props.objName}${data.row.subtype ? ('/' + data.row.subtype) : ''}/${formName}`
      } else {
        formUid = formName
      }
      this.editForm = {
        handler: this.rowActivateHandler['formViewer'],
        formUid: formUid,
        formVisible: true,
        formData: {item: data.row, index: data.index, filterConst: this.source.props.filterConst},
      }
      // console.log(`BrowserActionMixin RowActivateHandlerShowForm ${JSON.stringify(this.editForm)}`)
    },
    RowActivateHandlerExternal(data) {
      console.log(`RowActivateHandlerExternal ${JSON.stringify(data)}`)
      this.externalRowActivateHandler(this, data)
    },
    actionRowActivate: function (data) {
      if (!data.row) {
        console.error('rowActivate - "row" not found')
        return
      }
      let handler = `RowActivateHandler${this.rowActivateHandler.name}`
      if (objHasOwnProperty(this, handler)) {
        this[handler](data)
      } else {
        console.log(`RowActivateHandler not found ${this.rowActivateHandler.name}`)
      }
    },
    async actionShowActionForm(data) {
      this.editForm = {
        handler: data.handler,
        formUid: data.formUid,
        formVisible: true,
        formData: {item: data.row, index: data.index, filterConst: this.source.props.filterConst},
      }
      // this.$store.commit(`${this.store.namespace}/showActionForm`, {
      //     uid: this.store.uid,
      //     data: {
      //         handler: data.handler,
      //         formUid: data.form,
      //         formVisible: true,
      //         formData: {item: data.item}
      //     }
      // })
    },
    actionCloseForm: async function (data, panelName) {
      this[panelName].formVisible = false
      if (data) {
        if (data.fetchRow) {
          console.log(`actionCloseForm fetchRow ${data.fetchRow}`)
          await this.source.fetchRow(data.fetchRow)
        }
        if (data.fetchRows) {
          console.log('actionCloseForm fetchRows')
          await this.source.fetchRows()
        }
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
