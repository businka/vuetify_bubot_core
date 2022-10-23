<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
    name: "Shedule",
    props: {
        autorun: {
            type: Boolean,
            default: true
        },
        autorun_rate: {
            type: String,
            default: 'hour'
        },
        autorun_interval: {
            type: Number,
            default: 1
        },
        autorun_time: {

        },
        last_run: {
            type: String,
        },
        last_duration: {
            type: String,
        },
        next_run: {
            type: String,
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
        }
    },
    methods: {
        onChangeAutorun: function(value) {
            this.emitAction('UpdateProp', {'action': 'change', 'path':'autorun','value': !!value})
        }
    }
}
</script>

<template>
    <v-row class="d-flex justify-start ma-0 pa-0" align="center">
        <v-checkbox
            v-model="autorun"
            hide-details
            single-line
            dense
            color="gray"
            label="Автозапуск каждые"
            class="pr-3 theme--light.v-label"
            style="margin-left: -5px;"
            @change="onChangeAutorun"
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
<!--        <span v-if="autorun_rate==='hour'" class="d-flex justify-start align-baseline">-->
        <span class="pt-2 theme--light v-label align-baseline">в</span>
        <v-text-field
          v-if="autorun_rate==='hour'"
            :value="autorun_time"
            type="time"
            single-line
            hide-details
            dense
            class="pl-3 text-field--time"
          @change="emitAction('UpdateProp', {'action': 'change', 'path':'autorun_time','value': $event})"
        >
        </v-text-field>
<!--         </span>-->
    </v-row>
</template>


<style lang="scss">
    .text-field--time {
        max-width: 100px ;

        input {
            max-height: 26px;
        }
    }
    .text-field--number {
        max-width: 50px;
        input {
            text-align:right;
        }
    }

</style>