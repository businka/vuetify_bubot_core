<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ActionBtnMenu',
  mixins: [ActionMixin],
  props: {
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    color: {
      type: String,
    },
    minWidth: {
      type: String,
      default: '150px'
    },
    data: {
      type: Object,
    },
    items: {
      type: Array,
    },
    icon: {
      type: String,
      default: ''
    },
    primary: {
      type: Boolean,
      default: false
    },
    variant: String,
    size: String,
    density: {
      type: String,
      default: 'compact'
    },
    rounded: String,
    elevation: String,
    prependIcon: String,
    appendIcon: String
  },
  data: function () {
    return {
    }
  }
}
</script>

<template>
  <v-menu
      offset-y
      :min-width="minWidth"
  >
    <template v-slot:activator="{ props }">
      <v-btn
          :variant="variant"
          :color="color"
          :density="density"
          :title="title"
          :rounded="rounded"
          :elevation="elevation"
          :size="size"
          :icon="icon"
          :prepend-icon="prependIcon"
          :append-icon="appendIcon"
          v-bind="props"
      >
      </v-btn>
    </template>
    <v-list
        dense
        class="pa-0"
    >
      <v-list-item
          v-for="(menuItem, index) in items"
          :key="index"
          class="px-3"
          @click="emitAction(menuItem.name, menuItem.data)"
      >
        <template
            v-slot:prepend
            v-if="menuItem.icon"
            class="mr-2"
        >
          <v-icon :icon="menuItem.icon"/>
        </template>
        <v-list-item-title>{{ menuItem[`title_${$i18n.locale}`] || menuItem.title || null }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss">
.btn_default_action {
  border: thin solid #FF7033;
  background-color: transparent;

  &:hover {
    background-color: #FDECD9;
  }
}

.jay-primary-border {
  border: 1px solid rgb(217, 71, 0);
}

/*.jay-button {*/
/*font-size: 14px;*/
/*}*/

</style>
