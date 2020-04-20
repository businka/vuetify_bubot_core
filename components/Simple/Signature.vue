<template>
    <v-card
            class="mx-auto"
            max-width="400"
            tile
    >
        <v-progress-linear :value="progress"></v-progress-linear>
        <v-list-item
                v-for="(cert, i) in certs"
                :key="i"
        >
            <v-list-item-content>
                <v-btn
                        @click.stop="sign(cert)"
                >Sign
                </v-btn>
                <v-list-item-title>{{cert.subjectName.CN}}</v-list-item-title>
                <v-list-item-subtitle>{{cert.subjectName.T}}</v-list-item-subtitle>
                <v-list-item-subtitle
                        v-if="cert.subjectName.CN !== `${cert.subjectName.SN} ${cert.subjectName.G}`"
                >
                    {{cert.subjectName.SN}} {{cert.subjectName.G}}

                </v-list-item-subtitle>
                <v-list-item-subtitle>{{cert.serialNumber}}</v-list-item-subtitle>
                <v-list-item-subtitle>с {{cert.fromDate}} по {{ cert.toDate}}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-card>
</template>


<script>
import '@/vendor/cadesplugin_api'
window.global_selectbox_container = new Array()
export default {
    name: 'PageIndex',
    data: () => ({
        ver: '',
        mode: null
    }),
    computed: {
        progress() {
            return this.mode ? this.$store.state[this.mode].progress : null
        },
        certs() {
            return this.mode ? this.$store.state[this.mode].certs : null
        }
    },
    methods: {
        async getCert() {
            // alert(11)
            await this.$store.dispatch(this.mode + '/getCertificates', { root: true })
            // alert(12)
        },
        async sign(payload) {
            // alert(1)
            let res = await this.$store.dispatch(this.mode + '/createSign', payload, { root: true })
            alert(res)
            console.log(res)
        }

    },
    mounted() {
        this.mode = (!!window.Promise && !!window.cadesplugin.CreateObjectAsync) ? 'cadesAsync' : 'cadesNpapi'
        try {
            this.getCert()
        } catch (err) {
            alert(err)
        }
    }
}
</script>
