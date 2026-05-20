<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonEditorMixin from './JsonEditor.mixin'
// import {initDataSource} from '../DataSource/DataSourceLoader'
import {objHasOwnProperty} from 'bubot-helper/BaseHelper'
// import schemaStorage from './ObjSchema.store'
import {defineAsyncComponent} from "vue"
import ActionBtn from "../ActionButtons/ActionBtn.vue";

export default {
  name: "JsonTabsForm",
  components: {
    ActionBtn,
    ParamEditor: defineAsyncComponent(() => import('../ParamsEditor/ParamsEditor')),
    JsonString: defineAsyncComponent(() => import('./JsonString')),
    // JsonObjectLink: defineAsyncComponent(() => import('/JsonObjectLink')),
    FormViewer: defineAsyncComponent(() => import('../FormViewer/FormViewer')),
  },
  mixins: [JsonEditorMixin, ActionMixin],
  props: {
    content: {
      type: Object,
    },
    tabs: {
      type: Array,
    },
    tabsAlign: {
      type: String,
      default: 'end'
    },
    tabsDirection: {
      type: String,
      default: 'horizontal'
    }
  },
  data: () => ({
    tabs_active_tab: 0,
    tabs_bind: [],
  }),
  computed: {},
  methods: {
    afterLoadData: async function () {
      this.tabs_bind = this.tabs
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
      await this.source.call(this.defaultAction.name, this.itemFull)
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
  <div class="tabs-grid-container">
    <v-progress-linear
        :indeterminate="loading"
        height="2"
        class="progress-grid-area"
    />
    <v-toolbar
        height="30"
        color="toolbar-bg"
        class="toolbar-grid-area">
      <JsonString
          v-if="schema && itemFull && schema.properties"
          :schema="schema.properties.title"
          :elemValue="itemFull.title"
          elemName="title"
          :read-only="false"
          path="title"
          solo
          class=""
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
            class="mr-2"
            @action="onAction"
        />
      </v-toolbar-items>
      <component
          v-if="defaultAction && itemChanged"
          :is="defaultAction.template ||'ActionBtn'"
          v-bind=defaultAction
          name="DefaultAction"
          primary
          @action="onAction"
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
        v-model="tabs_active_tab"
        align-tabs="end"
        height="36"
        bg-color="toolbar-bg"
        class="tabs-grid-area">

      <v-tab v-for="(tab, index) in tabs_bind" :key="index">
        {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tabs_active_tab" class="content-grid-area">
      <v-tabs-window-item
          v-for="(tab, index) in tabs_bind"
          :key="index"
          class="h-100"
      >
        <component
            :is="tabs_bind[index].template"
            :ref="`tab${index}`"
            v-bind="tabs_bind[index]"
            :schema="schema"
            :itemFull="itemFull"
            :key-property="dataSource.keyProperty"
            class="h-100"
            @action="onAction"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style scoped lang="scss">
.tabs-grid-container {
  height: 100%;
  display: grid;
  grid-template-rows: 2px 30px 36px 1fr; /* 4 строки для 4 элементов */
  overflow: hidden;
}

.form-toolbar {
  .v-toolbar__content {
    height: 30px !important;
    min-height: 30px !important;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    justify-content: end;
    /*border-bottom: thin solid #cccccc;*/
  }
}

/* Распределяем элементы по строкам (необязательно, можно полагаться на порядок) */
.progress-grid-area {
  grid-row: 1;
}

.toolbar-grid-area {
  grid-row: 2;
}

.tabs-grid-area {
  grid-row: 3;
}

.content-grid-area {
  grid-row: 4;
  overflow: auto;
  min-height: 0;
}


</style>