<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import DataGridMixin from './DataGrid.mixin'
import storage from './store'
import ActionMixin from '@/helpers/mixinTemplate/action'
import { ObjectId } from 'bson'

export default {
  name: 'DataGrid',
  components: {
    'RowViewer': () => import('../Cells/RowViewer'),
    'RowEditor': () => import('../Cells/RowEditor')
  },
  mixins: [BaseTemplateMixin, DataGridMixin, ActionMixin],
  data: function() {
    return {
      actionForm: {},
    }
  },
  computed: {
    columns: function() {
      if (!this.params.columns)
        return {}
      let res = this.params.columns
      if (this.data.editForm){
        res[0].params = this.data.editForm.params
        res[0].store = this.store
      }
      return res
    }
  },
  mounted() {
    this.init()
  },
  beforeMount() {
    if (!this.$store.state.hasOwnProperty(this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    actionShowSelectForm (data) {
      this.actionForm = data
    },
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
        if (selected.hasOwnProperty(elem)) {
          const index = this.data.rows.indexOf(selected[elem])
          // const index = this.getIndexRowByOid(selected[elem]._id['$oid'])
          await this.$store.dispatch(`${this.namespace}/delete`, {
            store: this.store,
            params: this.params,
            value: selected[elem],
            index

          }, { root: true })
        }
      }
      await this.query()

    },
    async actionAdd(data) {
      if (!data && !this.params.rowKey) {
        data = { _id: { '$oid': ObjectId.createPk().toString() } }
      }
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
    border-bottom: 1px solid #cccccc;
  }
</style>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row
    v-if="data"
    class="pa-0 ma-0"
  >
    <v-col
      class="pa-0 ma-0"
      :xl="params.col_xl || '12'"
      :lg="params.col_lg || '12'"
      :sm="params.col_sm || '12'"
      :xs="params.col_xs || '12'"
    >
      <v-data-table
        :ref="store.uid"
        :headers="columns"
        :items="data.rows"
        :item-key="params.rowKey || '_id.$oid'"
        :show-select="data.massOperationsBarVisible || params.selectAll"
        :hide-default-header="true"
        :loading="data.loading"
        dense
        disable-sort
        :options="{ components: params.components, data, store}"
      >
        <template
          v-slot:header="{ props: { headers, options },someItems, everyItem, on }"
        >
          <thead>
            <tr
              v-if="options.data.toolBar"
            >
              <th
                class="pa-0"
                :colspan="headers.length"
              >
                <component
                  :is="options.components.toolBar.template"
                  class="px-2"
                  :params="options.components.toolBar"
                  :store="options.data"
                  @action="emitAction"
                />
              </th>
            </tr> <!-- ToolBar !-->
            <tr
              v-if="options.data.massOperationsBar && options.data.massOperationsBarVisible"
            >
              <th
                class="pa-0"
                :colspan="headers.length"
              >
                <MassOperationsBar
                  class="px-2"
                  :params="options.components.massOperationsBar"
                  :select-all="{
                    someItems,
                    everyItem,
                    select: on['toggle-select-all']
                  }"
                  :store="options.store"
                  @action="emitAction"
                />
              </th>
            </tr> <!-- MassOperationsBar !-->
            <tr
              v-if="options.components.filterBar"
            >
              <th
                class="pa-0"
                :colspan="headers.length"
              >
                <component
                  :is="options.components.filterBar.template"
                  class="pl-2"
                  :filter="options.data.filter"
                  :params="options.components.filterBar"
                  :store="headers[0].store"
                  @action="emitAction"
                />
              </th>
            </tr> <!-- FilterBar !-->
            <tr
              v-if="!params.header"
            >
              <!-- Header !-->
              <th
                v-for="col in headers"
                :key="col.value"
                :width="col.width"
              >
                {{ col[`title_${$i18n.locale}`] || col.text }}
              </th>
            </tr>
          </thead>
        </template> <!-- Bars !-->

        <template
          v-slot:item="{ item, headers, index, isSelected, select }"
        >
          <component
            :is="data.editForm.params.template"
            v-if="data.editForm && data.editForm.handler==='inline' && index===data.editForm.index"
            :headers="headers"
            :item="item"
            :index="index"
            :params="headers[0].params"
            :store="headers[0].store"
            @action="emitAction"
          />
          <component
            :is="params.rowTemplate"
            v-else
            :headers="headers"
            :item="item"
            :index="index"
            :is-selected="isSelected"
            :select="select"
            :edit-mode="data.editForm && data.editForm.handler==='inline' && index===data.editForm.index"
            :params="headers[0].params"
            :store="headers[0].store"
            @action="emitAction"
          />
        </template>

        <template
          v-slot:no-data=""
        >
          <v-container
            v-if="data.error"
          >
            {{ data.error.msg }}
          </v-container>
          <v-container
            v-else
          >
            {{ $t('$vuetify.noDataText') }}
          </v-container>
        </template>
      </v-data-table>
    </v-col>
    <component
      :is="data.editForm.handler"
      v-if="data.editForm && data.editForm.visible && data.editForm.handler!=='inline'"
      :params="data.editForm"
      @action="emitAction"
    />
    <component
      :is="data.actionForm.handler"
      v-if="data.actionForm && data.actionForm.visible"
      :params="data.actionForm"
      @action="emitAction"
    />


    <component
      :is="actionForm.handler || 'RightDrawerFormViewer'"
      v-if="actionForm && actionForm.visible"
      :params="{form: actionForm.form, visible:actionForm.visible}"
      @action="actionForm.action"
    />
  </v-row>
</template>