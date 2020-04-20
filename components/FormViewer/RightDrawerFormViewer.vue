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
  computed: {
    item() {
      return this.params.item
    },
    form() {
      return this.$store.getters['storeData']('Form', this.params.form)
    }
  },
  // data: () => ({
  //   template: null
  // }),
  watch: {
    params() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.$store.getters['storeData']('Form', this.params.form)) {
        this.$store.dispatch(`Form/load`, {
          uid: this.params.form,
          params: this.params
        }, { root: true })
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
    async defaultAction(){
      await this.dispatchInternalAction({ name: this.form.components.defaultAction.name })
      this.emitAction({ name: 'CloseForm', data: { name: this.name, result: true } })
    },
    onClose() {
      this.emitAction({ name: 'CloseForm', data: { name: this.name, result: false } })
    }
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
    v-if="form"
    right
    :width="form.width || 400"
    absolute
    class="elevation-6"
    permanent
    :value="params.visible"
  >
    <v-toolbar
      height="30"
      flat
      dense
    >
      <v-spacer />
      <v-toolbar-items>
        <v-menu
          v-if="form.components && form.components.toolBar && form.components.toolBar.items"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              small
              v-on="on"
            >
              <v-icon>
                {{ 'mdi-dots-vertical' }}
              </v-icon>
            </v-btn>
          </template>
          <v-list
            dense
          >
            <v-list-item
              v-for="(tbItem, index) in form.components.toolBar.items"
              :key="index"
              @click="dispatchInternalAction({name: tbItem.name})"
            >
              <v-list-item-icon>
                <v-icon v-if="tbItem.icon">
                  {{ tbItem.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ tbItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-btn
        v-if="form.components.defaultAction"
        outlined
        dense
        rounded
        x-small
        class="mr-2"
        @click="defaultAction"
      >
        {{ form.components.defaultAction.title }}
      </v-btn>
      <v-toolbar-items>
        <v-btn
          icon
          dense
          small
          @click="onClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <component
      :is="form.template"
      v-if="form"
      :ref="params.form"
      :params="form"
      class="px-2"
      :mode-params="params.item"
      :store-params="{
        form: params.form,
        uid: params.form,
      }"
      @action="emitAction"
    />
  </v-navigation-drawer>
</template>