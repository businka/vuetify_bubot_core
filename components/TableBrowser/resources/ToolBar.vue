<script>
import {defineAsyncComponent} from "vue"

export default {
  name: 'BrowserToolbar',
  components: {
    SearchField: defineAsyncComponent(() => import('./Filter/SearchField')),
    FilterBtn: defineAsyncComponent(() => import('./Filter/FilterBtn'))
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
    operationsPanelItems: {
      type: Array,
      default: function () {
        return []
      }
    },
    borderedTop: {
      type: Boolean,
      default: false
    },
    borderedBottom: {
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
    onActivate() {
      console.log('test');
    }
  }
}
</script>

<style scoped>
.borderedTop1 {
  border-top: thin solid #cccccc;
}

.borderedBottom1 {
  border-bottom: thin solid #cccccc;
}
</style>

<template>
  <v-toolbar
    density="compact"
    variant="flat"
    class="borderedTop, borderedBottom bg-grey-lighten-4"
  >
    <v-toolbar-items>
      <v-checkbox
        v-if="!hideSelectAll && showOperationsPanelBtn"
        density="compact"
        hide-details
        :model-value="selectAll.allSelected"
        :indeterminate="selectAll.someSelected && !selectAll.allSelected"
        class="pl-2 pr-2"
        @update:modelValue="selectAll.selectAll($event)"
      />
      <component
        :is="item.template || 'ActionBtn'"
        v-for="(item, i) in items"
        :key="i"
        density="compact"
        v-bind="item"
        @action="$emit('action', $event)"
      />
    </v-toolbar-items>
<!--    <SearchField-->
<!--      v-if="!hideSearchString"-->
<!--      class="mr-2"-->
<!--      :value="filter.searchString"-->
<!--      @changeFilter="$emit('changeFilter', $event)"-->
<!--    />-->
<!--    <v-toolbar-items>-->
<!--      <component-->
<!--        :is="item.template || 'ActionBtn'"-->
<!--        v-for="(item, i) in itemsBeforeFilter"-->
<!--        :key="i"-->
<!--        v-bind="item"-->
<!--        @action="$emit('action', $event)"-->
<!--      />-->
<!--      <template v-if="selectAll.someSelected">-->
<!--        <v-divider vertical></v-divider>-->
<!--        <component-->
<!--          :is="item.template || 'ActionBtn'"-->

<!--          v-for="(item, i) in operationsPanelItems"-->
<!--          :key="i"-->
<!--          v-bind="item"-->
<!--          @action="$emit('action', $event)"-->
<!--        />-->
<!--      </template>-->
<!--    </v-toolbar-items>-->
    <v-spacer/>
    <FilterBtn
      v-if="filterFields.length"
      :fields="filterFields"
      :filter="filter"
      @changeFilter="$emit('changeFilter', $event)"
    />
  </v-toolbar>
</template>
