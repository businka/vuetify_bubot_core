<script>
import {jsonClone} from '../../../../../Helpers/clone'
import ActionMixin from '../../../../helpers/mixinTemplate/action'
import {updateObject} from '../../../../../Helpers/BaseHelper'


export default {
    name: 'RowViewer',
    components: {
        'RowCellActions': () => import('./RowCellActions'),
        'RowCellTitle': () => import('./RowCellTitle'),
        'RowCellIcon': () => import('./RowCellIcon'),
        'RowCellTitleSimple': () => import('./RowCellTitleSimple'),
        'RowCellDateTime': () => import('./RowCellDateTime'),
        'RowCellDefault': () => import('./RowCellDefault'),
        'RowColorProgress': () => import('./RowColorProgress'),
    },
    mixins: [ActionMixin],
    props: ['headers', 'item', 'index', 'editMode', 'isSelected', 'select', 'store', 'rowActions', 'rowActionsField'],
    data: function () {
        return {
            row: {}
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
        init: function() {
            // this.row = jsonClone(this.item)
            this.row = this.item
        },
        actionSelectItems(actionData) {
            const data = updateObject({items: [this.item]}, actionData)
            this.emitAction('SelectItems', data)
        },
        actionCallDataSourceForSelectedItems: function(actionData) {
            const data = updateObject({data: {items: [this.item]}}, actionData)
            this.emitAction('CallDataSourceForSelectedItems', data)
        },
        actionUpdateRow: function() {
            this.$emit('action', {name: 'UpdateRow', data: {value: this.row, index: this.index}})
        },
        actionCancelEdit: function() {
            this.row = jsonClone(this.item)
            this.$emit('action', {name: 'RowActivate', data: {row: this.item, index: undefined}})
        },
        onClickRow: function(col) {
            console.log('RowActivate')
            if (col.value === 'data-table-select') {
                return
            }
            this.$emit('action', {name: 'RowActivate', data: {row: this.row, index: this.index}})
        },
        getTdStyle: function(col) {
            let style = `text-align:${(col.align || 'left')}; vertical-align:${(col.vAlign || 'middle')};`;
            if (col.value === 'data-table-select') {
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
      v-for="(col, i) in headers"
      :key="col.value"
      class="px-2 truncate"
      :style="getTdStyle(col)"
      @click="onClickRow(col)"
    >
      <v-checkbox
        v-if="col.value==='data-table-select'"
        class="ma-0 data-table-select"
        :value="isSelected"
        dense
        hide-details
        @change="select($event)"
      />
      <component
        v-else
        :is="col.template||'RowCellDefault'"
        v-model="row"
        :edit-mode="editMode"
        :autofocus="i===0"
        v-bind="col"
        @action="onAction"
      />
    </td>
    <td
      v-if="rowActions || rowActionsField"
      class="pa-0"
    >
      <RowCellActions
        :actions="rowActions"
        :field="rowActionsField"
        :value="row"
        @action="onAction"
      />
    </td>
  </tr>
</template>

<style lang="scss">
  .v-input--selection-controls__input {
    margin-right: 0;
  }

  .data-table-select {
    padding-top: 0px;
  }

  .truncate {
    max-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
