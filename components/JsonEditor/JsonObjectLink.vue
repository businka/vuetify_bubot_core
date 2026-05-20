<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import FieldLink from '../Simple/FieldLink'

export default {
  name: 'JsonObjectLink',
  components: {
    FieldLink,
  },
  mixins: [ActionMixin],
  props: {
    schema: Object,
    elemValue: {
      validator: function (value) {
        const result = (typeof value === 'object')
        if (!result)
          console.warn(`JsonObjectLink value os not object: ${value}`)
        return result
      }
    },
    elemName: String,
    path: String,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
  data() {
    return {
      linkListData: null,
      options: null,
      show: false,
      delimiter: '.'
    }
  },
  computed: {
    value: {
      get() {
        return this.elemValue[this.schema['title_field'] || 'title']
      },
      set(value) {
        this.$emit('action', {
          name: 'UpdateProp',
          data: {action: 'change', path: this.path, value: this.linkListData[value]}
        })
      }
    }
  },
  mounted() {
    // if (this.schema && this.elemValue === undefined) {
    //   this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value: {}}})
    // }
  },
  methods: {
    onChange(value) {
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    }
  }
}
</script>

<style lang="scss">

</style>

<template>
  <FieldLink
    v-if="schema"
    :value="elemValue"
    v-bind="schema"
    :label="schema.title || elemName"
    :read-only="readOnly"
    @input="onChange"
  />
</template>
