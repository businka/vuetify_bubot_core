<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '@/helpers/mixinTemplate/action'
import storage from './store'

export default {
  name: 'TabBrowser',
  components: {},
  mixins: [BaseTemplateMixin, ActionMixin],
  data() {
    return {
      activeTab: 0,
      orgVisible: false,
    }
  },
  beforeMount() {
    if (!this.$store.state.hasOwnProperty(this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initStore()
      await this.initForm()
    },
    emitInternalAction(action) {
      const context = this.$refs[this.store.uid]
      context.emitAction(action)
    }
  }
}

</script>

<style lang="scss">

  .bordered {
    border-bottom: thin solid #cccccc;
  }

  .v-toolbar__content {
    padding-right: 0;
  }

  .border-bottom {
    padding: 0;
  }

  .jay-toolbar {
    min-height: 36px;
  }

  .not-padding {
    padding: 0;
  }

  .jay-bordered {
    /*border-bottom: 1px solid $grey-3;*/
  }

  .TabBrowserActiveTab {
    border-bottom: 3px solid #FF7033;
    font-weight: bold;
    /*letter-spacing: 0;*/
  }

  .TabBrowserTab {
    border-bottom: 3px solid transparent;
    font-weight: normal;
    /*letter-spacing: 0;*/
  }

  .btn_default_action {
    border: thin solid #FF7033;
    background-color: transparent;
    &:hover {
      background-color: #FDECD9;
    }
  }

  .jay-tab {
    /*padding: 0 12px 0;*/
    /*font-size: 14px;*/
  }
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-toolbar
      v-if="params.components && params.components.tabs"
      flat
      dense
      height="30"
      class="pl-2 bordered"
      style="border-color:#cccccc"
    >
      <component
        :is="item.template || 'ActionBtn'"
        v-for="item in params.components.tabs[activeTab].components.toolBar.items"
        :key="item.name"
        :params="item"
        @action="emitInternalAction"
      />

      <v-spacer/>

      <v-toolbar-items>
        <v-btn
          v-for="(tab, index) in params.components.tabs"
          :key="index"
          text
          :class="activeTab===index ? 'text-none TabBrowserActiveTab ' : 'text-none TabBrowserTab'"
          @click="activeTab=index"
        >
          {{ tab[`title_${$i18n.locale}`] || tab.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container
      v-if="!data.loading"
      class="pa-0 ma-0"
    >
      <component
        :is="params.components.tabs[activeTab].template"
        :ref="store.uid"
        :params="params.components.tabs[activeTab]"
        :data="data"
        :store="store"
        @action="emitAction"
      />
    </v-container>
  </v-container>
</template>
