export default {
  methods: {
    actionLoading (data) {
      this.$store.commit(`${this.namespace}/loading`, {
        uid: this.store.uid,
        data: data.value
      }, { root: true })
    },
    async query () {
      this.emitAction({ name: 'Loading', data: { value: true } })
      await this.$store.dispatch(`${this.namespace}/query`, {
        store: this.store,
        params: this.params,
        data: this.data
      }, { root: true })
      this.emitAction({ name: 'Loading', data: { value: false } })

    },
    async actionChangeFilter( data) {
      await this.$store.commit(`${this.namespace}/setFilter`, {
        uid: this.store.uid,
        filter: data,
      }, { root: true })
      this.query()
    },
    async actionRowActivate (data) {
      if (!data.row) {
        console.error('rowActivate - "row" not found')
        return
      }
      if (this.params.rowActivateHandler.name === 'emitAction') {
        this.$emit('action', { name: 'RowActivate', data })
      } else {

        const form = data.row.form || this.params.rowActivateHandler.form
        let params = this.$store.getters['storeData']('Form', form)
        if (!params) {
          // this.loading = true
          params = await this.$store.dispatch(`Form/load`, {
            uid: form,
            params: this.params
          }, { root: true })
          // this.loading = false
        }

        this.$store.commit(`${this.store.namespace}/showEditForm`, {
          uid: this.store.uid,
          data: {
            handler: this.params.rowActivateHandler.name,
            form,
            params,
            visible: true,
            item: data.row,
            index: data.index,
            // name: 'EditForm'
          }
        })
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
      this.$store.commit(`${this.store.namespace}/hideEditForm`, {
        uid: this.store.uid
      })
      if (data.result) {
        this.query()
      }
    },
    actionCloseActionForm (data) {
      this.$store.commit(`${this.store.namespace}/hideActionForm`, {
        uid: this.store.uid
      })
      if (data.result) {
        this.query()
      }
    },
    setDefaultFilter () {
      this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
        uid: this.store.uid,
        filter: this.modeParams.filter
      })
    },
    async init () {
      this.initStore()
      await this.initForm()
      this.setDefaultFilter()
      await this.query()
    }
  }
}