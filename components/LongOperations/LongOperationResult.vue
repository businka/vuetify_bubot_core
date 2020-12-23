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
    result: { type: Array },
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
    right
    :width="width"
    absolute
    class="elevation-6"
    permanent
  >
    <v-progress-linear
      v-if="status==='pending' || status==='run'"
      :value="progress"
      :indeterminate="progress === -1"
      height="2"
    />
    <v-toolbar
      height="30"
      flat
      dense
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
          @click="$emit('action', { name: 'CloseEditForm' })"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <ExtException
      v-if="status==='error'"
      :error="result"
    ></ExtException>
    <component
      :is="form.template"
      v-else-if="form.template"
      v-bind="form"
      @action="onAction"
    />
  </v-navigation-drawer>
</template>

