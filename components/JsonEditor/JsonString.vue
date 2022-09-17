<script>
// import Vue from 'vue'

export default {
  props: {
    schema: Object,
    elemValue: String,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean,
    solo: Boolean,

  },
  data: function () {
    return {
      value: this.elemValue,
      test: 0
    }
  },
  watch: {
    elemValue: function (value) {
      this.value = value
    }
  },
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + value)
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
  <div class="pb-1">
    <v-select
      v-if="schema && Object.prototype.hasOwnProperty.call(schema, 'enum')"
      :label="schema.title || elemName"
      :placeholder="schema.description || null"
      :items="schema.enum"
      :disabled="(readOnly ? readOnly : schema.readOnly)"
      flat
      :dense="arrayElem"
      hide-details
      :value="value"
      @input="onInput"
      @change="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || null"
      :disabled="(readOnly ? readOnly : schema.readOnly)"
      flat
      :dense="arrayElem"
      hide-details
      :value="value"
      :solo="solo"
      @keydown.escape.stop="cancelInput"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>
