<script>
export default {
  //todo.чтение схем и данных
  //todo.локализация схем
  props: ['schema', 'value'],
  // data () {
  //   return {
  //     edit_value: null
  //   }
  // },
  computed: {
    edit_value: function () {
      return Object.assign({}, this.value)
    }
  },
  beforeCreate: function () {
    this.$options.components.JsonElem = require('./JsonElem.vue').default
  },
  methods: {
    onChange (action, path, value) {
      console.log('JsonEditor.onChange', action, path, value)
      let _path = path.split(this.delimiter)
      let index
      let len = _path.length
      let _value = this.edit_value
      for (index = 1; index < len; ++index) {
        if (index === len - 1) {
          if (Object.prototype.hasOwnProperty.call(_value, _path[index])) {
            _value[_path[index]] = value
          } else {
            this.$set(_value, _path[index], value)
          }
        } else {
          _value = _value[_path[index]]
        }
      }
      this.$emit('change-value', this.edit_value)
    }
  }
}
</script>
<template>
  <v-card
    flat
    class="pa-2"
  >
    <JsonElem
      :schema="schema"
      :elemValue="edit_value"
      elemName=""
      :read-only="false"
      path=""
      @change-value="onChange"
    ></JsonElem>
  </v-card>
</template>
