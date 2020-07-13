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
      if (r.objType && r.objName && r.objForm) {
        return `${r.objType}/${r.objName}/${r.objForm}`
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

<style>
</style>

<template>
  <v-main>
    <NavDrawer />

    <v-system-bar class="px-0">
      <v-spacer />
      <LongOperationsBadge />
      <CurrentUser />
      <v-divider vertical />
      <LangSelector />
    </v-system-bar>
    <component
      :is="form.template"
      v-if="form"
      :params="form"
      :store-params="{
        form: uid,
        uid: uid,
      }"
    />
    <LongOperations />
  </v-main>
</template>
