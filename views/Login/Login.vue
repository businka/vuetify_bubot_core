<script>
import CertSelect from '../../components/Cert/CertSelect'
import cades from '../../components/Cert/cades.mixin'

export default {
  name: 'Login',
  components: { CertSelect },
  mixins: [cades],
  data() {
    return {
      cert: {},
      error: null,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initCades()
  },
  methods: {
    customFilter(item, queryText) {
      const textOne = item.title.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    async login() {
      this.error = null
      this.loading = true
      try {
        await this.$store.dispatch('User/login', {cert: this.cert})
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      } catch (err) {
        this.error = err
      }
      this.loading = false
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<template>
  <v-card
    class="mx-auto my-auto"
    max-width="500"
    min-width="500"
    raised
  >
    <CertSelect
      v-model="cert"
      class="pa-3"
    />
    <v-card-actions
      flat
      class="px-3 pb-3 pt-0"
    >
      <p
        v-if="error"
        class="red--text caption"
      >
        {{ error }}
      </p>
      <p
        v-else-if="cert.subjectT"
        class="secondary--text  caption"
      >
        {{ `${cert.subjectT} ${cert.subjectSN} ${cert.subjectG}` }}
      </p>
      <v-spacer />
      <v-btn
        :disabled="!cert"
        color="default"
        :loading="loading"
        @click="login"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>