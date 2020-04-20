<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import storage from './store'
import ActionMixin from '@/helpers/mixinTemplate/action'
// import DataGridMixin from '../DataGrid/DataGrid.mixin'
import axios from 'axios'

export default {
  name: 'Tree',
  mixins: [BaseTemplateMixin, ActionMixin],
  data: function() {
    return {
      editRow: null,
      massOperationVisible: true,
      items: []
    }
  },
  computed: {
  },
  mounted() {
    this.init()
    this.fetch(null)
  },
  beforeMount() {
    if (!this.$store.state.hasOwnProperty(this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    actionMassOperationsBarVisible(action) {
      this.$store.commit(
        `${this.store.namespace}/massOperationsBarVisible`, {
          uid: this.store.uid,
          value: action
        })
    },
    getSelected() {
      return this.$refs[this.store.uid].selection
    },
    async actionMassDelete() {
      const selected = this.getSelected()
      for (let elem in selected) {
        if (selected.hasOwnProperty(elem)){
          await this.$store.dispatch(`${this.namespace}/delete`, {
            store: this.store,
            params: this.params,
            data: elem
          }, { root: true })
        }
      }
      await this.query()

    },
    async fetch(item){
      let filter = {}
      let result
      if (item) {
        filter.parent_id = item._id
        result = item.children
      } else {
        filter.parent_id = null
        result = this.items
      }
      const res = await axios.post(`/api/${this.store.mode.objType}/${this.store.mode.objName}/query`, {
        filter: filter
      })
      let index, len;
      for (index = 0, len = res.data.result.rows.length; index < len; ++index) {
        let item = res.data.result.rows[index]
        item.children = []
        result.push(item)
      }
    },
    async actionCreate(data) {
      await this.$store.dispatch(`${this.namespace}/create`, {
        store: this.store,
        params: this.params,
        data
      }, { root: true })
      await this.query()

    },
    async actionUpdateRow(data) {
      console.log('update row ' + data.index)
      this.editRow = null
      await this.$store.dispatch(`${this.namespace}/updateRow`, {
        store: this.store,
        params: this.params,
        data: data
      }, { root: true })
      await this.query()

    }
  }

}
</script>

<style lang="scss">
  .v-toolbar__content {
    padding-left: 0;
  }

  .jay-space-right {
    margin-right: 8px;
  }

  .bordered {
    border-bottom: 1px solid var(--v-delimiter-base);
  }
</style>

<template>
  <v-row
    v-if="data"
    class="pa-0 ma-0"
  >
    <v-col
      class="pa-0 ma-0"
      :xl="params.xl || '7'"
      :lg="params.xl || '9'"
      :sm="params.xl || '12'"
      :xs="params.xl || '12'"
    >
      <v-treeview
        :items="items"
        :dense="true"
        :selectable="massOperationVisible"
        :load-children="fetch"
        item-key="_id.$oid"
        item-text="title"
        :activatable="true"
        :hoverable="true"
        :open-on-click="false"
      ></v-treeview>
    </v-col>
    <RightDrawerFormViewer
      v-if="data.editForm && data.editForm.visible && data.editForm.handler==='RightDrawerFormViewer'"
      name="editForm"
      :params="data.editForm"
      @action="emitAction"
    />
  </v-row>
</template>