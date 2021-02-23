<script>
export default {
  props: {
    schema: Object,
    elemValue: Number,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + value)
      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value: Number(value)}})

    }
  }
}
</script>
<template>
  <div>
    <v-select
      v-if="Object.prototype.hasOwnProperty.call(schema, 'enum')"
      :label="elemName"
      :items="schema.enum"
      :placeholder="schema['description']"
      :disabled="readOnly || schema.readOnly"
      :single-line="arrayElem"
      :dense="arrayElem"
      hide-details
      :value="elemValue"
      @input="onChange"
    />
    <v-text-field
      v-else
      :label="elemName"
      :placeholder="schema['description']"
      :disabled="readOnly ? readOnly : schema.readOnly"
      :single-line="arrayElem"
      :dense="arrayElem"
      hide-details
      :value="elemValue"
      type="number"
      @input="onChange"
    />
  </div>
</template>
