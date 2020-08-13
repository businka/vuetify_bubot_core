<script>

// import { getSession } from './session'

export default {
  name: 'CurrentUserInToolbar',
  props: {
    hideNoUser: { type: Boolean, default: false }
  },
  data: function () {
    return {
      title: '',
      loading: false,
      visible: false
    }
  },
  computed: {
    session () {
      return this.$store.state['Session']
    },
    user () {
      try {
        return this.$store.state['Session']['user']['title']
      } catch (e) {
        return ''
      }

    }
  },
  watch: {
    user (value) {
      if (value) {
        this.visible = true
        this.title = value
      } else {
        this.visible = !this.hideNoUser
        this.title = this.$t('auth.SignIn')
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.session._id) {  // инициализируем сессию в хранилище
        this.$store.dispatch('Session/signIn', null, { root: true })
      }
    },
    signOut(){
      this.$store.dispatch('Session/signOut', null, { root: true })
    }
  }
}
</script>

<template>
  <v-menu
    v-if="visible"
    offset-y
  >
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

    <v-divider />
    <v-list
      subheader
      min-width="60px"
      dense
      class="pa-0"
    >
      <v-subheader>{{$t('Аккаунты')}}</v-subheader>
      <v-list-item
        max
        class="d-flex flex-row"
        @click.stop="signOut()"
      >
        <div class="pl-1 LangSelectorText">
          {{ $t('auth.SignOut') }}
        </div>
      </v-list-item>
    </v-list>


    <v-list
      min-width="60px"
      dense
      class="pa-0"
    >
      <v-divider />
      <v-list-item
        max
        class="d-flex flex-row"
        @click.stop="signOut()"
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
