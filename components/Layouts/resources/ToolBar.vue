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
      v-for="item in itemsBeforeSearch"
      :key="item.name"
      v-bind="item"
      @activate="onActivate"
    />

    <SearchField
      class="mr-2"
      :value="filter.searchString"
      @changeFilter="$emit('changeFilter', $event)"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="item in itemsBeforeFilter"
      :key="item.name"
      v-bind="item"
      @activate="onActivate"
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
