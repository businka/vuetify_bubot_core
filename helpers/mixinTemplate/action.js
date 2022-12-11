export default {
  methods: {
    onAction (action, component) {
      console.log(`${this.$options.name} on action ${action.name} component ${component}`)
      let _action = `action${action.name}`
      if (Object.prototype.hasOwnProperty.call(this, _action)) {
        this[_action](action.data, component)
      } else {
        this.emitAction(action.name, action.data)
      }
    },
    emitAction (name, data) {
      this.$emit('action', { name, data })
    },
    dispatchAction: async function (action) {
      const data = action.data || {}
      // const action_method = `action${action.name}`
      // if (Object.prototype.hasOwnProperty.call(this, action_method)) {
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
    },

    actionOpenLinkInNewTab: function (actionData) {
      // actionData = {name: 'routeName', list: {data: "someData"}}
      let routeData = this.$router.resolve(actionData);
      window.open(routeData.href, '_blank');
      this.$router.go(actionData)
    }
  }
}
