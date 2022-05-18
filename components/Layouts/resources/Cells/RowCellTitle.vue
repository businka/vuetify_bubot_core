<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'
import { getPropValueByPath } from '../../../../../Helpers/BaseHelper'

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
  },
  computed: {
    title: function () {
      return getPropValueByPath(this.value, this.titleField)
    },
    subtitle: function () {
      return getPropValueByPath(this.value, this.subtitleField)
    },
    info: function () {
      return getPropValueByPath(this.value, this.infoField)
    }
  }
}
</script>

<template>
  <div>
    <v-row class="d-flex align-baseline  pa-0 ma-0">
      <div
        class="text-body-1 pa-0 ma-0"
        v-text="title"
      ></div>
      <div
        v-if="subtitle"
        class="text-caption  pa-0 ma-0 ml-1 text--secondary"
        v-text="subtitle"
      ></div>
    </v-row>
    <v-row
      v-if="info"
      class="text-caption pa-0 ma-0 text--secondary"
      v-text="info"
    ></v-row>
  </div>
</template>
