<template>
  <v-row>
    <v-col cols="12" class="d-flex">
      <v-text-field
        :value="_value[_name]"
        :label="field[`title_${$i18n.locale}`] || field.text "
        hide-details
        single-line
        :placeholder="field.text"
        :autofocus="autofocus"
        :type="field.type||'text'"
        @change="onChange"
        @keydown.enter="emitAction({name:'UpdateField'})"
        @keydown.escape="emitAction({name:'CancelEditField'})"
      />
        <v-text-field
          :value="_value[_name]"
          :label="field[`title_${$i18n.locale}`] || field.text "
          hide-details
          single-line
          :placeholder="field.text"
          :autofocus="autofocus"
          :type="field.type||'text'"
          @change="onChange"
          @keydown.enter="emitAction({name:'UpdateField'})"
          @keydown.escape="emitAction({name:'CancelEditField'})"
        />
      </v-col>
  </v-row>
</template>
<script>
// let reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
export default {
  props: {
    field: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    path() {
      if (this.field && this.field.value)
        return this.field.value.split('.')
      else
        return []
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
      for (i = 0, len = this.path.length; i < len - 1; i++) {
        if (result.hasOwnProperty(this.path[i])) {
          result = result[this.path[i]]
        }
      }
      if (this.field.type && this.field.type === 'number') {
        result[this._name] = parseFloat(value)
      } else {
        result[this._name] = value
      }
      this.$emit('input', data)
    }
  },
}
</script>
