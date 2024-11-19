<script>
import {defineAsyncComponent} from "vue"

export default {
  name: 'JsonElem',
  components: {
    JsonString: defineAsyncComponent(() => import('./JsonString')),
    JsonArray: defineAsyncComponent(() => import('./JsonArray')),
    JsonArrayOneOf: defineAsyncComponent(() => import('./JsonArrayOneOf')),
    JsonObject: defineAsyncComponent(() => import('./JsonObject')),
    JsonObjectLink: defineAsyncComponent(() => import('./JsonObjectLink')),
    JsonInteger: defineAsyncComponent(() => import('./JsonNumber')),
    JsonBoolean: defineAsyncComponent(() => import('./JsonBoolean')),
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
    hideReadOnly: Boolean,
  },
  data: () => ({
    delimiter: '.'
  }),
  computed: {
    // _inputListeners: function () {
    //   if (this.path === '') {
    //     const vm = this
    //     return Object.assign({},
    //       this.$listeners,
    //       {
    //         'action': function (action) {
    //           // console.log('change-value ', action, path, value)
    //           vm.$emit('action', action)
    //         }
    //       }
    //     )
    //   } else {
    //     return this.inputListeners
    //   }
    // }
  },
  methods: {
    onChange (data) {
      console.log('elem' + data)
    }
  },
}
</script>

<style lang="scss">
  //div .bubot-input {
  //  .theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
  //    color: rgba(0, 0, 0, 0.65);
  //  }
  //
  //  .theme--light.v-label--is-disabled {
  //    color: rgba(0, 0, 0, 0.5);
  //  }
  //
  //  div .theme--light.v-select .v-select__selection--disabled {
  //    color: rgba(0, 0, 0, 0.65);
  //
  //  }
  //}
  div .json-elem {
    .v-field--variant-plain .v-label.v-field-label--floating, .v-field--variant-underlined .v-label.v-field-label--floating {
      transform: translateY(-8px);
    }
  }
</style>

<template>
  <div
    v-if="schema && !schema.hidden && (!hideReadOnly || (hideReadOnly && !schema.readOnly))"
    class="json-elem"
  >
    <JsonString
      v-if="schema['type']==='string'"
      :elemName="elemName"
      :elemValue="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonInteger
      v-else-if="schema['type']==='integer'"
      :elemName="elemName"
      :elemValue="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonInteger
        v-else-if="schema['type']==='number'"
        :elemName="elemName"
        :elemValue="elemValue"
        :schema="schema"
        :path="path"
        :array-elem="arrayElem"
        :read-only="readOnly?readOnly:schema.readOnly"
        :hide-read-only="hideReadOnly"
        v-bind="$attrs"
    />
    <JsonBoolean
      v-else-if="schema['type']==='boolean'"
      :elemName="elemName"
      :elemValue="!!elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonArray
      v-else-if="schema.type==='array' && !schema.items.oneOf"
      :elemName="elemName"
      :elemValue="elemValue ? elemValue : []"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonArrayOneOf
      v-else-if="schema.type==='array' && schema.items.oneOf"
      :elemName="elemName"
      :elemValue="elemValue"
      :schema="schema"
      :path="path"
      :array-elem="arrayElem"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonObjectLink
      v-else-if="schema['type']==='object' && schema['format'] === 'link'"
      :elemName="elemName"
      :elemValue="elemValue"
      :schema="schema"
      :array-elem="arrayElem"
      :path="path"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
    <JsonObject
      v-else-if="schema['type']==='object'"
      :elemName="elemName"
      :elemValue="elemValue"
      :schema="schema"
      :array-elem="arrayElem"
      :path="path"
      :read-only="readOnly?readOnly:schema.readOnly"
      :hide-read-only="hideReadOnly"
      v-bind="$attrs"
    />
  </div>
</template>
