<script>
export default {
    name: "Shedule",
    props: {
        autorun: {
            type: Boolean,
            default: true
        },
        rate: {
            type: String,
            default: 'hour'
        },
        interval: {
            type: Number,
            default: 10
        },
        time: {},
    },
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
        showDialog() {
            this.dialog = true
            this.new_value = this.value ? Object.assign({}, this.value) : {};
        },
        onSave() {
            this.dialog = false
            this.$emit('input', this.rate ? this.new_value : null)
        }
    }
}
</script>

<template>
    <v-row class="d-flex justify-start ma-0 pa-0 align-baseline">
        <v-checkbox
            v-model="autorun"
            hide-details
            single-line
            dense
            label="Автозапуск каждые"
            class="pr-3"
        ></v-checkbox>
        <v-text-field
            v-model="interval"
            type="number"
            hide-details
            single-line
            dense
            class="pr-3"
            style="max-width: 60px"
        ></v-text-field>
        <v-select
            v-model="rate"
            hide-details
            single-line
            dense
            :items="rates"
            class="pr-3"
            style="max-width: 100px"
        ></v-select>
        <span v-if="rate==='hour'" class="d-flex justify-start align-baseline">
        в
        <v-text-field
            v-model="time"
            type="time"
            single-line
            hide-details
            dense
            style="max-width: 100px"
            class="pl-3"
        >
        </v-text-field>
         </span>
    </v-row>
</template>


<style scoped>

</style>