<script>
import cades from './cades.mixin'

export default {
  name: 'CertSelect',
  mixins: [cades],
  props: ['cert'],
  data() {
    return {
      error: null,
      loading: false,
      filter: {},
    }
  },
  computed: {
    progress() {
      return (this.$store.state.cades && this.$store.state.cades.progress) ? this.$store.state.cades.progress : 0
    },
    certs() {
      return (this.$store.state.cades && this.$store.state.cades.certs) ? this.$store.state.cades.certs : []
    }
  },
  mounted() {
    this.initCades()
  },
  methods: {
    async getCerts() {
      this.loading = true
      try {
        await this.$store.dispatch('cades/getCertificates', this.filter)
      } catch (err) {
        this.error = err
      }
      this.loading = false
    },
    async init() {
      if (!this.certs.length) {
        this.getCerts()
      }
      return true
    },
    customFilter(item, listText) {
      const textOne = item.subjectNameCN ? item.subjectNameCN.toLowerCase() : ''
      const textTwo = item.subjectNameSN.toLowerCase()
      const searchText = listText.toLowerCase()
      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    }
  }
}
</script>
<template>
  <div>
    <v-autocomplete
      :value="cert"
      :items="certs"
      :filter="customFilter"
      outlined
      hide-details
      return-object
      item-text="subjectCN"
      placeholder="Выберите электронную подпись..."
      @input="$emit('input', $event)"
      @focus="init"
    >
      <template v-slot:no-data="">
        <v-card
          flat
          class="mx-auto my-auto text-center"
        >
          <v-progress-circular
            v-if="loading"
            :indeterminate="(!progress)"
            :value="progress"
          />
          <p
            v-if="!loading"
            class="caption"
          >
            Сертификаты не найдены
          </p>
        </v-card>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title>{{ item.subjectCN }}</v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>
