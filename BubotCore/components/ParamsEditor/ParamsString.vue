<template>
  <div
    class="pb-1"
  >
    <v-text-field
      :label="schema[`title_${$i18n.locale}`] || schema.title || schema.name"
      :placeholder="schema.description || null"
      :readonly="schema.readOnly"
      :single-line="false"
      :dense="false"
      hide-details
      :value="value.v"
      @change="onChange"
    />
  </div>
</template>
<script>

export default {
  props: ['schema', 'value', 'readOnly'],
  methods: {
    onChange (value) {
      this.$emit('action', { name: 'ChangeParam', data: { n: this.schema.name, v:value }})
    }
  }
}
</script>
