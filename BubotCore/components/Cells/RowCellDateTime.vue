<template>
  <div>
    <div v-if="showDate">
      {{date}}
    </div>
    <div class="text-secondary" v-if="showTime">
      {{time}}
    </div>
  </div>
</template>
<script>
let reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
export default {
  props: ['col', 'props', 'data'],
  methods: {
    getDateArray (date) {
      return reggie.exec(date)
    },
    getDate (date) {
      if (!date) {
        return date
      }
      return `${date[3]}.${date[2]}.${date[1].substring(2, 4)}`
    },
    getTime (date) {
      return `${date[4]}:${date[5]}`
    }
  },
  computed: {
    previousDate: function () {
      let index = this.props.row.__index
      if (index > 0) {
        return this.getDateArray(this.data[index - 1].date)
      }
      return ''
    },
    _date: function () {
      return this.getDateArray(this.props.row.date)
    },
    date: function () {
      return this.getDate(this._date)
    },
    time: function () {
      return this.getTime(this._date)
    },
    showDate: function () {
      return this.date !== this.getDate(this.previousDate)
    },
    showTime: function () {
      return this.showDate || this.time !== this.getTime(this.previousDate)
    }
  }
}
</script>
