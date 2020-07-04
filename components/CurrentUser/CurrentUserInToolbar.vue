<script>
import buxios from '../../helpers/buxios'
import { get_session } from '../../router/index'

export default {
  name: 'CurrentUserInToolbar',
  data: function () {
    return {
      title: '',
      loading: false
    }
  },
  beforeMount () {
    const cookies = get_session()
    console.log(cookies)
    if (cookies && cookies.session) {
      this.getCurrentUser(cookies)
    } else {
      this.setNoUser()
    }
  },
  methods: {
    setNoUser () {
      this.title = this.$t('auth.SignIn')
      this.loading = false
    },
    getCurrentUser: async function () {
      try {
        this.title = ''
        this.loading = true
        const response = await buxios.get('/api/AuthService/Catalog/User/get_current_user')
        this.title = response.data.title

      } catch (e) {
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
  .LangSelectorFlag {
    background: url("../../assets/flags.png");
    /*background-position: left center;*/
    background-repeat: no-repeat;
    width: 20px;
    height: 14px;
  }

  .LangSelectorFlag-ru {
    background-position: 0 -563px;
  }

  .LangSelectorFlag-en {
    background-position: 0 -763px;
  }

  .LangSelectorFlag-cn {
    background-position: 0 -123px;
  }

  .LangSelectorText {
    /*text-transform: uppercase;*/

    /*height: 24px;*/
  }

</style>
