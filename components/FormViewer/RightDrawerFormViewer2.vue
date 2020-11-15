<script>

import FormLoader from './FormLoader.mixin'

export default {
  name: 'RightDrawerFormViewer',
  mixins: [FormLoader],
}
</script>
<style lang="scss" scoped>
  .v-btn--outlined {
    border: thin solid var(--v-default-base);
    background-color: var(--v-default-base) transparent;

    &:hover {
      background-color: var(--v-default-lighten5);
    }
  }
</style>

<template>
  <v-navigation-drawer
    right
    :width="width"
    absolute
    class="elevation-6"
    permanent
    :value="visible"
  >
    <v-progress-linear
      v-if="loading"
      height="2"
      indeterminate
    />
    <component
      :is="form.template"
      v-if="form && !loading"
      :ref="form"
      v-bind="form"
      @action="onAction"
    />
    <template
      v-if="error && !loading"
      class="pa-2"
    >
      <v-toolbar
        height="30"
        flat
        dense
        class="pl-2"
      >
        {{ error }}
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dense
            small
            @click="$emit('action', { name: 'CloseEditForm' })"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </template>
  </v-navigation-drawer>
</template>
