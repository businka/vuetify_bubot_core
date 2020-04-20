<script>
import ActionMixin from '@/helpers/mixinTemplate/action'

export default {
  name: 'CellSelect',
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
      return this.col.value.split('.')
    },
    _value() {
      let result = this.value
      let i, len
      for (i = 0, len = this.path.length; i < len - 1; i++) {
        if (result.hasOwnProperty(this.path[i])) {
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
      for (i = 0, len=this.path.length; i < len-1; i++) {
        if (result.hasOwnProperty(this.path[i])) {
          result = result[this.path[i]]
        }
      }
      result[this._name] = value.value
      this.$emit('input', data)
    }
  }}
</script>
<template>
  <span>
    <span
      v-if="editMode"
    >
      <v-select
        :label="col[`title_${$i18n.locale}`] || col.text "
        :items="col.enum"
        :item-text="`title_${$i18n.locale}`"
        item-value="value"
        return-object
        :single-line="false"
        :dense="false"
        hide-details
        :autofocus="autofocus"
        :value="_value[_name]"
        @keydown.enter="emitAction({name:'UpdateRow'})"
        @keydown.escape="emitAction({name:'CancelEdit'})"
        @change="onChange"
      />
    </span>
    <span
      v-else
    >
      {{ _value[_name] }}
    </span>

  </span>
</template>
