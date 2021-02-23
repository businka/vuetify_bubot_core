<script>
import { jsonClone } from '../../helpers/clone'
import ActionMixin from '../../helpers/mixinTemplate/action'


export default {
  name: 'RowViewer',
  components: {

  },
  mixins: [ActionMixin],
  props: ['headers', 'item', 'index', 'editMode', 'isSelected', 'select', 'store'],
  data: function() {
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
    init() {
      this.row = jsonClone(this.item)
    },
    actionUpdateRow() {
      this.$emit('action', { name: 'UpdateRow', data: { value: this.row, index: this.index } })
    },
    actionCancelEdit() {
      this.row = jsonClone(this.item)
      this.$emit('action', { name: 'RowActivate', data: { row: this.item, index: undefined } })
    },
    onClickRow(col) {
      console.log('edit row ')
      if (col.value === 'data-table-select') {
        return
      }
      this.$emit('action', { name: 'RowActivate', data: { row: this.item, index: this.index } })
    }
  },

}
</script>


<style lang="scss">
  .v-input--selection-controls__input {
    margin-right: 0px;
  }
</style>

<template>
  <tr

  >
    <td
      v-for="(col, i) in headers"
      :key="col.value"
      class="px-2"
      :style="`text-align:${(col.align || 'left')}; vertical-align:${(col.vAlign || 'center')}`"
      @click="onClickRow(col)"
    >
      <v-checkbox
        v-if="col.value==='data-table-select'"
        class="ma-0"
        :value="isSelected"
        dense
        hide-details
        @change="select($event)"
      />
      <component
        :is="col.template||'RowCellDefault'"
        v-model="row"
        :edit-mode="editMode"
        :autofocus="i===0"
        v-bind="col"
        @action="onAction"
      />
    </td>
  </tr>
</template>
