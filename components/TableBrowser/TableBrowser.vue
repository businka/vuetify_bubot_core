<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import {VDataTable} from 'vuetify/labs/VDataTable'
import BrowserActionMixin from './resources/BrowserActionMixin'
import ExtException from '../Simple/ExtException'
import BrowserToolBar from './resources/ToolBar'
import OperationsPanel from './resources/OperationsPanel'
import RowViewer from './resources/Cells/RowViewer'
import RowEditor from './resources/Cells/RowEditor'

export default {
  name: 'TableBrowser',
  components: {
    VDataTable,
    ExtException,
    BrowserToolBar,
    OperationsPanel,
    RowViewer,
    RowEditor
    // Headers: () => import('./resources/Headers'),
    // FilterPanel: () => import('./resources/FilterPanel'),
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

    table {
      thead {
        tr {
          th {
            z-index: 0;
            color: red;
          }
        }
      }
    }
  }
}
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-data-table
      v-if="source"
      v-model="selected"
      density="compact"
      disable-sort
      :headers="columns"
      :height="height"
      hover
      fixed-header
      hide-default-header
      hide-default-footer
      :items="source.rows"
      :itemsPerPage=0
      :item-value="source['keyProperty'] || '_id.$oid'"
      :loading="source.loading"
      :v-model:page="source.page"
      :show-select="true"
      :server-items-length="source.total"
      class="browser"
      @update:options="options"
    >
      <template v-slot:headers="{ columns, someSelected, allSelected, selectAll}">
        <tr>
          <td :colspan="columns.length+1" class="pa-0">

            <BrowserToolBar
              :items-before-search="toolbarItemsBeforeSearch"
              :items-before-filter="toolbarItemsBeforeFilter"
              :filter-fields="filterFields"
              :filter="source.filter"
              :operations-panel-items="operationsPanelItems"
              :select-all="{selectAll, someSelected, allSelected}"
              :hide-search-string="hideSearchString"
              :show-operations-panel-btn="!hideOperationsPanel || alwaysShowOperationsPanel"
              :show-operations-panel="showOperationsPanel"
              @changeOperationPanelState="showOperationsPanel = !showOperationsPanel"
              @changeFilter="source.changeFilter($event)"
              @action="onAction"
            />
<!--            <OperationsPanel-->
<!--              :items="operationsPanelItems"-->
<!--              :select-all="{selectAll, someSelected, allSelected}"-->
<!--              @action="onAction"-->
<!--            />-->
          </td>
        </tr>
      </template>
      <!--      </template>-->
      <!--    v-slot:header="{ headers":[],"columns":[],"sortBy":[],"someSelected":false,"allSelected":true }"-->
      <!--       <template
            >
              <thead>-->
      <!--        <tr-->
      <!--          v-if="!hideOperationsPanel"-->
      <!--          v-show="showOperationsPanel"-->
      <!--        >-->
      <!--          <th-->
      <!--            class="pa-0"-->

      <!--          >-->
      <!--            <OperationsPanel-->
      <!--              :items="operationsPanelItems"-->
      <!--              @action="onAction"-->
      <!--            />-->
      <!--          </th>-->
      <!--        </tr>-->
      <!--        <tr-->
      <!--          v-if="showColumnHeaders"-->
      <!--        >-->
      <!--          &lt;!&ndash; Header !&ndash;&gt;-->
      <!--          <th-->
      <!--            v-for="col in headers"-->
      <!--            :key="col.value"-->
      <!--            :width="col.width"-->
      <!--          >-->
      <!--            {{ col[`title_${$i18n.locale}`] || col.text }}-->
      <!--          </th>-->
      <!--          <th v-if="actionColumn"></th>-->
      <!--        </tr>-->
      <!--        </thead>-->
      <!--      </template>Headers Bars !-->
            <template v-slot:bottom>
              <div v-if="source.has_more" class="text-center pt-2">
                  <v-btn
                    variant="plain"
                    @click="source.props.page += 1"
                  >
                    Загрузить ещё
                  </v-btn>
              </div>
            </template>

            <template
              v-slot:item="{ item, columns, index, isSelected, toggleSelect }"
            >
              <component
                :is="editForm.handler"
                v-if="editForm && editForm.inline && index===editForm.index"
                :columns="columns"
                :item="item"
                :index="index"
                @action="onAction"
              />
              <component
                :is="rowTemplate"
                v-else
                :columns="columns"
                :row-actions="rowActions"
                :row-actions-field="rowActionsField"
                :item="item"
                :index="index"
                :is-selected="isSelected"
                :toggle-select="toggleSelect"
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
      v-if="editForm && editForm.formVisible && editForm.handler!=='inline'"
      :formUid="editForm.formUid"
      :formVisible="editForm.formVisible"
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
