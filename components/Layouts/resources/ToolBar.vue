<script>
export default {
  name: 'BrowserToolbar',
  components: {
    SearchField: () => import('./Filter/SearchField'),
    FilterBtn: () => import('./Filter/FilterBtn')
  },
  props: {
    itemsBeforeSearch: {
      type: Array,
      default: function () {
        return []
      }
    },
    itemsBeforeFilter: {
      type: Array,
      default: function () {
        return []
      }
    },
    filterFields: {
      type: Array,
      default: function () {
        return []
      }
    },
    filter: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hideSearchString: {
        type: Boolean,
        default: false
    },
    showOperationsPanelBtn: {
      type: Boolean,
      default: false
    },
    showOperationsPanel: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    onActivate () {
      console.log('test');
    }
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
    <component
      :is="item.template || 'ActionBtn'"
      v-for="(item, i) in itemsBeforeSearch"
      :key="i"
      v-bind="item"
      @action="$emit('action', $event)"
    />

    <SearchField
      v-if="!hideSearchString"
      class="mr-2"
      :value="filter.searchString"
      @changeFilter="$emit('changeFilter', $event)"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="(item, i) in itemsBeforeFilter"
      :key="i"
      v-bind="item"
      @action="$emit('action', $event)"
    />
    <v-btn
      v-if="showOperationsPanelBtn"
      icon
      dense
      small
      @click="$emit('changeOperationPanelState')"
    >
      <v-icon>{{ showOperationsPanel ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>
    <v-spacer />
    <FilterBtn
      v-if="filterFields.length"
      :fields="filterFields"
      :filter="filter"
      @changeFilter="$emit('changeFilter', $event)"
    />
  </v-toolbar>
</template>
