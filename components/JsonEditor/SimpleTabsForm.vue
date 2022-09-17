<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonEditorMixin from './JsonEditor.mixin'
// import {initDataSource} from '../DataSource/DataSourceLoader'
// import {objHasOwnProperty} from '../../helpers/baseHelper'
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
    },
    data: () => ({
        activeTab: 0,
    }),
    computed: {},
    mounted() {
        this.init()
    },
    methods: {
        emitInternalAction(action) {
            const content = this.$refs['content']
            content.onAction(action)
        },
        async actionUpdate() {
            this.itemFull = await this.source.update(this.itemFull)
        },
        async actionDefaultAction() {
            await this.source[this.defaultAction.name](this.itemFull)
            let _id = this.itemFull[this.dataSource.keyProperty]
            if (_id) {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRow: [_id]}})
            } else {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRows: true}})
            }
        },
        onClose() {
            this.$emit('action', {name: 'CloseForm', data: {name: this.name}})
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
      class="pa-0"
    >
      <JsonString
        v-if="schema && itemFull"
        :schema="schema.properties.title"
        :elem-value="itemFull.title"
        elem-name="title"
        :read-only="false"
        path="title"
        solo

        @action="onAction"
      ></JsonString>
      <v-spacer/>
      <v-toolbar-items
        v-if="toolBar"
        class="pa-0"
      >
        <component
          :is="item.template || 'ActionBtn'"
          v-for="(item, i) in toolBar.items"
          :key="i"
          v-bind=item
          @action="emitInternalAction"
        />
      </v-toolbar-items>
      <ActionBtn
        v-if="defaultAction"
        v-bind="defaultAction"
        primary
        @action="actionDefaultAction"
      />
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
      v-if="tabs"
      flat
      dense
      height="36"
      class="form-toolbar"
    >
      <!--      <v-toolbar-items>-->
      <v-btn
        text
        tile
        :class="activeTab===0? 'activeTab text-none' : 'Tab text-none'"
        @click="activeTab=0"
      >
        {{ tabs[0].title }}
      </v-btn>
      <!--      </v-toolbar-items>-->
      <v-spacer/>
      <v-toolbar-items>
        <v-container
          v-for="(tab, index) in tabs"
          :key="index"
          class="pa-0 ma-0"
        >
          <v-btn
            v-if="index>0"
            tile
            text
            :class="activeTab===index ? 'activeTab text-none' : 'Tab text-none'"
            @click="activeTab=index"
          >
            {{ tab.title }}
          </v-btn>
        </v-container>
      </v-toolbar-items>
    </v-toolbar>
    <v-container
      class="pa-0 ma-0 content"
      v-if="itemFull"
    >
      <v-container
        v-if="activeTab===0"
        class="pa-0 ma-0 h100"
      >
        <component
          :is="tabs[0].template"
          :schema="schema"
          :item="itemFull"
          :key-property="dataSource.keyProperty"
          v-bind="tabs[0]"
          class="h100"
          @action="onAction"
        />
      </v-container>
      <v-container
        v-for="(tab, index) in tabs"
        :key="index"
        class="pa-0 ma-0"
      >
        <component
          :is="tabs[index].template"
          v-if="index>0 &&index===activeTab"
          v-bind="tabs[index]"
          :schema="schema"
          :item="itemFull"
          :key-property="dataSource.keyProperty"
          class=""
          @action="onAction"
        />
      </v-container>
    </v-container>
    <!--    <component-->
    <!--      :is="content.template"-->
    <!--      v-if="content && itemFull"-->
    <!--      ref="content"-->
    <!--      v-bind="content"-->
    <!--      :schema="schema"-->
    <!--      :item="itemFull"-->
    <!--      :key-property="dataSource.keyProperty"-->
    <!--      @action="onAction"-->
    <!--    />-->
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

  .activeTab {
    border-bottom: 3px solid #FF7033;
  }

  .Tab {
  }
</style>