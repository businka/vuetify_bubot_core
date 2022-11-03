<script>
import NavDrawer from '../NavDrawer/NavDrawer'
import LongOperations from '../LongOperations/LongOperations'
import LangSelector from '../Simple/LangSelector'
import LongOperationsBadge from '../LongOperations/LongOperationBadge'
import CurrentUser from '../Session/CurrentUserInToolbar'

export default {
  name: 'LayoutFormViewer',
  components: {
    NavDrawer,
    CurrentUser,
    LangSelector,
    LongOperations,
    LongOperationsBadge
  },
  computed: {
    uid () {
      let r = this.$route.params
      if (r.objName && r.objForm) {
        if (r.subtype) {
          return `${r.objName}/${r.subtype}/${r.objForm}`
        } else {
          return `${r.objName}/${r.objForm}`
        }

      } else {
        return this.$store.state.NavDrawer.default
      }

    },
    form () {
      if (this.uid) {
        return this.$store.getters['storeData']('Form', this.uid)
      }
      return {}
    }
  },
  // data: () => ({
  //   template: null
  // }),
  watch: {
    $route: function () {
      this.loadForm()
    },
    uid () {
      if (this.uid && this.$route.path === '/') {
        this.$router.push({ path: this.uid })
      }
    }
  },
  mounted () {
    this.loadForm()
  },
  methods: {
    loadForm () {
      if (this.uid && !this.$store.getters['storeData']('Form', this.uid)) {
        this.$store.dispatch(`Form/load`, {
          uid: this.uid
        }, { root: true })
      }
    },
    // emitInternalAction(action){
    //   const context = this.$refs[this.params.form]
    //   context.emitAction(action)
    // },
    // dispatchInternalAction(action){
    //   const context = this.$refs[this.params.form]
    //   context.dispatchAction(action)
    // }
  }
}
</script>

<style lang="scss" scoped>
  .height100 {
    height: 100%;
  }
</style>

<template>
  <v-main class="height100">
    <NavDrawer class="height100"/>
    <v-system-bar class="px-0">
      <v-spacer />
      <LongOperationsBadge />
      <CurrentUser small/>
      <v-divider vertical />
      <LangSelector />
    </v-system-bar>
    <v-row
      v-if="form"
      class="pa-0 ma-0 "
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
    <LongOperations />
  </v-main>
</template>
