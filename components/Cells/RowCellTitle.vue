<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'RowCellTitle',
  mixins: [ActionMixin],
  props: {
    titleField: {
      type: String,
      default: 'title'
    },
    subtitleField: {
      type: String,
      default: 'subtitle'
    },
    infoField: {
      type: String,
      default: 'info'
    },
    value: {
      type: Object,
      default: () => {
      }
    },
  },
}
</script>

<template>
  <div>
    <v-row class="d-flex align-baseline  pa-0 ma-0">
      <div
        class="text-body-1 pa-0 ma-0"
        v-text="value[titleField]"
      ></div>
      <div
        v-if="value[subtitleField]"
        class="text-caption  pa-0 ma-0 ml-1"
        v-text="value[subtitleField]"
      ></div>
    </v-row>
    <v-row
      v-if="value[infoField]"
      class="text-caption pa-0 ma-0 text--secondary"
      v-text="value[infoField]"
    ></v-row>
  </div>
</template>
