<template>
  <div class="pb-1">
    <v-select
      v-if="Object.prototype.hasOwnProperty.call(schema, 'enum')"
      :label="schema.title || elemName"
      :placeholder="schema.description || null"
      :items="schema.enum"
      :disabled="(schema.readOnly || readOnly)"
      :solo="arrayElem"
      :flat="arrayElem"
      :dense="arrayElem"
      hide-details
      :value="elemValue"
      @change="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
      v-else
      :label="schema.title || elemName"
      :placeholder="schema.description || null"
      :disabled="(schema.readOnly || readOnly)"
      :solo="arrayElem"
      :flat="arrayElem"
      :dense="arrayElem"
      hide-details
      :value="elemValue"
      @change="onChange"
    />
  </div>
</template>
<script>

export default {
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + value)
      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value}})
    }
  }
}
</script>
