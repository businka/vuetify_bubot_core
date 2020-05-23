<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import DataGridMixin from './DataGrid.mixin'
import ActionMixin from '../../helpers/mixinTemplate/action'
import storage from './store'
// import { initConnector } from '../../helpers/c1/connector1C'

export default {
  name: 'TreeDataGrid',
  components: {
    // 'Default': () => import('../../components/Cells/Default'),
    // 'DocMemberAttachment': () => import('../../components/Cells/DocMemberAttachment'),
    // 'DateTime': () => import('../../components/Cells/DateTime')
  },
  mixins: [BaseTemplateMixin, DataGridMixin, ActionMixin],
  props: {},
  mounted() {
    // initConnector()
    this.init()
  },
  beforeMount() {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    setDefaultFilter(){
      this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
        uid: this.store.uid,
        filter: Object.assign({parent: 0}, this.modeParams.filter)
      })
    },
    async loadChild(props) {
      await this.$store.dispatch(`${this.namespace}/child`, {
        store: this.store,
        params: this.params,
        data: this.data,
        row: props.row
      }, { root: true })
    },
    expand(props) {
      props.expand = !props.expand
      if (this.data.rows[props.row.__index].child === null) {
        this.loadChild(props)
      }
    }
  }
}
</script>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    v-if="data"
    class="q-p0-m0"
  >
    <v-data-table
      square
      flat
      dense
      hide-header
      :headers="params.columns"
      :items="data.rows"
      :item-key="params.rowKey || '_id.$oid'"
    >
    </v-data-table>
  </div>
</template>
