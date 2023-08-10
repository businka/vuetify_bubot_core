<script>
// import {getPropByPath} from "@/BubotCore/components/JsonEditor/JsonHelper"

export default {
  props: {
    schema: Object,
    elemValue: Number,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    singleLine: Boolean,
    level: Number,
    readOnly: {
      type: Boolean,
      default: undefined

    },
    hideReadOnly: Boolean,
    variant: String,
    density: String
  },
  watch: {
    elemValue: function (value) {
      console.log('vak', value)
      if (value === undefined && this.schema.default) {
        this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value: Number(this.schema.default)}})
      }
    }
  },
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + JSON.stringify(value))
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
      :model-value="elemValue"
      @update:modelValue="onChange"
    />
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || ''"
      :title="schema.description || ''"
      :readonly="(readOnly ? readOnly : schema.readonly)"
      :density="density || arrayElem"
      hide-details
      :model-value="elemValue || schema.default"
      :variant="variant"
      :single-line="singleLine"
      @update:modelValue="onChange"
    />
  </div>
</template>
