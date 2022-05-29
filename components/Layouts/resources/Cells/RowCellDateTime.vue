<script>
import RowCellMixin from './RowCell.mixin'

let reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
export default {
    name: 'CellDateTime',
    mixins: [RowCellMixin],
    methods: {
        getDateArray(date) {
            return reggie.exec(date)
        },
        getDate(date) {
            if (!date) {
                return date
            }
            return `${date[3]}.${date[2]}.${date[1].substring(2, 4)}`
        },
        getTime(date) {
            return `${date[4]}:${date[5]}`
        }
    },
    computed: {
        previousDate: function () {
            return this.getPreviousValue()
        },
        _date: function () {
            return this.getDateArray(this._value)
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

<template>
    <v-container class="pa-0">
        <div v-if="showDate">
            {{date}}
        </div>
        <div class="grey--text caption text-right" v-if="showTime" style="margin-top: -6px">
            {{time}}
        </div>
    </v-container>
</template>