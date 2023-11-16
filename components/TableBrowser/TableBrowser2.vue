<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from './resources/BrowserActionMixin'
import {defineAsyncComponent} from "vue"

export default {
    name: 'TableBrowser',
    components: {
        BrowserToolBar: defineAsyncComponent(() => import('./resources/ToolBar')),
        OperationsPanel: defineAsyncComponent(() => import('./resources/OperationsPanel')),
        RowViewer: defineAsyncComponent(() => import('./resources/Cells/RowViewer')),
        RowEditor: defineAsyncComponent(() => import('./resources/Cells/RowEditor')),
        ExtException: defineAsyncComponent(() => import('../Simple/ExtException'))
        // Headers: defineAsyncComponent(() => import('./resources/Headers')),
        // FilterPanel: defineAsyncComponent(() => import('./resources/FilterPanel')),
    },
    mixins: [ActionMixin, BrowserActionMixin],
    props: {
        hideOperationsPanel: {
            type: Boolean,
            default: false
        },
        alwaysShowOperationsPanel: {
            type: Boolean,
            default: false
        },
        operationsPanelItems: {
            type: Array,
            default: function () {
                return []
            }
        },
        rowActions: {
            type: Array,
            default: function () {
                return []
            }
        },
        rowActionsField: {
            type: String,
            default: 'rowViewer'
        },
        rowActivateHandler: {
            type: Object,
            default: function () {
                return {
                    name: '',
                }
            }
        },
        externalRowActivateHandler: {
            type: Function
        },
        toolbarItemsBeforeSearch: {
            type: Array,
            default: function () {
                return []
            }
        },
        toolbarItemsBeforeFilter: {
            type: Array,
            default: function () {
                return []
            }
        },
        filterFields: {
            type: Array,
            default: function () {
                return []
            }
        },
        filterConst: {
            type: Object,
            default: function () {
                return {}
            }
        },
        hideSelectAll: {
            type: Boolean,
            default: false
        },
        hideToolbar: {
            type: Boolean,
            default: false
        },
        hideSearchString: {
            type: Boolean,
            default: false
        },
        showColumnHeaders: {
            type: Boolean,
            default: false
        },
        rowTemplate: {
            type: String,
            default: 'rowViewer'
        },
        dataSource: {
            type: Object,
            default: function () {
                return {}
            }
        },
        columns: {
            type: Array,
            default: function () {
                return []
            }
        },
        height: {type: String}
    },
    computed: {
        actionColumn() {
            return this.rowActions || this.rowActionsField ? 1 : 0
        }
    },
    watch: {
        dataSource: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch dataSource needUpdate ${this.needUpdate}`)
            if (this.options) {
                this.options.page = 1
            }
            this.init()
            this.needUpdate = true
        },
        filterConst: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch filterConst 2, needUpdate ${this.needUpdate} `)
            this.needUpdate = true
            this.source.changeProps({filterConst: this.filterConst})
        },
        options: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch options ${JSON.stringify(this.options)}`)
            this.source.changeProps(this.options)
            this.needUpdate = true
        },
        needUpdate: async function (value) {
            // await this.$nextTick()
            // console.log(`needUpdate ${value}`)
            if (value) {
                this.needUpdate = false
                await this.source.fetchRows()
            }
        }
    },
    beforeMount() {
        this.init()
    },
    methods: {}
}
</script>

<style lang="scss">
  .height100 {
    height: 100%;
  }

  .browser {
    /*height: 100%;*/
    border-radius: 0;
    .v-data-table__wrapper {
      height: calc(100vh - 180px);
    }
  }
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-data-table
      v-if="source"
      v-model="selected"
      :headers="columns"
      :page="source.page"
      :items="source.rows"
      :options.sync="options"
      :server-items-length="source.total"
      :item-key="source['keyProperty'] || '_id.$oid'"
      :show-select="showOperationsPanel"
      :hide-default-header="true"
      :loading="source.loading"
      :footer-props="{
        itemsPerPageOptions: [25, 50, 100, -1],
        showCurrentPage: true,
      }"
      dense
      disable-sort
      fixed-header
      class="browser"
      :height="height"
    >
      <template v-slot:top>
        <BrowserToolBar
          v-if="!hideToolbar"
          :items-before-search="toolbarItemsBeforeSearch"
          :items-before-filter="toolbarItemsBeforeFilter"
          :filter-fields="filterFields"
          :filter="source.filter"
          :show-operations-panel-btn="!hideOperationsPanel || alwaysShowOperationsPanel"
          :show-operations-panel="showOperationsPanel"
          @changeOperationPanelState="showOperationsPanel = !showOperationsPanel"
          @changeFilter="source.changeFilter($event)"
          @action="onAction"
        />
      </template>
      <!--    v-slot:header="{ props: { headers, options },someItems, everyItem, on }"-->
      <template
        v-slot:header="{ props: { someItems, everyItem, headers},  on }"
      >
        <thead>
        <tr
          v-if="!hideOperationsPanel"
          v-show="showOperationsPanel"
        >
          <th
            class="pa-0"
            :colspan="headers.length + actionColumn"
          >
            <OperationsPanel
              :items="operationsPanelItems"
              :select-all="{
                  someItems,
                  everyItem,
                  toggleSelectAll: on['toggle-select-all']
                }"
              @action="onAction"
            />
          </th>
        </tr>
        <tr
          v-if="showColumnHeaders"
        >
          <!-- Header !-->
          <th
            v-for="col in headers"
            :key="col.value"
            :width="col.width"
          >
            {{ col[`title_${$i18n.locale}`] || col.text }}
          </th>
          <th v-if="actionColumn"></th>
        </tr>
        </thead>
      </template> <!-- Headers Bars !-->
      <template
        v-slot:item="{ item, headers, index, isSelected, select }"
      >
        <component
          :is="editForm.handler"
          v-if="editForm && editForm.inline && index===editForm.index"
          :headers="headers"
          :item="item"
          :index="index"
          @action="onAction"
        />
        <component
          :is="rowTemplate"
          v-else
          :headers="headers"
          :row-actions="rowActions"
          :row-actions-field="rowActionsField"
          :item="item"
          :index="index"
          :is-selected="isSelected"
          :select="select"
          :edit-mode="editForm && editForm.handler==='inline' && index===editForm.formData.index"
          @action="onAction"
        />
      </template> <!-- item !-->

      <template
        v-slot:no-data=""
      >
        <v-container
          v-if="source.error"
          class="error--text"
        >
          {{ source.error.message }}
          <span v-if="source.error.detail">: {{ source.error.detail }}</span>
        </v-container>
        <v-container
          v-else
        >
          {{ $t('$vuetify.noDataText') }}
        </v-container>
      </template>  <!-- No data!-->
    </v-data-table>
    <component
      :is="editForm.handler"
      v-if="editForm && editForm.visible && editForm.handler!=='inline'"
      :formUid="editForm.formUid"
      :visible="editForm.visible"
      :formData="editForm.formData"
      @action="onAction($event, 'editForm')"
    />
    <component
      :is="actionForm.handler"
      v-if="actionForm && actionForm.visible"
      v-bind="actionForm"
      @action="onAction($event, 'actionForm')"
    />
    <ExtException
      v-if="actionError"
      v-model="actionError"
      :dialog="true"
    ></ExtException>
  </v-container>
</template>
