<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'
import {getPropValueByPath} from '../../../../../Helpers/BaseHelper'

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
    <v-row class="pa-0 ma-0">
      <v-col class="d-flex align-baseline  pa-0 ma-0">
        <div
            class="text-body-1 pa-0 ma-0 "
            v-text="title"
            :title="title"
        ></div>
        <div
            v-if="subtitle"
            :title="subtitle"
            class="text-caption  pa-0 ma-0 ml-1 text--secondary"
            v-text="subtitle"
        ></div>
      </v-col>
    </v-row>
    <v-row
        v-if="info"
        class="pa-0 ma-0"
    >
      <div
          class="text-caption pa-0 ma-0 text--secondary"
          :title="info"
          v-text="info">
      </div>
    </v-row>
  </div>
</template>
<style lang="scss">

.truncate {
  white-space: nowrap; /* Текст не переносится */
  overflow: hidden; /* Обрезаем всё за пределами блока */
  text-overflow: ellipsis; /* Добавляем многоточие */
}
</style>