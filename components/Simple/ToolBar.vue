<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ToolBar',
  components: {
  },
  mixins: [ActionMixin],
  props: ["params", "store"],
  // props: {
  //   name: {
  //     type: String,
  //     default: ''
  //   },
  //   params: Object,
  //   modeParams: Object,
  //   storeParams: Object
  // },
  computed: {
    // massOperationsBarVisible: {
    //   get: function() {
    //     return !!(this.data && this.data.massOperationsBar && this.data.massOperationsBarVisible)
    //   },
    //   set: function(val) {
    //     this.$store.commit(`${this.store.namespace}/massOperationsBarVisible`, {
    //       uid: this.store.uid,
    //       value: val
    //     })
    //   }
    // },
    massIcon: function() {
      return this.store.massOperationsBarVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    // data() {
    //   let data = {}
    //   if (this.storeParams.namespace && this.storeParams.uid) {
    //     try {
    //       data = this.$store.getters.storeData(this.storeParams.namespace, this.storeParams.uid, {})
    //     } catch (e) {
    //       if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.storeParams.namespace)) {
    //         throw new Error(`namespace not found in store - ${this.storeParams.namespace}`)
    //       } else {
    //         throw e
    //       }
    //     }
    //   }
    //   return data
    // }
  },
  mounted() {
    // this.init()
  },

  methods: {
    // initForm () {
    // }
    // ...mapActions('TabsBrowser', [
    //   'load',
    //   'setActiveTab'
    // ]),
    //   this.section = this.$route.params.section
    //   this.page = this.$route.params.page
    //   this.key = `${this.section}/${this.page}`
    //   this.load({ key: this.key, active: this.$route.list.tab })
    //   // this.activeTab = this.form.default
    // }
  }
}

</script>

<style lang="scss">
  .jay-space-right {
    margin-right: 8px;
  }

  .bordered {
    border-bottom: thin solid #cccccc;
  }
</style>

<template>
  <v-toolbar
    v-if="params.items"
    dense
    flat
    height="44"
    class="bordered jay-toolbar"
    style="border-color:#cccccc"
  >
    <component
      :is="item.template || 'ActionBtn'"
      v-for="item in params.items"
      :key="item.name"
      :params="item"
      @action="onAction"
    />
    <v-btn
      icon
      dense
      small
      @click="emitAction({name: 'MassOperationsBarVisible', data: !store.massOperationsBarVisible})"
    >
      <v-icon>{{ massIcon }}</v-icon>
    </v-btn>
  </v-toolbar>
</template>
