<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
    name: "AutorunSchedule",
    props: {
        autorun: {
            type: Boolean,
            default: true
        },
        autorun_rate: {
            type: String
        },
        autorun_interval: {
            type: Number
        },
        autorun_time: {},
        last_run: {
            type: Date,
        },
        last_result: {
            type: Object,
        },
        last_duration: {
            type: String,
        },
        next_run: {
            type: Date,
        },
    },
    mixins: [ActionMixin],
    data: function () {
        return {
            dialog: false,
            rates: ['minute', 'hour', 'day'],
            new_value: {}
        }
    },
    computed: {
        title() {
            if (!this.value) {
                return 'Без повторений'
            }
            return 'dd'
        },
        autorunValue: {
            get() {
                return !!this.autorun
            },
            set(value) {
                this.$emit('action', {
                    name: 'UpdateProp',
                    data: {action: 'change', 'path': 'autorun', 'value': !!value}
                })
            }
        }
    },
    watch: {
        autorun_rate() {
            this.init()
        }
    },
    methods: {
        init: function () {
            if (!this.autorun_rate) {
                this.$emit('action', {
                    name: 'UpdateProp',
                    data: {action: 'change', 'path': 'autorun_rate', 'value': 'hour'}
                })
                this.$emit('action', {
                    name: 'UpdateProp',
                    data: {action: 'change', 'path': 'autorun_interval', 'value': 1}
                })
            }

        }
    },
    beforeMount() {
        this.init()
    },

}
</script>

<template>
  <v-container class="pa-0">
    <v-row class="d-flex justify-start ma-0 pa-0 ma-0 ">
      <v-checkbox
        v-model="autorunValue"
        hide-details
        single-line
        dense
        color="gray"
        label="Автозапуск каждые"
        class="pr-3 theme--light.v-label"
        style="margin-left: -5px;"
      ></v-checkbox>
      <v-text-field
        :value="autorun_interval"
        type="number"
        hide-details
        single-line
        dense
        class="pr-3 text-field--number"
        @change="emitAction('UpdateProp', {'action': 'change', 'path':'autorun_interval','value': Number($event)})"
      ></v-text-field>
      <v-select
        :value="autorun_rate"
        hide-details
        single-line
        dense
        :items="rates"
        class="pr-3"
        style="max-width: 100px"
        @change="emitAction('UpdateProp', {'action': 'change', 'path':'autorun_rate','value': $event})"

      ></v-select>
      <span v-if="autorun_rate==='day'" class="d-flex justify-start align-baseline">
        <span class="pt-2 theme--light v-label align-baseline">в</span>
        <v-text-field
          :value="autorun_time"
          type="time"
          single-line
          hide-details
          dense
          class="pl-3 text-field--time"
          @change="emitAction('UpdateProp', {'action': 'change', 'path':'autorun_time','value': $event})"
        >
        </v-text-field>
         </span>
    </v-row>
    <v-row
      v-if="last_run || next_run"
      class="d-flex justify-start ma-0 pa-0">
        <span
          v-if="last_run"
          class="caption pr-2 theme--light v-label align-baseline">Последний запуск: {{last_run.toLocaleString()}}

        </span>
        <span
          v-if="next_run"
          class="caption theme--light v-label align-baseline">Следующий запуск: {{next_run.toLocaleString()}}</span>
    </v-row>
  </v-container>
</template>


<style lang="scss">
  .text-field--time {
    max-width: 100px;

    input {
      max-height: 26px;
    }
  }

  .text-field--number {
    max-width: 50px;

    input {
      text-align: right;
    }
  }

</style>