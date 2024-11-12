<script>

// import { getSession } from './session'
import ActionMixin from '@/BubotCore/helpers/mixinTemplate/action'
import {redirectToSignIn} from './session'

export default {
  name: 'CurrentUserInToolbar',
  props: {
    hideNoUser: {type: Boolean, default: false},
    xSmall: {type: Boolean, default: false},
    small: {type: Boolean, default: false},
    large: {type: Boolean, default: false},
  },
  mixins: [ActionMixin],
  data: function () {
    return {
      title: '',
      loading: false,
      visible: false

    }
  },
  computed: {
    session() {
      return this.$store.state['Session']
    },
    userTitle() {
      try {
        return this.session.user.title
      } catch (e) {
        return 'NoUser'
      }

    }
  },
  watch: {
    user(value) {
      if (value) {
        this.visible = true
        this.title = value
      } else {
        this.visible = !this.hideNoUser
        this.title = this.$t('auth.SignIn')
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.session._id) {  // инициализируем сессию в хранилище
        this.$store.dispatch('Session/onSignIn', null, {root: true})
      }
    },
    signIn() {
      redirectToSignIn()
    },
    signOut() {
      this.$store.dispatch('Session/signOut', null, {root: true})
    }
  }
}
</script>
<template>
  <v-menu
      offset-y
      @action="alert(1)"
  >
    <template v-slot:activator="{ on }">
      <v-btn
          text
          dense
          tile
          min-width="60px"
          class="UserMenu"
          :x-small="xSmall"
          :small="small"
          :large="large"
          v-on="on"
      >
        <div class="pl-1 LangSelectorText">
          {{ userTitle }}
        </div>
      </v-btn>
    </template>
    <slot/>
    <v-list
        min-width="60px"
        dense
        class="pa-0"
    >
      <v-list-item
          v-if="session && session.user"
          max
          class="d-flex flex-row"
          @click.stop="signOut()"
      >
        <div class="pl-1 LangSelectorText">
          {{ $t('Auth.SignOut') }}
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
  <!--    <v-btn-->
  <!--      v-else-if="!hideNoUser"-->
  <!--      text-->
  <!--      tile-->
  <!--      dense-->
  <!--      :x-small="xSmall"-->
  <!--      :small="small"-->
  <!--      :large="large"-->
  <!--      @click.stop="signIn"-->
  <!--    >-->
  <!--      {{ $t('auth.SignIn') }}-->
  <!--    </v-btn>-->
</template>

<style lang="scss">
.v-btn .UserMenu {
  height: 14px;
  min-width: 60px;
}

.LangSelectorText {
  text-transform: none;
}
</style>
