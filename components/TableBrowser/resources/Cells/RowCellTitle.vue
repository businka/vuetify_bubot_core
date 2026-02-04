<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'
import {getPropValueByPath} from 'bubot-helper/BaseHelper'
import RowCellMixin from "./RowCell.mixin"

export default {
  name: 'RowCellTitle',
  mixins: [ActionMixin, RowCellMixin],
  props: {
  },
  computed: {
    title: function () {
      return getPropValueByPath(this.modelValue, this.col.field)
    },
    subtitle: function () {
      return getPropValueByPath(this.modelValue, this.col.subtitleField)
    },
    info: function () {
      return getPropValueByPath(this.modelValue, this.col.infoField)
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
        />
        <div
            v-if="subtitle"
            :title="subtitle"
            class="text-caption  pa-0 ma-0 ml-1 text--secondary"
            v-text="subtitle"
        />
      </v-col>
    </v-row>
    <v-row
        v-if="info"
        class="pa-0 ma-0"
    >
      <div
          class="text-caption pa-0 ma-0 text--secondary"
          :title="info"
          v-text="info"
      />

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
