<template>
  <div>
    <v-row class="d-flex align-baseline  pa-0 ma-0">
      <div
        class="text-body-1 pa-0 ma-0"
        v-text="value.title"
      ></div><div
        v-if="value.subtitle"
        class="text-caption  pa-0 ma-0 ml-1"
        v-text="value.subtitle"
      ></div>
    </v-row>
    <v-row
      v-if="value.info"
      class="text-caption pa-0 ma-0 text--secondary"
      v-text="value.info"
    ></v-row>
  </div>
</template>
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'CellTitle',
  mixins: [ActionMixin],
  props: {
    col: {
      type: Object,
      default: () => {
      }
    },
    value: {
      type: Object,
      default: () => {
      }
    },
  }
}
</script>
