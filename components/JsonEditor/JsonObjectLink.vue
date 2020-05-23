<script>
export default {
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
  methods: {
    onChange (value) {
      console.log('oc2' + this.path + '-' + value.title)
      let data
      if (value){
        data = { _id: value.row._id }
        const fields = this.schema['fields'] || []
        for (let i = 0, len = fields.length; i <len; ++i) {
          if(Object.prototype.hasOwnProperty.call(value.row, fields[i])) {
            data[fields[i]] = value.row[fields[i]]
          }
        }
      } else {
        data = { _id: null }
      }

      this.$emit('action', {name: 'SetItemProps', data: {path: this.path, value: value.row, action: 'change' }})
    }
  }
}
</script>

<template>
  <FieldLink
    :value="elemValue"
    :params="schema"
    @input="onChange"
  />
</template>
