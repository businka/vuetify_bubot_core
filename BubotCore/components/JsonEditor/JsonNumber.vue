<script>
// import {getPropByPath} from "@/BubotCore/components/JsonEditor/JsonHelper"

import {getPropByPath} from "@/BubotCore/components/JsonEditor/JsonHelper"

export default {
  props: {
    schema: Object,
    elemValue: Number,
    elemName: String,
    path: String,
    inputListeners: Object,
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
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value: Number(value)}})

    }
  }
}
</script>
<style lang="scss">

</style>
<template>
  <div>
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
      @update:modelValue="onChange"
    />
  </div>
</template>
