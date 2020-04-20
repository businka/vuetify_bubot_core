<template>
  <div class="q-pt-0 q-pb-0">
    <v-checkbox
      :label="elemName"
      :placeholder="schema['description']"
      :readonly="schema.readOnly"
      v-model="value"
    >
    </v-checkbox>
  </div>
</template>
<script>

export default {
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
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
