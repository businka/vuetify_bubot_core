<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'

export default {
  name: 'RowCellActions',
  mixins: [ActionMixin],
  props: {
    modelValue: {
      type: Object,
      default: () => {
      }
    },
    field: {
      type: String
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      name2: ''
    }
  },
  computed: {
    _actions () {
      let res = []
      if (this.field) {
        res = res.concat(this.modelValue[this.field] || [])
      }
      res = res.concat(this.actions)
      return res
    }
  }
}
</script>
<style lang="scss">
  tr {
    .action-toolbar {
      visibility: hidden;
      float: right;
    }

    &:hover {
      .action-toolbar {
        visibility: visible;
        float: right;
      }
    }
  }

</style>
<template>
  <span class="action-toolbar d-flex"
  >
    <component
      :is="item.template || 'ActionBtn'"
      v-for="(item, i) in _actions"
      :key="i"
      v-bind="item"
      @action="$emit('action', $event)"
    />
  </span>
</template>
