<script>
import {jsonClone} from '@/Helpers/clone'
import ActionMixin from '@/BubotCore/helpers/mixinTemplate/action'
import {updateObject} from '@/Helpers/BaseHelper'
import {defineAsyncComponent} from "vue"


export default {
  name: 'RowViewer',
  components: {
    'RowCellActions': defineAsyncComponent(() => import('./RowCellActions')),
    'RowCellTitle': defineAsyncComponent(() => import('./RowCellTitle')),
    'RowCellIcon': defineAsyncComponent(() => import('./RowCellIcon')),
    'RowCellTitleSimple': defineAsyncComponent(() => import('./RowCellTitleSimple')),
    'RowCellDateTime': defineAsyncComponent(() => import('./RowCellDateTime')),
    'RowCellDefault': defineAsyncComponent(() => import('./RowCellDefault')),
    'RowColorProgress': defineAsyncComponent(() => import('./RowColorProgress')),
  },
  mixins: [ActionMixin],
  props: ['columns', 'item', 'index', 'editMode', 'isSelected', 'toggleSelect', 'store', 'rowActions', 'rowActionsField'],
  data: function () {
    return {
      row: {},
      selectable: undefined
    }
  },
  watch: {
    item() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function () {
      // this.row = jsonClone(this.item)
      this.row = this.item.raw
      this.selectable = this.item.selectable
    },
    actionSelectItems(actionData) {
      const data = updateObject({items: [this.item]}, actionData)
      this.emitAction('SelectItems', data)
    },
    actionCallDataSourceForSelectedItems: function (actionData) {
      const data = updateObject({data: {items: [this.item]}}, actionData)
      this.emitAction('CallDataSourceForSelectedItems', data)
    },
    actionUpdateRow: function () {
      this.$emit('action', {name: 'UpdateRow', data: {value: this.row, index: this.index}})
    },
    actionCancelEdit: function () {
      this.row = jsonClone(this.item)
      this.$emit('action', {name: 'RowActivate', data: {row: this.item, index: undefined}})
    },
    onClickRow: function (col) {
      console.log('RowActivate')
      if (col.key === 'data-table-select') {
        return
      }
      this.$emit('action', {name: 'RowActivate', data: {row: this.row, index: this.index}})
    },
    getTdStyle: function (col) {
      let style = `text-align:${(col.align || 'left')}; vertical-align:${(col.vAlign || 'middle')};`;
      if (col.key === 'data-table-select') {
        style += 'min-width:40px;'
      } else {
        style += `width:${col.width};`
      }
      if (col['min-width']) {
        style += `min-width:${col['min-width']};`
      }
      return style
    }
  }
}
</script>

<template>
  <tr>
    <td
      v-for="(col, i) in columns"
      :key="col.key"
      class="px-2 truncate"
      :style="getTdStyle(col)"
      @click="onClickRow(col)"
    >
      {{ col.value }}
      <v-checkbox
        v-if="col.key==='data-table-select'"
        class="pl-0 pr-2 data-table-select"
        density="compact"
        hide-details
        :model-value="isSelected(item)"
        @update:modelValue="toggleSelect(item)"
      />
      <component
        v-else
        :is="col.template||'RowCellDefault'"
        v-model="row"
        :edit-mode="editMode"
        :autofocus="i===0"
        :field="col.key"
        v-bind="col"
        @action="onAction"
      />
    </td>
    <!--    <v-container-->
    <!--      v-if="rowActions || rowActionsField"-->
    <!--      class="pa-0"-->
    <!--    >-->
    <!--      <RowCellActions-->
    <!--        :actions="rowActions"-->
    <!--        :field="rowActionsField"-->
    <!--        :value="row"-->
    <!--        @action="onAction"-->
    <!--      />-->
    <!--    </v-container>-->
  </tr>
</template>

<style lang="scss">
.v-input--selection-controls__input {
  margin-right: 0;
}

.data-table-select {
  .mdi-checkbox-blank-outline {
    display: none;
  }
}

tr:hover .data-table-select {
  .mdi-checkbox-blank-outline {

    display: block;
  }
}

.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
