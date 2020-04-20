export default {
  methods: {
    emitAction(action) {
      console.log(`${this.$options.name} emit action ${action.name}`)
      let _action = `action${action.name}`
      if (this.hasOwnProperty(_action)) {
        this[_action](action.data)
      } else {
        this.$emit('action', action)
      }
    },
    async dispatchAction(action) {
      const data = action.data || {}
      // const action_method = `action${action.name}`
      // if (this.hasOwnProperty(action_method)) {
      //   this[action_method](action)
      // } else {
      let namespace = data.namespace || this.store.namespace

      console.log(`${this.$options.name} dispatch action ${namespace}/${action.name}`)
      await this.$store.dispatch(
        `${namespace}/${action.name}`,
        {
          store: this.store,
          params: this.params,
          data: action.data
        },
        { root: true })
      // }
    }
  }
}
