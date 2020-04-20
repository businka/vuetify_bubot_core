<script>

import ActionMixin from '@/helpers/mixinTemplate/action'

export default {
  name: 'RightDrawerFormViewer',
  mixins: [ActionMixin],
  props: {
    params: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data: () => ({
    loading: false
  }),
  computed: {
    item() {
      return this.params.item
    },
    form() {
      return this.$store.getters['storeData']('Form', this.params.form)
    },
    width() {
      return this.form ? this.form.width || 600 : 600
    }
  },
  watch: {
    params() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.$store.getters['storeData']('Form', this.params.form)) {
        this.loading = true
        await this.$store.dispatch(`Form/load`, {
          uid: this.params.form,
          params: this.params
        }, { root: true })
        this.loading = false
      }
    },
    emitInternalAction(action){
      const context = this.$refs[this.params.form]
      context.emitAction(action)
    },
    dispatchInternalAction(action){
      const context = this.$refs[this.params.form]
      context.dispatchAction(action)
    },

  }
}
</script>
<style lang="scss">
  .v-btn--outlined {
    border: thin solid var(--v-default-base);
    background-color: var(--v-default-base) transparent;
    &:hover {
      background-color: var(--v-default-lighten5);
    }
  }
</style>

<template>
  <v-navigation-drawer
    right
    :width="width"
    absolute
    class="elevation-6"
    permanent
    :value="params.visible"
  >
    <v-progress-linear
      v-if="loading"
      height="2"
      indeterminate
    />
    <component
      :is="form.template"
      v-if="form && !loading"
      :ref="params.form"
      :params="form"
      :mode-params="params.item"
      :store-params="{
        form: params.form,
        uid: params.form,
      }"
      @action="emitAction"
    />
  </v-navigation-drawer>
</template>