<script>
// import Vue from 'vue'
import {getPropByPath} from './JsonHelper'

export default {
  props: {
    schema: Object,
    elemValue: {},
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: {
      type: Boolean,
      default: undefined

    },
    singleLine: Boolean,
    hideReadOnly: Boolean,
    variant: String,
    compact: Boolean,
    byPath: Boolean,
    type: {
      type: String,
      default: 'text'
    }
  },
  data: function () {
    return {
      value: this.elemValue,
      test: 0
    }
  },
  watch: {
    elemValue: function (value) {
      if (this.byPath) {
        this.value = getPropByPath(value, this.path)
      } else {
        this.value = value
      }
    }
  },
  methods: {
    onChange(value) {
      // console.log('oc2' + this.path + '-' + value)
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
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :items="schema.enum"
      :readonly="(readOnly ? readOnly : schema.readOnly)"
      flat
      :density="compact || arrayElem?'compact':undefined"
      hide-details
      :model-value="value"
      @update:modelValue="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
      v-else-if="Object.prototype.hasOwnProperty.call(schema, 'format') && schema.format==='datetime'"
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :readonly="(readOnly ? readOnly : schema.readonly)"
      :density="compact || arrayElem?'compact':undefined"
      hide-details
      :value="value?value.toLocaleString('sv'):''"
      :variant="variant"
      type="datetime-local"
      @update:modelValue="convertToTime">

    </v-text-field>
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :readonly="(readOnly ? readOnly : schema.readonly)"
      :density="compact || arrayElem?'compact':undefined"
      hide-details
      :model-value="value"
      :variant="variant"
      :type="type"
      :single-line="singleLine"
      @keydown.escape.stop="cancelInput"
      @update:modelValue="onChange"
    />
  </v-container>
</template>
