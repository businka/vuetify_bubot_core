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
      <v-icon>
      {{ icon }}
      </v-icon>

    </span>

  </span>
</template>
<script>
import ActionMixin from '@/helpers/mixinTemplate/action'

export default {
  name: 'CellIcon',
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
  computed: {
    _value() {
      return this.col.value.split('.').reduce(
        (ob, key) => {
          try {
            return ob[key] || ""
          } catch (e) {
            return ""
          }
        }, this.value)
    },
    icon() {
      return this._value ? this.col.items[this._value] || this.col.items['default'] : null
    }
  }
}
</script>
