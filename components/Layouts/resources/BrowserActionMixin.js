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
  }, methods: {
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
    onChangeSelect (event) {
      let find = this.selected.indexOf(event['item'])
      if (event['value']) {
        if (find < 0)
          this.selected.push(event['item'])
      } else {
        this.selectAll = false;
        if (find < 0)
          return;
        this.selected.splice(find, 1)
      }
    },
    onChangeSelectAll (event) {
      if (event['value']) {
        this.selectAll = true
        this.selected = event['items']
      } else {
        this.selectAll = false
        this.selected = []
      }
    },
    actionRemoteLongMassOperation (actionData) {
      const self = this
      let payload = Object.assign({ data: {} }, actionData)
      payload.name = `${this.$store.state.app}/${this.dataSource.objName}/${payload.name}`
      if (this.selectAll) {
        payload.data.items = null
        payload.data.filter = this.source.filter
      } else {
        payload.data.items = this.selected.map(function (item) {
          return item[self.dataSource.keyProperty]
        })
        payload.data.filter = null
      }
      this.$store.dispatch('LongOperations/run', payload, { root: true })
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
          uid: form,
          // params,
          visible: true,
          item: data.row,
          index: data.index,
          // name: 'EditForm'
        }
      }
    },
    async actionHandler (data) {
      this.$store.commit(`${this.store.namespace}/showActionForm`, {
        uid: this.store.uid,
        data: {
          handler: data.handler,
          form: data.form,
          visible: true,
          item: data.item
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
    // async init () {
    //   this.initStore()
    //   await this.initForm()
    //   this.setDefaultFilter()
    //   await this.query()
    // }
  }
}
