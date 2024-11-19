<script>
import RowCellMixin from './RowCell.mixin'
import {zeroPad} from '@/Helpers/BaseHelper'

export default {
  name: 'CellDateTime',
  mixins: [RowCellMixin],
  props: {
    hideTime: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDateString(date) {
      if (date) {
        return `${zeroPad(date.getDate(), 2)}.${zeroPad(date.getMonth() + 1, 2)}.${String(date.getFullYear()).substring(2, 4)}`
      }
      return ''

    },
    getTimeString(date) {
      if (date) {
        return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
      }
      return ''
    }
  },
  computed: {
    previousDate: function () {
      return this.getPreviousValue()
    },
    _date: function () {
      switch (typeof this._value) {
        case "object":
          return this._value
        case 'string':
          return new Date(this._value)
        default:
          return undefined
      }

    },
    date: function () {
      if (this._date) {
        return this.getDateString(this._date)
      } else {
        return ''
      }
    },
    time: function () {
      return this.getTimeString(this._date)
    },
    showDate: function () {
      return this.date !== this.getDateString(this.previousDate)
    },
    showTime: function () {
      return this.showDate || this.time !== this.getTimeString(this.previousDate)
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
      v-if="!hideTime && date && showTime"
      class="text-grey text-caption text-right"
      style="margin-top: -6px">
      {{ time }}
    </div>
  </v-container>
</template>

<style scoped>

</style>
