<template>
  <div
    class="pb-1"
  >
    <v-select
      :label="schema[`title_${$i18n.locale}`] || schema.title || schema.name"
      :readonly="schema.readOnly"
      :items="schema.enum"
      :item-text="`title_${$i18n.locale}`"
      item-value="value"
      return-object
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
  computed: {
    select: {
      get: function() {
        let data = this.schema.find(elem => elem.value === this.value.v)
        if (!data && this.value.v) {
          data = { value: this.value.v }
          data[`title_${this.$i18n.locale}`] = this.value.v
        }
        return data
      }
    }
  },
  methods: {
    onChange(value) {
      this.$emit('action', { name: 'ChangeParam', data: { n: this.schema.name, v: value.value } })
    }
  }
}
</script>
