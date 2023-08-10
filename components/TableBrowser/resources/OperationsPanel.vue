<script>
import ActionBtn from "@/BubotCore/components/ActionButtons/ActionBtn"
export default {
  name: 'BrowserOperationsPanel',
  components: {
    ActionBtn,
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
  // data: () => ({
  //   model: 'Leider',
  // }),
  methods: {
    select: function (event) {
      console.log(event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .bordered-bottom {
    border-bottom:  thin solid #cccccc;
  }
  .bordered-top {
    border-top: thin solid #cccccc;
  }
  .selectAll {
    //margin-left: -7px;
  }
</style>

<template>
  <v-toolbar
    density="compact"
    class="bordered-bottom bordered-top"
  >
    <v-toolbar-items>
    <v-checkbox
      v-if="!hideSelectAll"
      density="compact"
      hide-details
      :model-value="selectAll.allSelected"
      :indeterminate="selectAll.someSelected && !selectAll.allSelected"
      class="pt-1 pl-3"
      @update:modelValue="selectAll.selectAll($event)"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="(item, i) in items"
      :key="i"
      v-bind="item"
      @action="$emit('action', $event)"
    />
    </v-toolbar-items>
  </v-toolbar>
</template>
