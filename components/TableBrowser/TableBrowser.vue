<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from './resources/BrowserActionMixin'
import ExtException from '../Simple/ExtException'
import BrowserToolBar from './resources/ToolBar'
import OperationsPanel from './resources/OperationsPanel'
import RowViewer from './resources/Cells/RowViewer'
import RowEditor from './resources/Cells/RowEditor'
import {isEmptyObject} from "bubot-helper/BaseHelper";
import {findInArrayObj, findIndexInArrayObj} from "bubot-helper/ArrayHelper";

export default {
  name: 'TableBrowser',
  components: {
    ExtException,
    BrowserToolBar,
    OperationsPanel,
    RowViewer,
    RowEditor
  },
  mixins: [ActionMixin, BrowserActionMixin],
  emits: ['update:selected', 'update:active'],
  props: {
    height: {
      type: String,
      default: '100%'
    },
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
      default: () => []
    },
    rowActions: {
      type: Array,
      default: () => []
    },
    rowActionsField: {
      type: String,
      default: 'rowViewer'
    },
    rowActivateHandler: {
      type: Object,
      default: () => ({name: ''})
    },
    externalRowActivateHandler: {
      type: Function
    },
    toolbar: {
      type: Array,
      default: () => []
    },
    filterFields: {
      type: Array,
      default: () => []
    },
    filterConst: {
      type: Object,
      default: () => ({})
    },
    hideSelectAll: {
      type: Boolean,
      default: false
    },
    hideToolbar: {
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
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    active: {
      type: Object,
    },
    selected: {
      type: Array,
      default: () => []
    },
    autoActivate: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      dataTableHeight: 0,
    }
  },

  computed: {
    actionColumn() {
      return this.rowActions || this.rowActionsField ? 1 : 0
    }
  },

  watch: {
    dataSource: function () {
      if (this.options) {
        this.options.page = 1
      }
      this.init()
    },
    filterConst: function (filterConst) {
      // console.log(`Browser  ${this.dataSource.objName} watch filterConst, needUpdate ${this.needUpdate} `)
      this.source.changeProps({
        page: 1,
        filterConst
      })
      // console.log(`Browser  ${this.dataSource.objName} watch filterConst needUpdate set true`)
      this.needUpdate = true
    },
    options: function (options) {
      this.source.changeProps(options)
      // console.log(`Browser  ${this.dataSource.objName} watch options needUpdate set true`)
      this.needUpdate = true
    },
    needUpdate: async function (value) {
      // console.log(`needUpdate ${value}`)
      if (value) {
        await this.source.fetchRows()
        this.autoActivateRow()
      }
      this.needUpdate = false
      // console.log(`needUpdate end ${this.needUpdate}`)
    }
  },

  beforeMount() {
    this.init()
  },

  methods: {
    updateDataTableHeight() {
      this.dataTableHeight = this.$refs.parentDiv?.clientHeight || 0;
    }
  }
}
</script>
<template>
  <div class="table-browser-grid">
    <v-data-table
        v-if="source"
        v-model="internalSelected"
        density="compact"
        disable-sort
        :headers="columns"
        :height="height"
        hover
        fixed-header
        :hide-default-header="hideToolbar"
        hide-default-footer
        :return-object="true"
        :items="source.rows"
        :itemsPerPage="0"
        :item-value="source['keyProperty']"
        loading-text=""
        :loading="source.loading"
        :v-model:page="source.page"
        :show-select="true"
        :server-items-length="source.total"
        class="browser-table"
        @update:options="onOptionsUpdate"
    >
      <template v-slot:headers="{ columns, someSelected, allSelected, selectAll}">
        <tr>
          <td :colspan="columns.length + 1" class="pa-0 toolbar-cell">
            <BrowserToolBar
                :items="toolbar"
                :filter-fields="filterFields"
                :filter="source.filter"
                :operations-panel-items="operationsPanelItems"
                :select-all="{selectAll, someSelected, allSelected}"
                :show-operations-panel-btn="!hideOperationsPanel || alwaysShowOperationsPanel"
                :show-operations-panel="showOperationsPanel"
                @changeOperationPanelState="showOperationsPanel = !showOperationsPanel"
                @changeFilter="source.changeFilter($event)"
                @action="onAction"
            />
          </td>
        </tr>
      </template>

      <template v-slot:bottom></template>

      <template v-slot:body.append="{ columns}">
        <tr v-if="source.has_more">
          <td :colspan="columns.length + 1" class="pa-0 text-center">
            <v-progress-circular
                v-if="source.loading"
                indeterminate
            />
            <v-btn
                v-else
                variant="plain"
                @click="source.nextPage()"
            >
              Загрузить ещё
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:item="{ item, columns, index, isSelected, toggleSelect }">
        <component
            :is="editForm.handler"
            v-if="editForm && editForm.inline && index === editForm.index"
            :columns="columns"
            :item="item"
            :items="source.rows"
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
            :items="source.rows"
            :index="index"
            :key-property="source['keyProperty']"
            :is-selected="isSelected"
            :toggle-select="toggleSelect"
            :active="active && active[source['keyProperty']]===item[source['keyProperty']]"
            :edit-mode="editForm && editForm.handler === 'inline' && index === editForm.formData.index"
            @action="onAction"
        />
      </template>

      <template v-slot:no-data>
        <div class="no-data">
          <div v-if="source.error" class="error--text">
            {{ source.error.message }}
            <span v-if="source.error.detail">: {{ source.error.detail }}</span>
          </div>
          <div v-else>
            {{ $t('$vuetify.noDataText') }}
          </div>
        </div>
      </template>
    </v-data-table>

    <component
        :is="editForm.handler"
        v-if="editForm && editForm.formVisible && editForm.handler !== 'inline'"
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
    />
  </div>
</template>


<style lang="scss" scoped>
.table-browser-grid {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}

.browser-table {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;

  :deep(.v-table) {
    height: 100% !important;
  }

  :deep(.v-table__wrapper) {
    height: calc(100% - 48px) !important;
    max-height: none !important;
    overflow: auto !important;
  }

  .toolbar-cell {
    padding: 0 !important;
    border-bottom: 1px solid #e0e0e0;
  }
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
  color: rgba(0, 0, 0, 0.6);
}

.height100 {
  height: 100%;
}
</style>