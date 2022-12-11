<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'

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
    editMode: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div>
    <v-row class="d-flex align-baseline  pa-0 ma-0">
      <div
        class="text-body-1 pa-0 ma-0"
        v-text="value.title"
      ></div>
      <div
        v-if="value.subtitle"
        class="text-caption  pa-0 ma-0 ml-1 text--secondary"
        v-text="value.subtitle"
      ></div>
    </v-row>
    <v-row
        v-if="value.info"
        class="pa-0 ma-0"
    >
      <div
          class="text-caption pa-0 ma-0 text--secondary"
          v-text="value.info">
      </div>
    </v-row>
  </div>
</template>
