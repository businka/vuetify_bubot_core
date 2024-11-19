<script>
import RowCellMixin from './RowCell.mixin'

export default {
  name: 'CellDefault',
  mixins: [RowCellMixin]
}
</script>

<template>
  <span>
    <span
      v-if="editMode"
    >
      <v-text-field
        :value="_value"
        :label="title"
        hide-details
        :placeholder="title"
        :autofocus="autofocus"
        :type="type"
        @input="onChange"
        @keydown.enter="emitAction({name:'UpdateRow'})"
        @keydown.escape="emitAction({name:'CancelEdit'})"
      />
    </span>
    <span
      v-else
      :title="_value"
    >
      {{ _value }}
    </span>

  </span>
</template>

<style lang="scss">
</style>
