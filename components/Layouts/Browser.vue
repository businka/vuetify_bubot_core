<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from './resources/BrowserActionMixin'

export default {
  name: 'Browser',
  components: {
    BrowserToolBar: () => import('./resources/ToolBar'),
    OperationsPanel: () => import('./resources/OperationsPanel'),
    RowViewer: () => import('./resources/Cells/RowViewer'),
    RowEditor: () => import('./resources/Cells/RowEditor')
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
    rowActivateHandler: {
      type: Object,
      default: function () {
        return {
          name: '',
          form: ''
        }
      }
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
    }
  },
  data () {
    return {
      singleSelect: false,
      showOperationsPanel: this.alwaysShowOperationsPanel,
      selected: [],
      loading: true,
      source: undefined,
      options: undefined,
      editForm: {},
      actionForm: {}
    }
  },
  watch: {
    dataSource () {
      if (this.options) {
        this.options.page = 1
      }
      this.init()
      if (this.options) {
        this.source.query()
      }
    },
    options() {
      this.source.changeProps(this.options)
      this.source.query()
    },
  },
  beforeMount () {
    this.init()
  },
  methods: {}
}
</script>

<style scoped>
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
      :item-key="dataSource['keyProperty'] || '_id.$oid'"
      :show-select="showOperationsPanel"
      :hide-default-header="true"
      :loading="source.loading"
      :footer-props="{
        itemsPerPageOptions: [25, 50, 100, -1],
        showCurrentPage: true,
      }"
      dense
      disable-sort
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
              :colspan="headers.length"
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
          </tr>
        </thead>
      </template> <!-- Headers Bars !-->
      <template
        v-slot:item="{ item, headers, index, isSelected, select }"
      >
        <component
          :is="editForm.params.template"
          v-if="editForm && editForm.handler==='inline' && index===editForm.index"
          :headers="headers"
          :item="item"
          :index="index"
          @action="onAction"
        />
        <component
          :is="rowTemplate"
          v-else
          :headers="headers"
          :item="item"
          :index="index"
          :is-selected="isSelected"
          :select="select"
          :edit-mode="editForm && editForm.handler==='inline' && index===editForm.index"
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
          {{ `${source.error.message}: ${source.error.detail}` }}
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
      v-bind="editForm"
      @action="onAction"
    />
    <component
      :is="actionForm.handler"
      v-if="actionForm && actionForm.visible"
      :params="actionForm"
      @action="onAction"
    />
  </v-container>
</template>
