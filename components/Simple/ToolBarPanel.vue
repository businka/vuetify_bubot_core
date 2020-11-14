<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ToolBarPanel',
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
    //   this.load({ key: this.key, active: this.$route.query.tab })
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
  <v-container class="pa-0 ma-0">
    <v-toolbar
      height="30"
      flat
      dense
      class="header1_bg pa-0 pl-2"
    >
      <v-toolbar-title>
        {{$t(params.title)}}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items
        v-if="params"
        class="pa-0"
      >
        <component
          :is="item.template || 'ActionBtn'"
          v-for="item in params.items"
          :key="item.name"
          :params="item"
          @action="emitAction({name: item.name, data: item.data})"
        />
      </v-toolbar-items>
      <ActionBtnDefault
        v-if="params.defaultAction"
        :params="params.defaultAction"
        @action="emitAction({name: params.defaultAction.name, data: params.defaultAction.data})"
      />
      <v-toolbar-items>
        <v-btn
          icon
          dense
          small
          @click="emitAction({name: 'CloseEditForm'})"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </v-container>
</template>
