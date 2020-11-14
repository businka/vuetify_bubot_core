<template>
  <v-toolbar
    dense
    flat
  >
    <component
      :is="params.components.search.template"
      v-if="params.components.search"
      :params="params.components.search"
      @action="onAction"
    />
    <v-spacer />
    <component
      :is="params.components.filter.template"
      v-if="params.components.filter"
      :params="params.components.filter"
      :filter="filter"
      @action="onAction"
    />
  </v-toolbar>
</template>
<script>
// import { createNamespacedHelpers } from 'vuex'
// import { mapActions } from 'vuex'
import ActionMixin from '../../helpers/mixinTemplate/action'
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'

export default {
  name: 'FilterBar',
  // mounted () {
  //   // this.initForm()
  // },
  components: {
    'SearchForm': () => import('./SearchForm'),
    'FilterBtn': () => import('./FilterBtn'),
    'FilterBtnJsonEditor': () => import('./FilterBtnJsonEditor')
  },
  mixins: [ActionMixin],
  props: ['params', 'store', 'filter'],
  // data: () => ({
  //   massOperations: 'List',
  //   section: '-',
  //   page: '-',
  //   key: '-'
  // }),
  computed: {
    // form () {
    //   let form = this.$store.state.Browser[this.name]
    //   return form || {}
    //   // toolbar: {
    //   //   items: [
    //   //     // { name: 'test', title: 'test' }
    //   //   ],
    //   //   massOperations: false,
    //   //   massOperationsBarVisible: false
    //   // }
    // },
    // massOperationsBarVisible: {
    //   get: function () {
    //     return this.form ? this.form.toolbar.massOperationsBarVisible : false
    //   },
    //   set: function (val) {
    //     this.massOperationsBarVisible({ name: this.name, data: val })
    //   }
    // },
    // massIcon: function () {
    //   return this.massOperationsBarVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'
    // }
  },
  methods: {
    // ...mapActions('TabsBrowser', [
    //   'load',
    //   'setActiveTab'
    // ]),
    // initForm () {
    //   this.section = this.$route.params.section
    //   this.page = this.$route.params.page
    //   this.key = `${this.section}/${this.page}`
    //   this.load({ key: this.key, active: this.$route.query.tab })
    //   // this.activeTab = this.form.default
    // }
  }
}

</script>

<style lang="scss">
</style>
