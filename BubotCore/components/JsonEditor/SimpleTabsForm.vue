<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonEditorMixin from './JsonEditor.mixin'
// import {initDataSource} from '../DataSource/DataSourceLoader'
import {objHasOwnProperty} from '../../../Helpers/BaseHelper'
// import schemaStorage from './ObjSchema.store'


export default {
    name: "SimpleTabsForm",
    components: {
        ParamEditor: () => import('../ParamsEditor/ParamsEditor'),
        JsonString: () => import('./JsonString'),
        // JsonObjectLink: () => import('/JsonObjectLink'),
        FormViewer: () => import('../FormViewer/FormViewer'),
    },
    mixins: [JsonEditorMixin, ActionMixin],
    props: {
        content: {
            type: Object,
        },
        tabs: {
            type: Array,
        },
        right: {
            type: Boolean
        },
        vertical: {
            type: Boolean
        }
    },
    data: () => ({
        tabsActiveTab: 0,
        tabsBind: []

    }),
    computed: {},
    methods: {
        afterLoadData: async function () {
            this.tabsBind = this.tabs
        },
        emitInternalAction: function (action) {
            const content = this.$refs['content']
            content.onAction(action)
        },
        // async actionUpdate() {
        //     for (let i = 0; i < this.tabs.length; ++i) {
        //         await this.$refs[`tab${i}`].actionUpdate()
        //     }
        //     this.itemFull = await this.source.update(this.itemFull)
        // },
        actionDefaultAction: async function () {
            for (let i = 0; i < this.tabs.length; ++i) {
                if (this.$refs[`tab${i}`] && objHasOwnProperty(this.$refs[`tab${i}`][0], this.defaultAction.name)) {
                    await this.$refs[`tab${i}`][0][this.defaultAction.name]()
                }
            }
            await this.source[this.defaultAction.name](this.itemFull)
            let _id = this.itemFull[this.dataSource.keyProperty]
            if (_id) {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRow: [_id]}})
            } else {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRows: true}})
            }
        },
    }
}
</script>

<template>
  <v-container class="pa-0 ma-0 h100">
    <v-progress-linear
      :indeterminate="loading"
      height="2"
      background-color="header1_bg h100"
    />
    <v-toolbar
      height="30"
      flat
      dense
      class="pa-0 d-flex form-toolbar"
    >
      <JsonString
        v-if="schema && itemFull && schema.properties"
        :schema="schema.properties.title"
        :elem-value="itemFull.title"
        elem-name="title"
        :read-only="false"
        path="title"
        solo
        class=""
        @action="onAction"
      ></JsonString>
      <v-toolbar-items
        v-if="toolBar"
        class="pa-0 justify-end"
      >
        <component
          :is="item.template || 'ActionBtn'"
          v-for="(item, i) in toolBar.items"
          :key="i"
          v-bind=item
          class="mr-2"
          @action="onAction"
        />
      </v-toolbar-items>
      <ActionBtn
        v-if="defaultAction"
        v-bind="defaultAction"
        rounded
        primary
        @action="actionDefaultAction"
      />
      <v-toolbar-items>
        <v-btn
          icon
          @click="onClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-tabs
      v-if="itemFull"
      :right="right"
      :vertical="vertical"
      height="36"
      class="Tab h100"
    >
      <v-tab
        v-for="(tab, index) in tabs"
        :key="index"
      >
        {{ tab.title }}
      </v-tab>
      <v-tab-item
        v-for="(tab, index) in tabs"
        :key="index"
        class="pa-0 ma-0 h100"
      >
        <component
          :is="tabs[index].template"
          :ref="`tab${index}`"
          v-bind="tabs[index]"
          :schema="schema"
          :item="itemFull"
          :key-property="dataSource.keyProperty"
          class=""
          @action="onAction"
        />

      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<style lang="scss">
  .form-toolbar {
    .v-toolbar__content {
      padding-left: 0;
      padding-right: 0;
      border-bottom: thin solid #cccccc;
    }
  }

  .h100 {
    height: 100%;
  }

  .content {
    height: calc(100vh - 68px);
  }

  .v-tab {
    text-transform: none !important;
  }

  .Tab {
    height: calc(100vh - 32px);

    .v-tabs-bar {
      border-bottom: thin solid #cccccc;
    }
  }
</style>