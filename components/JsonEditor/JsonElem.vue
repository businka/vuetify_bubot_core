<script>
export default {
  name: 'JsonElem',
  components: {
    JsonString: () => import('./JsonString'),
    JsonArray: () => import('./JsonArray'),
    JsonArrayOneOf: () => import('./JsonArrayOneOf'),
    JsonObject: () => import('./JsonObject'),
    JsonInteger: () => import('./JsonInteger'),
    JsonBoolean: () => import('./JsonBoolean'),
  },
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
  data: () => ({
    delimiter: "."
  }),
  computed: {
    _inputListeners: function() {
      if (this.path === '') {
        const vm = this
        return Object.assign({},
          this.$listeners,
          {
            'action': function(action) {
              // console.log('change-value ', action, path, value)
              vm.$emit('action', action)
            }
          }
        )
      } else {
        return this.inputListeners
      }
    }
  },
  methods: {
    onChange(data) {
      console.log('elem' + data)
    }
  },
}
</script>
<template>
  <div v-if="schema && !schema.hide && (elemValue || !schema.readOnly)">
    <JsonString
      v-if="schema['type']==='string'"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      v-on="_inputListeners"
    />
    <JsonInteger
      v-else-if="schema['type']==='integer'"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      v-on="_inputListeners"
    />
    <JsonBoolean
      v-else-if="schema['type']==='boolean'"
      :elem-name="elemName"
      :elem-value="!!elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      v-on="_inputListeners"
    />
    <JsonArray
      v-else-if="schema.type==='array' && !schema.items.oneOf"
      :elem-name="elemName"
      :elem-value="elemValue ? elemValue : []"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :input-listeners="_inputListeners"
      v-on="_inputListeners"
    />
    <JsonArrayOneOf
      v-else-if="schema.type==='array' && schema.items.oneOf"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :input-listeners="_inputListeners"
      v-on="_inputListeners"
    />
    <JsonObject
      v-else-if="schema['type']==='object'"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :array-elem="arrayElem"
      :input-listeners="_inputListeners"
      :path="path"
      :read-only="readOnly?readOnly:schema.readOnly"
      v-on="_inputListeners"
    />
  </div>
</template>
