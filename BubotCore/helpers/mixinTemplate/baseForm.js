export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: function () { return {}}
    },
    modeParams: {
      type: Object,
      default: function () { return {}}
    },
    storeParams: {
      type: Object,
      default: function () { return {}}
    }
  },
  data: () => ({
    store: {},
    namespace: ''
  }),
  watch: {
    params: function () {
      // console.log(`watch params ${this.$options.name} +  ${this.storeParams.uid}`)
      this.init()
    },
    modeParams () {
      // console.log(`watch modeParams ${this.$options.name} +  ${this.storeParams.uid}`)
      this.init()
    }
  },
  computed: {
    data () {
      let data = {}
      if (this.store.namespace && this.store.uid) {
        try {
          data = this.$store.getters.storeData(this.store.namespace, this.store.uid, {})
        } catch (e) {
          if (!this.$store.state.hasOwnProperty(this.store.namespace)) {
            throw new Error(`namespace not found in store - ${this.store.namespace}`)
          } else {
            throw e
          }
        }
      }
      return data
    }
  },
  methods: {
    init () {
      this.initStore()
      this.initForm()
    },
    initStore () {
      if (!this.namespace) {
        this.namespace = this.$options.name
      }
      this.store = {
        form: this.storeParams.form || this.params.form,
        uid: this.storeParams.uid || this.params.uid,
        namespace: this.storeParams.namespace || this.params.namespace || this.namespace,
        mode: this.params.mode,
        modeParams: this.modeParams
      }
      console.log(`initStore ${this.store.namespace} +  ${this.store.uid}`)
    },
    initForm () {
      this.$store.dispatch(`${this.namespace}/initForm`, {
        store: this.store,
        params: this.params
      }, { root: true })
    }
  }
}
