<script>

export default {
  props: {
    schema: Object,
    elemValue: null,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
  computed: {
    value: {
      get () {
        return !!this.elemValue
      },
      set (value) {
        this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value}})
      }
    }
  }
}
</script>

<template>
  <div class="q-pt-0 q-pb-0">
    <v-checkbox
      v-model="value"
      :label="elemName"
      density="compact"
      hide-details
      :placeholder="schema.description ||''"
      :disabled="readOnly || schema.readOnly"
    />
  </div>
</template>
