<template>
  <span>
    <span
      v-if="editMode"
    >
      <v-text-field
        v-model="_value[_name]"
        :label="col[`title_${$i18n.locale}`] || col.text "
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
      {{_value[_name] }}
    </span>

  </span>
</template>
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

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
    path(){
      return this.col.value.split('.')
    },
    _value() {
      let result = this.value
      let i, len
      for (i = 0, len=this.path.length; i < len - 1; i++) {
        if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
          result = result[this.path[i]]
        }
      }
      return result
    },
    _name(){
      return this.path[this.path.length - 1]
    }
  }

}
</script>
