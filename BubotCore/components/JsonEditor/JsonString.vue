<script>
// import Vue from 'vue'
import {getPropByPath} from './JsonHelper'

export default {
  name: 'JsonString',
  props: {
    schema: Object,
    elemValue: {},
    elemName: String,
    path: String,
    arrayElem: Boolean,
    level: Number,
    readOnly: {
      type: Boolean,
      default: undefined

    },
    hideReadOnly: Boolean,
    variant: {
      type: String,
      default: 'underlined'
    },
    density: {
      type: String,
      default: 'compact'
    },
    singleLine: Boolean,
    byPath: Boolean,
    type: {
      type: String,
      default: 'text'
    }
  },
  data: function () {
    return {
      value: this.elemValue,
    }
  },
  watch: {
    elemValue: function (value) {
      if (this.byPath) {
        this.value = getPropByPath(value, this.path)
      } else {
        this.value = value
      }
      if (value === undefined && this.schema.default) {
        this.onChange(this.value)
      }
    }
  },
  methods: {
    onChange(value) {
      // console.log('oc2' + this.path + '-' + JSON.stringify(value))
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    },
    // onInput(value) {
    //     this.value = value
    // },
    convertToTime(date) {
      let value = new Date(date)
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    },
    cancelInput() {
      this.test++
      this.value = this.elemValue
      // Vue.set(this, 'value', this.elemValue)
    }
  }
}
</script>

<style lang="scss">

.fix_height {
  input {
    height: 26px
  }
}
</style>

<template>
  <v-container class="pa-0 ma-0" v-if="schema">
    <v-select
      v-if="Object.prototype.hasOwnProperty.call(schema, 'enum')"
      :label="schema.title || elemName"
      :items="schema.enum"
      :placeholder="schema['description']"
      :readonly="(readOnly ? readOnly : schema.readOnly)"
      :density="density"
      :variant="variant"
      :single-line="singleLine"
      hide-details
      :model-value="value"
      @update:modelValue="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
      v-else-if="Object.prototype.hasOwnProperty.call(schema, 'format') && schema.format==='datetime'"
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :readonly="(readOnly ? readOnly : schema.readonly)"
      :density="density"
      :variant="variant"
      :single-line="singleLine"
      hide-details
      :value="value?value.toLocaleString('sv'):''"
      type="datetime-local"
      @update:modelValue="convertToTime">

    </v-text-field>
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :readonly="(readOnly ? readOnly : schema.readonly)"
      hide-details
      :model-value="value"
      :density="density"
      :variant="variant"
      :single-line="singleLine"
      :type="type"
      @keydown.escape.stop="cancelInput"
      @update:modelValue="onChange"
    />
  </v-container>
</template>
