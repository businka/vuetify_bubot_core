<script>
// import ActionMixin from '../../helpers/mixinTemplate/action'
// import { jsonClone } from '../../helpers/clone'

export default {
  name: 'FilterFieldLink',
  // mixins: [ActionMixin],
  props: {
    field: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    path() {
      if (this.field.value) {
        return this.field.value.split('.')
      }
      else {
        return []
      }

    },
    _name() {
      return this.path[this.path.length - 1]
    },
    _value() {
      let result = this.value
      let i, len
      for (i = 0, len = this.path.length; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
          result = result[this.path[i]]
        }
      }
      return result
    }
  },
  methods: {
    onChange(value) {
      let data = Object.assign({}, this.value)
      let result = data
      let i, len
      for (i = 0, len = this.path.length; i < len - 1; i++) {
        if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
          result = result[this.path[i]]
        }
      }
      if (value && value.row) {
        result[this._name] = { _id: value.row._id }
        const fields = this.field['fields'] || []
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (Object.prototype.hasOwnProperty.call(value.row, fields[i])) {
            result[this._name][fields[i]] = value.row[fields[i]]
          }
        }
      } else {
        result[this._name] = null
      }
      this.$emit('input', data)
    }
  },
}
</script>
<style lang="scss">
  .linkField .v-input__append-outer {
    margin-left: 0;
    margin-right: 4px;
  }

</style>

<template>
  <v-container
    name="1"
  >
    <v-container
      v-if="editMode"
      name="2"
    >
      <FieldLink
        :params="field"
        :value="_value"
        @input="onChange"
        @action="onAction"
      />
    </v-container>
    <v-container
      v-else
      name="3"
    >
      {{ _value ? _value.title: '' }}
    </v-container>
  </v-container>
</template>
