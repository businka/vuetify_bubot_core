<script>
export default {
  name: 'BrowserOperationsPanel',
  components: {
    SearchField: () => import('./Filter/SearchField'),
  },
  props: {

    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    hideSelectAll: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Object
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .bordered {
    border-bottom: thin solid #cccccc;
  }
</style>

<template>
  <v-toolbar
    dense
    flat
    height="44"
    class="bordered"
  >
    <v-checkbox
      v-if="!hideSelectAll"
      hide-details
      :input-value="selectAll.everyItem"
      class="jay-space-right"
      @change="selectAll.toggleSelectAll"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="item in items"
      :key="item.name"
      v-bind="item"
      @action="$emit('action', $event)"
    />
  </v-toolbar>
</template>
