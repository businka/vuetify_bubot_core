<script>
import RowCellMixin from './RowCell.mixin'
import {getPropValueByPath, zeroPad} from 'bubot-helper/BaseHelper'

export default {
  name: 'CellDateNumber',
  mixins: [RowCellMixin],
  props: {},
  methods: {
    getDate(date) {
      if (!date) {
        return undefined
      }
      switch (typeof date) {
        case "object":
          return date
        case 'string':
          return new Date(date)
        default:
          return undefined
      }
    },
    getDateString(date) {
      if (date) {
        return `${zeroPad(date.getDate(), 2)}.${zeroPad(date.getMonth() + 1, 2)}.${String(date.getFullYear()).substring(2, 4)}`
      }
      return ''
    }
  },
  computed: {
    previousDate: function () {
      return this.getDate(this.getPreviousValue())
    },
    _date: function () {
      return this.getDate(this._value)
    },
    date: function () {
      if (this._date) {
        return this.getDateString(this._date)
      } else {
        return ''
      }
    },
    number: function () {
      return getPropValueByPath(this.modelValue, this.col.fieldNumber, '')
    },
    showDate: function () {
      return this.date !== this.getDateString(this.previousDate)
    }
  }
}
</script>

<template>
  <v-container class="pa-0  ">
    <div v-if="date && showDate" class="text-right">
      {{ date }}
    </div>
    <div
        class="text-grey text-caption text-right"
        style="margin-top: -6px">
      {{ number }}
    </div>
  </v-container>
</template>

<style scoped>

</style>
