<script>
import FormLoader from '../FormViewer/FormLoader.mixin'
import ExtException from '../Simple/ExtException'

export default {
  name: 'LongOperationResult',
  components: { ExtException },
  mixins: [FormLoader],
  props: {
    uid: { type: String },
    cancelable: { type: Boolean },
    message: { type: String },
    percent: { type: Number },
    progress: { type: Number },
    result: { type: Object },
    show: { type: Boolean },
    status: { type: String },
    title: { type: String }
  },
  watch: {
    uid () {
      this.init()
    }
  },
}
</script>

<style scoped>

</style>

<template>
  <v-navigation-drawer
    :width="width"
    location="right"
    :temporary="true"
    class="elevation-6"
    :model-value="true"
  >
    <v-progress-linear
      v-if="status==='pending' || status==='run'"
      :value="progress"
      :indeterminate="progress === -1"
      height="2"
    />
    <v-toolbar
      density="compact"
      class="header1_bg pa-0"
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="cancelable && (status==='pending' || status==='run')"
        color="primary"
        outlined
        dense
        small
        @click.stop="$store.dispatch('LongOperations/cancel', uid, { root: true })"
      >
        Cancel
      </v-btn>
      <v-btn
        v-else-if="status==='error' || status==='success'"
        color="primary"
        outlined
        dense
        small
        @click.stop="$store.dispatch('LongOperations/delete', uid, { root: true })"
      >
        Delete
      </v-btn>

      <v-toolbar-items>
        <v-btn
          icon
          dense
          small
          class="ml-2"
          @click="$emit('action', { name: 'CloseForm' })"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <ExtException
      v-if="status==='error'"
      class="pa-4"
      :value="result"
    ></ExtException>
    <component
      :is="form.template"
      v-else-if="form && form.template"
      v-bind="form"
      :value="result"
      @action="onAction"
    />
  </v-navigation-drawer>
</template>

