<script>
import BaseTemplateMixin from '../../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../../helpers/mixinTemplate/action'
import storage from './store'

export default {
  name: 'SelectBrowser',
  components: {
    ToolBarPanel: () => import('../../Simple/ToolBarPanel'),
  },
  mixins: [BaseTemplateMixin, ActionMixin],
  // props: ['item'],
  data: () => ({}),
  computed: {},
  watch: {},
  mounted () {
    this.init()
  },
  beforeCreate () {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    // async init () {
    // this.initStore()
    // await this.initForm()
    // await this.$store.dispatch(`${this.namespace}/read`, {
    //   store: this.store,
    //   params: this.params,
    //   id: this.modeParams.id
    //
    // }, { root: true })
    // },
    // actionUpdateProp ({ path, action, value }) {
    // this.$store.commit(`${this.store.namespace}/updateItemProps`, {
    //   uid: this.store.uid,
    //   path: 'item.links.' + path,
    //   action,
    //   value
    // }, { root: true })
    // },
    // viewItem () {
    //   this.visible = true
    // },
    // close () {
    //   this.visible = false
    // },
    // actionRemoteItemAction: function (action) {
    // this.$store.dispatch('LongOperations/run', {
    //   operation: action,
    //   name: `${this.$store.state.app}/${action.objName || this.store.mode.objName}/${action.name}`,
    //   data: { item: this.data.item }
    // }, { root: true })
    // },
    // async defaultAction () {
    // await this.dispatchAction({ name: 'AddDevice' })
    // this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    // },
    // onClose () {
    //   this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    // },
  }
}
</script>

<style lang="scss">
</style>

<template>
  <v-container
    v-if="store.uid"
    class="pa-0 ma-0"
  >
    <ToolBarPanel
      :params="params.components.toolBarPanel"
      :store="store"
      @action="onAction"
    />
    <component
      :is="params.components.content.template"
      :ref="`${store.uid}:items`"
      :params="params.components.content"
      :store-params="{
        form: store.uid,
        uid: `${store.uid}:items`
      }"
      @action="onAction"
    />
  </v-container>
</template>
