<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'
import { getPropValueByPath } from '../../../../helpers/baseHelper'

export default {
  name: 'CellDefault',
  mixins: [ActionMixin],
  props: {
    value: {
      type: Object,
      default: () => {
      }
    },
    field: {
      type: String
    },
    editMode: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      name2: ''
    }
  },
  computed: {
    _value () {
      return getPropValueByPath(this.value, this.field, '')
    }
  },
  methods: {
    onChange (value) {
      let data = Object.assign({}, this.value)
      let result = data
      let i, len
      for (i = 0, len = this.path.length; i < len - 1; i++) {
        if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
          result = result[this.path[i]]
        }
      }
      if (this.col.type && this.col.type === 'number') {
        result[this._name] = parseFloat(value)
      } else {
        result[this._name] = value
      }
      this.$emit('input', data)
    }
  }
}
</script>

<template>
  <span>
    <span
      v-if="editMode"
    >
      <v-text-field
        :value="_value[_name]"
        :label="col[`title_${$i18n.locale}`] || col.text "
        hide-details
        :placeholder="col.text"
        :autofocus="autofocus"
        :type="col.type||'text'"
        @input="onChange"
        @keydown.enter="emitAction({name:'UpdateRow'})"
        @keydown.escape="emitAction({name:'CancelEdit'})"
      />
    </span>
    <span
      v-else
    >
      {{_value}}
    </span>

  </span>
</template>
