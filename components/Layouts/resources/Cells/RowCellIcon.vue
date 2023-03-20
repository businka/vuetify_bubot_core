<script>
import RowCellMixin from './RowCell.mixin'

export default {
    name: 'CellIcon',
    mixins: [RowCellMixin],
    props: {
        icons: {
            type: Object,
        },
    },

  computed: {
    icon () {
      let _res = {
        name:'',
        color:''
      }
      let _value = ''
      switch(this._value) {
        case null:
          _value = 'null'
          break
        case undefined:
          _value = 'undefined'
          break
        default:
          _value = this._value.toString()
      }
      if (this.icons && _value) {
        if (this.icons[_value]) {
          _res.name = this.icons[_value].name || ''
          _res.color = this.icons[_value].color || ''
        } else if (this.icons._other) {
            _res.name = this.icons._other.name || ''
            _res.color = this.icons._other.color || ''
        }
      } else {
        _res.name = _value
      }
      return _res
    },
  },
}
</script>
<template>
  <span>
    <span
        v-if="editMode"
    >
      <v-text-field
          v-model="value[col.value]"
          :label="col.text"
          hide-details
          :placeholder="col.text"
          :autofocus="autofocus"
          @keydown.enter="emitAction({name:'UpdateRow'})"
          @keydown.escape="emitAction({name:'CancelEdit'})"
      />
    </span>
    <span
        v-else
    >
      <v-icon
          :color="icon.color"
          :title="_value"
      >
      {{ icon.name }}
      </v-icon>

    </span>

  </span>
</template>