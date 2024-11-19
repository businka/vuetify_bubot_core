<script>
export default {
  props: ['schema', 'value', 'obj', 'readOnly'],
  methods: {
    onChange(value) {
      let data
      if (value){
        data = { n: this.schema.name, v: value.row._id['$oid'] }
        const fields = this.schema['fields'] || []
        for (let i = 0, len = fields.length; i <len; ++i) {
          if(Object.prototype.hasOwnProperty.call(value.row, fields[i])) {
            data[fields[i]] = value.row[fields[i]]
          }
        }
      } else {
        data = { n: this.schema.name, v: null }
      }
      this.$emit('action', {
        name: 'ChangeParam', data}
      )
    }
  }
}
</script>

<template>
  <FieldLink
    :value="value"
    :params="schema"
    @input="onChange"
  />
</template>
