<script>

export default {
  name: 'TableBrowserTemplate',
  emits: ['update:selected', 'update:active'],
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
    <slot name="external"/>
    <component
        :is="editForm.template"
        v-if="editForm && editForm.visible && editForm.handler !== 'inline'"
        :formUid="editForm.formUid"
        :visible="editForm.visible"
        :formData="editForm.formData"
        @action="onAction($event, 'editForm')"
    />

    <component
        :is="actionForm.template"
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
  //overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}

//.browser-table {
//  flex: 1 1 auto;
//  min-height: 0;
//  width: 100%;
//
//  :deep(.v-table) {
//    height: 100% !important;
//  }
//
//  :deep(.v-table__wrapper) {
//    height: calc(100% - 48px) !important;
//    max-height: none !important;
//    overflow: auto !important;
//  }
//
//  .toolbar-cell {
//    padding: 0 !important;
//    border-bottom: 1px solid #e0e0e0;
//  }
//}

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