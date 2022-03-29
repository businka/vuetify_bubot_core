<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import storage from './store'

export default {
  name: 'DocViewer',
  components: {
    DocHeader: () => import('./DocHeader'),
    BtnOrgLink: () => import('./BtnOrgLink'),
  },
  mixins: [BaseTemplateMixin, ActionMixin],
  data() {
    return {
      activeTab: 0,
      orgVisible: false,
    }
  },
  beforeMount() {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
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
      await this.read()
    },
    async read() {
      await this.$store.dispatch(`${this.namespace}/read`, {
        store: this.store,
        params: this.params,
        id: this.modeParams._id['$oid']
      }, { root: true })
      this.$store.commit(`${this.namespace}/indexParams`, { uid: this.store.uid }, { root: true })
    },
    actionUpdateProp({ path, action, value }) {
      this.$store.commit(`${this.store.namespace}/updateItemProps`, {
        uid: this.store.uid,
        path,
        action,
        value
      }, { root: true })
    },
    actionRefresh() {
      this.read()
      this.store = Object.assign({}, this.store)
    },
    actionChangeParam(data) {
      console.log('JsonEditor.onChange', data.n, data.v)
      if (this.data.item.params === undefined) {
        this.actionUpdateProp({ path: 'item/params', value: [] })
      }
      if (!this.data.paramsIndex) {
        this.$store.commit(`${this.store.namespace}/indexParams`, { uid: this.store.uid }, { root: true })
      }
      if (IndexObject.prototype.hasOwnProperty.call(this.data.params, data.n)) {
        this.$store.commit(`${this.store.namespace}/updateItemProps`, {
          uid: this.store.uid,
          path: `item/params/${this.data.paramsIndex[data.n]}`,
          action: 'change',
          value: data
        }, { root: true })
      } else {
        this.$store.commit(`${this.store.namespace}/updateItemProps`, {
          uid: this.store.uid,
          path: 'item/params',
          action: 'push',
          value: data
        }, { root: true })
        this.$store.commit(`${this.store.namespace}/indexParams`, { uid: this.store.uid }, { root: true })
      }
    },
    onOrgSelectBegin() {
      this.orgVisible = true
    },
    onOrgSelectEnd(action) {
      switch (action.name) {
        case 'RowActivate':
          this.orgVisible = false
          this.$store.commit(`${this.store.namespace}/updateItemProps`, {
            uid: this.store.uid,
            path: 'item/org',
            action: 'change',
            value: { _id: action.data.row._id, title: action.data.row.title }
          }, { root: true })
          break
        case 'CloseForm':
          this.orgVisible = false
          break
      }
    },
    emitInternalAction(action) {
      const context = this.$refs[this.store.uid]
      context.emitAction(action)
    },
    async defaultAction() {
      // await this.dispatchInternalAction({ name: this.form.components.defaultAction.name })
      // this.emitAction({ name: 'CloseForm', data: { name: this.name, result: true } })
      await this.dispatchAction({ name: 'update' })
      this.$emit('action', { name: 'CloseForm', data: { name: this.name, result: false } })
    },
    onClose() {
      this.$emit('action', { name: 'CloseForm', data: { name: this.name, result: false } })
    },
  }
}

</script>

<style lang="scss">
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

  .activeTab {
    border-bottom: 3px solid #FF7033;
  }

  .jay-tab {
    /*padding: 0 12px 0;*/
    /*font-size: 14px;*/
  }
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-progress-linear
      :indeterminate="data.loading"
      height="2"
      background-color="header1_bg"
    />
    <component
      :is="'RightDrawerFormViewer'"
      v-if="orgVisible"
      :params="{form: 'Organization/Select'}"
      @action="onOrgSelectEnd"
    />

    <v-toolbar
      height="30"
      flat
      dense
      class="header1_bg"
    >
      <v-spacer/>

      <v-btn
        v-if="!data.loading && data.item"
        text
        small
        class="text-none link--text caption"
        @click.stop="onOrgSelectBegin"
      >
        {{ data.itemFull.org && data.itemFull.org.title ? data.itemFull.org.title : 'Выберите организацию' }}
      </v-btn>
      <v-toolbar-items
        v-if="params.components.toolBar"
      >
        <component
          :is="item.template || 'ActionBtn'"
          v-for="item in params.components.toolBar.items"
          :key="item.name"
          :params="item"
          @action="emitInternalAction"
        />
      </v-toolbar-items>
      <v-btn
        v-if="params.components.defaultAction"
        outlined
        dense
        rounded
        x-small
        class="mr-2 btn_default_action"
        @click="defaultAction"
      >
        {{ params.components.defaultAction.title }}
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
    <v-toolbar
      v-if="params.components && params.components.tabs"
      flat
      dense
      height="30"
      class="header1_bg"
    >
      <v-toolbar-items>
        <v-btn
          text
          :class="activeTab===0? 'activeTab text-none' : 'Tab text-none'"
          @click="activeTab=0"
        >
          {{ params.components.tabs[0][`title_${$i18n.locale}`] || params.components.tabs[0].title }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer/>

      <v-toolbar-items>
        <v-btn
          v-for="(tab, index) in params.components.tabs"
          v-if="index>0"
          :key="index"
          text
          :class="activeTab===index ? 'activeTab text-none' : 'text-none'"
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
      <v-container
        v-show="activeTab===0"
      >
        <component
          :is="params.components.tabs[0].template"
          :ref="store.uid"
          :params="params.components.tabs[0]"
          :data="data"
          :store="store"
          @action="onAction"
        />
      </v-container>
      <v-container
        v-for="(tab, index) in params.components.tabs"
        v-if="index>0"
        :key="index"
      >
        <component
          :is="tab.template"
          v-show="index===activeTab"
          :key="index"
          :params="tab"
          :data="data"
          :store="store"
          @action="onAction"
        />
      </v-container>
    </v-container>
  </v-container>
</template>
