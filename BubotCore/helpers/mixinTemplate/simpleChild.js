export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    params: Object,
    modeParams: Object,
    storeParams: Object
  },
  computed: {
    data() {
      let data = {}
      if (this.storeParams.namespace && this.storeParams.uid) {
        try {
          data = this.$store.getters.storeData(this.storeParams.namespace, this.storeParams.uid, {})
        } catch (e) {
          if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.storeParams.namespace)) {
            throw new Error(`namespace not found in store - ${this.storeParams.namespace}`)
          } else {
            throw e
          }
        }
      }
      return data
    },
  }
}
