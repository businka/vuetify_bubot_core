<script>
import { updateObject } from '../../helpers/baseHelper'

export default {
    name: 'FormViewer',
    props: {
        uid: {
            type: String
        },
        param: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data: () => ({
        _form: null,
        form: null

    }),
    watch: {
        param() {
            this.loadForm()
        }
    },
    computed: {

    },
    mounted() {
        this.loadForm()
    },
    methods: {
        loadForm: async function() {
            this.loading = true
            try {
                if (this.uid && !this.$store.getters['storeData']('Form', this.uid)) {
                    await this.$store.dispatch('Form/load', {
                        uid: this.uid
                    }, {root: true})
                }
                this._form = this.$store.getters['storeData']('Form', this.uid)
                this.form = updateObject({}, this._form, this.param)
            } finally {
                this.loading = false
            }
        },
    }
}
</script>

<style>
</style>

<template>
    <v-row
        v-if="form"
        class="pa-0 ma-0"
    >
        <v-col
            class="pa-0 ma-0"
            :xl="form.col_xl || '12'"
            :lg="form.col_lg || '12'"
            :sm="form.col_sm || '12'"
            :xs="form.col_xs || '12'"
        >
            <component
                :is="form.template"
                v-bind="form"
            />
        </v-col>
    </v-row>
</template>
