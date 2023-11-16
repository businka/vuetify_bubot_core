<script>

import FormLoader from './FormLoader.mixin'

export default {
    name: 'RightDrawerFormViewer3',
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
    location="right"
    :width="width"
    class="elevation-6"
    :temporary="true"
    :scrim="false"
    :model-value="formVisible"
  >
    <v-progress-linear
      v-if="loading"
      height="2"
      indeterminate
    />
    <component
      :is="form.template"
      v-if="form && !loading"
      v-bind="form"
      @action="onAction"
    />
    <v-container
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
        <v-spacer/>
        <v-toolbar-items>
          <v-btn
            icon
            dense
            small
            @click="$emit('action', { name: 'CloseForm' })"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-container>
  </v-navigation-drawer>
</template>
