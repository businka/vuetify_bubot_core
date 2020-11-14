<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'
// import { jsonClone } from '../../helpers/clone'

export default {
  name: 'CellFieldLink',
  mixins: [ActionMixin],
  props: {
    col: {
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
      if (this.col.value) {
        return this.col.value.split('.')
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
      if (value) {
        result[this._name] = { _id: value.row._id }
        const fields = this.col['fields'] || []
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
  <div>
    <span
      v-if="editMode"
    >
      <FieldLink
        :params="col"
        :value="_value"
        @input="onChange"
      />
    </span>
    <span
      v-else
    >
      {{ _value ? _value.title: '' }}
    </span>
  </div>
</template>
