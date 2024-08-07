<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from './resources/BrowserActionMixin'

export default {
    name: 'TableBrowser',
    components: {
        BrowserToolBar: () => import('./resources/ToolBar'),
        OperationsPanel: () => import('./resources/OperationsPanel'),
        RowViewer: () => import('./resources/Cells/RowViewer'),
        RowEditor: () => import('./resources/Cells/RowEditor'),
        ExtException: () => import('../Simple/ExtException')
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
      :headers="columns"
      :page="source.page"
      :items="source.rows"
      :items-per-page="source.props.itemsPerPage"
      :options.sync="options"
      :server-items-length="source.total"
      :item-key="source['keyProperty'] || '_id.$oid'"
      :show-select="showOperationsPanel"
      hide-default-header
      hide-default-footer
      :loading="source.loading"
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
          :hide-search-string="hideSearchString"
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
      <template v-slot:[`body.append`]="{updateOptions, pagination: {page},headers}">
        <tr v-if="source.has_more">
          <td
            class="pa-0"
            :colspan="headers.length + actionColumn"
          >
            <v-btn
              text
              block
              tile
              class="pa-0"
              @click="updateOptions({page: page += 1})"
            >
              Загрузить ещё
            </v-btn>

          </td>
        </tr>
      </template>

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
