<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
// import storage from '../Dialog/SelectBrowser/store'

export default {
  name: 'SelectBrowser',
  components: {
    PanelToolBar: () => import('../Simple/PanelToolBar'),
  },
  mixins: [ActionMixin],
  props: {
    toolBar: {
      type: Object,
      default: function () {
        return { items: [] }
      }
    },
    defaultAction: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hideOperationsPanel: {
      type: Boolean,
      default: false
    },
    alwaysShowOperationsPanel: {
      type: Boolean,
      default: false
    },
    operationsPanelItems: {
      type: Array,
      default: function () {
        return []
      }
    },
    rowActions: {
      type: Array,
      default: function () {
        return []
      }
    },
    rowActionsField: {
      type: String,
      default: 'rowViewer'
    },
    rowActivateHandler: {
      type: Object,
      default: function () {
        return {
          name: '',
          form: ''
        }
      }
    },
    toolbarItemsBeforeSearch: {
      type: Array,
      default: function () {
        return []
      }
    },
    toolbarItemsBeforeFilter: {
      type: Array,
      default: function () {
        return []
      }
    },
    filterFields: {
      type: Array,
      default: function () {
        return []
      }
    },
    hideSelectAll: {
      type: Boolean,
      default: false
    },
    hideToolbar: {
      type: Boolean,
      default: false
    },
    hideSearchString: {
      type: Boolean,
      default: false
    },
    showColumnHeaders: {
      type: Boolean,
      default: false
    },
    rowTemplate: {
      type: String,
      default: 'rowViewer'
    },
    dataSource: {
      type: Object,
      default: function () {
        return {}
      }
    },
    columns: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: () => ({
    visible: false,
    loading: false,
    active: [],
    avatar: null,
    open: [],
    props_schema: null,
    props_data: null,
    source: null,
    itemFull: {},
    resIndex: {},
    mainRes: [],
    serviceRes: [],
    actionForm: {},
    currentRowActions: [{
      name: 'SelectItems',
      title: 'SelectItem'
    }]
  }),
  computed: {},
  watch: {},
  mounted () {
    // this.init()
  },
  // beforeCreate () {
  // if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
  //   this.$store.registerModule(this.$options.name, storage)
  // }
  // },
  methods: {
    // async init () {
    // this.initStore()
    // await this.initForm()
    // await this.$store.dispatch(`${this.namespace}/read`, {
    //   store: this.store,
    //   params: this.params,
    //   id: this.modeParams.id
    //
    // }, { root: true })
    // },
    // actionUpdateProp ({ path, action, value }) {
    // this.$store.commit(`${this.store.namespace}/updateItemProps`, {
    //   uid: this.store.uid,
    //   path: 'item.links.' + path,
    //   action,
    //   value
    // }, { root: true })
    // },
    // viewItem () {
    //   this.visible = true
    // },
    // close () {
    //   this.visible = false
    // },
    // actionRemoteItemAction: function (action) {
    // this.$store.dispatch('LongOperations/run', {
    //   operation: action,
    //   name: `${this.$store.state.app}/${action.objName || this.store.mode.objName}/${action.name}`,
    //   data: { item: this.data.item }
    // }, { root: true })
    // },
    // async defaultAction () {
    // await this.dispatchAction({ name: 'AddDevice' })
    // this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    // },
    // onClose () {
    //   this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    // },
  }
}
</script>

<style lang="scss">
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-progress-linear
      :indeterminate="loading"
      height="2"
      background-color="header1_bg"
    />
    <PanelToolBar
      :tool-bar="toolBar"
      header-value="title"
      :edit-header="false"
      :loading="loading"
      @action="onAction"
    ></PanelToolBar>
    <Browser
      :data-source="dataSource"
      :columns="columns"
      :row-actions="currentRowActions"
      @action="onAction"
    />
  </v-container>
</template>
