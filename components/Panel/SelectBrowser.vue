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
    title: {
      type: String,
      default: ''
    },
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
    selectedItemFields: {
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
    actionSelectItems (data) {
      let result = [];
      let key = this.dataSource.keyProperty
      let fields = this.selectedItemFields || []
      for (let i = 0; i < data.items.length; i++) {

        let item = {
          // title: data.items[i].title
        }
        item[key] = data.items[i][key]
        for (let j = 0; j < fields.length; j++) {
          let value = data.items[i][fields[j]]
          if (value) {
            item[fields[j]] = value
          }

        }
        result.push(item)
      }
      this.emitAction('SelectItems', result)
    }
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
      :header-value="title"
      :edit-header="false"
      :loading="loading"
      @action="onAction"
    ></PanelToolBar>
    <TableBrowser
      :data-source="dataSource"
      :columns="columns"
      :row-actions="currentRowActions"
      @action="onAction"
    />
  </v-container>
</template>
