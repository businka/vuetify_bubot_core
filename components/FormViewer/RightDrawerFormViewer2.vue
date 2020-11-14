<script>

import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'RightDrawerFormViewer',
  mixins: [ActionMixin],
  props: {
    uid: {
      type: String,
    },
    visible: {
      type: Boolean
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data: () => ({
    loading: false,
    error: ''
  }),
  computed: {
    form () {
      return this.$store.getters['storeData']('Form', this.uid)
    },
    width () {
      return this.form ? this.form.width || 600 : 600
    }
  },
  watch: {
    item () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      if (this.uid)
      if (!this.$store.getters['storeData']('Form', this.uid)) {
        this.loading = true
        this.error = ''
        try {
          await this.$store.dispatch(`Form/load`, {
            uid: this.uid,
          }, { root: true })

        } catch (err) {
          this.error = err
        }
        this.loading = false
      }
    },
    emitInternalAction (action) {
      const context = this.$refs[this.form]
      context.emitAction(action)
    },
    dispatchInternalAction (action) {
      const context = this.$refs[this.form]
      context.dispatchAction(action)
    },

  }
}
</script>
<style lang="scss" scoped>
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
    :value="visible"
  >
    <v-progress-linear
      v-if="loading"
      height="2"
      indeterminate
    />
    <component
      :is="form.template"
      v-if="form && !loading"
      :ref="form"
      :item="item"
      v-bind="form"
      @action="onAction"
    />
    <template
      v-if="error && !loading"
      class="pa-2"
    >
      <v-toolbar
        height="30"
        flat
        dense
        class="pl-2"
      >
        {{ error }}
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            dense
            small
            @click="$emit('action', { name: 'CloseEditForm' })"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </template>
  </v-navigation-drawer>
</template>
