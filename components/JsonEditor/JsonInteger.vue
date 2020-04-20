<template>
  <div>
    <v-select
      v-if="schema.hasOwnProperty('enum')"
      :label="elemName"
      :options="schema.enum"
      :placeholder="schema['description']"
      :readonly="schema.readOnly"
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
      :readonly="schema.readOnly"
      :single-line="arrayElem"
      :dense="arrayElem"
      hide-details
      :value="elemValue"
      type="number"
      @input="onChange"
    />
  </div>
</template>
<script>

export default {
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + value)
      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value: Number(value)}})

    }
  }
}
</script>
