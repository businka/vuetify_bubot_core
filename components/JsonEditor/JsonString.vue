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
    readOnly: Boolean,
    hideReadOnly: Boolean,
    solo: Boolean,
    dense: Boolean,
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
    onChange (value) {
      // console.log('oc2' + this.path + '-' + value)
      this.$emit('action', { name: 'UpdateProp', data: { action: 'change', path: this.path, value } })
    },
    onInput (value) {
      this.value = value
    },
    cancelInput () {
      this.test++
      this.value = this.elemValue
      // Vue.set(this, 'value', this.elemValue)
    }
  }
}
</script>



<template>
  <v-container class="pa-0 ma-0">
    <v-select
      v-if="schema && Object.prototype.hasOwnProperty.call(schema, 'enum')"
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :items="schema.enum"
      :disabled="(readOnly ? readOnly : schema.readOnly)"
      flat
      :dense="dense || arrayElem"
      hide-details
      :value="value"
      @input="onInput"
      @change="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :disabled="(readOnly ? readOnly : schema.readOnly)"
      flat
      :dense="dense || arrayElem"
      hide-details
      :value="value"
      :solo="solo"
      :type="type"
      @keydown.escape.stop="cancelInput"
      @input="onInput"
      @change="onChange"
    />
  </v-container>
</template>
