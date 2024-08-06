<script>
export default {
  name: 'BrowserToolbar2',
  components: {
    ActionBtn: () => import('../../ActionButtons/ActionBtn'),
    SearchField: () => import('./Filter/SearchField'),
    FilterBtn: () => import('./Filter/FilterBtn')
  },
  props: {
    items: {
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
    hideSelectAll: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Object
    }
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
    <v-checkbox
        v-if="!hideSelectAll"
        hide-details
        :input-value="selectAll.everyItem"
        class="selectAll"
        @change="selectAll.toggleSelectAll"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="(item, i) in items"
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
