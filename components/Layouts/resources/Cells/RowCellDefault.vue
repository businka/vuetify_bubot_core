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
      {{_value[_name] }}
    </span>

  </span>
</template>
<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'

export default {
  name: 'CellDefault',
  mixins: [ActionMixin],
  props: {
    col: {
      type: Object,
      default: () => {
      }
    },
    value: {
      type: Object,
      default: () => {
      }
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
  data: function() {
    return {
      // value2: {},
      name2: ''
    }
  },
  computed: {
    path() {
      if (this.col.value)
        return this.col.value.split('.')
      else
        return []
    },
    _value() {
      let result = this.value
      let i, len
      for (i = 0, len = this.path.length; i < len - 1; i++) {
        if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
          result = result[this.path[i]]
        }
      }
      return result
    },
    _name() {
      return this.path[this.path.length - 1]
    }
  },
  methods: {
    onChange(value) {
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
