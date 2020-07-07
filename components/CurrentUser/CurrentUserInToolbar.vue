<script>
import buxios from '../../helpers/buxios'
import { get_user } from '../../router/index'

export default {
  name: 'CurrentUserInToolbar',
  data: function () {
    return {
      title: '',
      loading: false
    }
  },
  beforeMount () {
    console.log(get_user())
    if (get_user()) {
      this.getCurrentUser()
    } else {
      this.setNoUser()
      console.log('f1f')
    }
  },
  methods: {
    setNoUser () {
      this.title = this.$t('auth.SignIn')
      this.loading = false
    },
    async getCurrentUser () {
      try {
        this.title = ''
        this.loading = true
        const response = await buxios.get('/api/AuthService/Catalog/User/current_user')
        this.title = response.data.title

      } catch (e) {
        console.error(e)
        this.setNoUser()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn
        text
        dense
        x-small
        v-on="on"
      >
        <div class="pl-1 LangSelectorText">
          {{ title }}
        </div>
      </v-btn>
    </template>

    <v-list
      min-width="60px"
      class="pa-0"
    >
      <v-divider />
      <v-list-item
        max
        class="d-flex flex-row"
        @click="logout()"
      >
        <div class="pl-1 LangSelectorText">
          {{ $t('auth.SignOut') }}
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss">
</style>
