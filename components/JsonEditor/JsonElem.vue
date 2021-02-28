<script>
export default {
  name: 'JsonElem',
  components: {
    JsonString: () => import('./JsonString'),
    JsonArray: () => import('./JsonArray'),
    JsonArrayOneOf: () => import('./JsonArrayOneOf'),
    JsonObject: () => import('./JsonObject'),
    JsonObjectLink: () => import('./JsonObjectLink'),
    JsonInteger: () => import('./JsonInteger'),
    JsonBoolean: () => import('./JsonBoolean'),
  },
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
  data: () => ({
    delimiter: '.'
  }),
  computed: {
    _inputListeners: function () {
      if (this.path === '') {
        const vm = this
        return Object.assign({},
          this.$listeners,
          {
            'action': function (action) {
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
    onChange (data) {
      console.log('elem' + data)
    }
  },
}
</script>

<style lang="scss">
  div .bubot-input {
    .theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
      color: rgba(0, 0, 0, 0.65);
    }

    .theme--light.v-label--is-disabled {
      color: rgba(0, 0, 0, 0.5);
    }

    div .theme--light.v-select .v-select__selection--disabled {
      color: rgba(0, 0, 0, 0.65);

    }
  }
</style>

<template>
  <div
    v-if="schema && !schema.hidden && (!hideReadOnly || (hideReadOnly && !schema.readOnly))"
    class="bubot-input"
  >
    <JsonString
      v-if="schema['type']==='string'"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
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
      :hide-read-only="hideReadOnly"
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
      :hide-read-only="hideReadOnly"
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
      :hide-read-only="hideReadOnly"
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
      :hide-read-only="hideReadOnly"
      :input-listeners="_inputListeners"
      v-on="_inputListeners"
    />
    <JsonObjectLink
      v-else-if="schema['type']==='object' && schema['format'] === 'link'"
      :elem-name="elemName"
      :elem-value="elemValue"
      :schema="schema"
      :array-elem="arrayElem"
      :input-listeners="_inputListeners"
      :path="path"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
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
      :hide-read-only="hideReadOnly"
      v-on="_inputListeners"
    />
  </div>
</template>
