<script>
// import buxios from '../../BubotCore/helpers/buxios'
import ActionMixin from '../../helpers/mixinTemplate/action'
import BrowserActionMixin from '../Layouts/resources/BrowserActionMixin'
import { initDataSource } from '../DataSource/DataSourceLoader'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

const { objHasOwnProperty } = require('../../helpers/baseHelper')
const { findIndexInArrayObj } = require('../../helpers/ArrayHelper')

export default {
  name: 'TagBrowser',
  components: {},
  mixins: [ActionMixin, BrowserActionMixin],
  props: {
    hideOperationsPanel: {
      type: Boolean,
      default: false
    },
    // alwaysShowOperationsPanel: {
    //   type: Boolean,
    //   default: false
    // },
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
    dataSourceTag: {
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
    loading: false,
    tagGroups: [],
    tagGroupsOpened: [],
    activeGroup: null,


    singleSelect: false,
    // showOperationsPanel: this.alwaysShowOperationsPanel,
    selected: [],
    source: undefined,
    sourceTag: undefined,
    options: undefined,
    editForm: {},
    actionForm: {},
    active: [],
    open: [],
    editItem: undefined,
    items: [],
  }),
  methods: {
    init: function () {
      this.source = initDataSource(this.dataSource, this.$store)
      this.sourceTag = initDataSource(this.dataSourceTag, this.$store)
    },
    onActivable (group, tags) {
      if (this.activeGroup === group) {
        if (!tags.length) {
          this.activeGroup.__active = []
          this.activeGroup = null
          this.$emit('update', { tags })
        }
      }
      if (!tags.length) return
      this.activeGroup = group
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i] !== group) {
          this.items[i].__active = []
        }
      }
      this.$emit('update', { tags })
    },
    beginEditTag (item) {
      this.editItem = {
        item,
        value: item.name,
        updating: false
      }
    },
    endEditTag: async function () {
      this.updateItem = true
      let old_name = this.editItem.item.name
      let source = objHasOwnProperty(this.editItem.item, 'category') ? this.sourceTag : this.source

      try {
        this.editItem.item.name = this.editItem.value
        await source.update(this.editItem.item)
      } catch (e) {
        this.editItem.item.name = old_name
        console.error(e)
      }
      this.editItem = undefined
      this.updateItem = false
    },
    cancelEditTag () {
      if (this.editItem && !this.editItem.item.name) {// это новая запись
        this.deleteTag(this.editItem.item)
      }
      this.editItem = undefined
    },
    deleteTag (item) {
      let index = findIndexInArrayObj(item.__parent.__children, item._id, '_id')
      if (index >= 0) {
        item.__parent.__children.splice(index, 1)
        if (!item.__parent.__children.length) {
          Vue.delete(item.__parent, '__children')
        }
      }
    },
    addTag (group, item) {
      this.cancelEditTag()
      if (!objHasOwnProperty(item, '__children')) {
        Vue.set(item, '__children', [])
      }
      let _item = {
        parent: item.id,
        name: '',
        id: uuidv4(),
        __parent: item
      }
      item['__children'].push(_item)
      if (group.__open.indexOf(item._id) === -1) {
        group.__open.push(item._id)
      }
      this.beginEditTag(_item)
    },
    queryTagGroup: async function () {
      this.loading = true
      let resp = await this.source.query()
      let _query = []
      this.tagGroupsOpened = []
      for (let i = 0; i < resp.rows.length; i++) {
        let group = resp.rows[i]
        group['__active'] = []
        group['__open'] = []
        this.tagGroupsOpened.push(i)
        let children = this.queryTag(group)
        _query.push(children)
      }
      const tags_root = await Promise.all(_query)
      for (let i = 0; i < resp.rows.length; i++) {
        resp.rows[i]['__children'] = tags_root[i]
      }
      this.items = resp.rows

      this.tagGroups = resp.rows
      this.loading = false
    },
    queryTag: async function (item) {
      let filter = {}
      if (!item.category) { // this category
        filter = {
          category: item[this.dataSourceTag.keyProperty],
          parent: null,
        }
      } else {
        filter = {
          category: item.category[this.dataSource.keyProperty],
          parent: item[this.dataSourceTag.keyProperty],
        }
      }
      let resp = await this.sourceTag.query(filter)
      for (let i = 0; i < resp.rows.length; i++) {
        resp.rows[i]['__parent'] = item
        if (resp.rows[i]['group']) {
          resp.rows[i]['__children'] = []
        }
      }
      item.__children = resp.rows
      return resp.rows
    },
    startDrag (evt, item) {
      evt.dataTransfer.dropEffect = 'link'
      evt.dataTransfer.effectAllowed = 'link'
      evt.dataTransfer.setData('destType', item.type)
      evt.dataTransfer.setData('objType', 'Tag')
      evt.dataTransfer.setData('objTitle', item.name)
      evt.dataTransfer.setData('objId', item[this.dataSourceTag.keyProperty])
    },
  },
  watch: {
    dataSource () {
      if (this.options) {
        this.options.page = 1
      }
      this.init()
      if (this.options) {
        this.queryTagGroup()
      }
    },
    options () {
      this.source.changeProps(this.options)
      this.source.query()
    },
  },
  beforeMount () {
    this.init()
    this.queryTagGroup()
  },
}
</script>
<style lang="scss">
  .bu-content-tag-group {
    .v-expansion-panel--active {
      margin: 0;
    }

    .v-expansion-panel {
      margin: 0;

    }

    .v-expansion-panel-content__wrap {
      padding: 0;
    }

    .v-expansion-panel-header {
      min-height: 32px;
    }

    .v-expansion-panel--active {

    }

    .container {
      padding: 0;
    }
  }

  /*.category {*/
  /*  &.v-treeview {*/
  /*    .v-treeview-node__root {*/
  /*      min-height: 40px;*/
  /*      color: green;*/
  /*    }*/

  /*    &.v-treeview--dense {*/
  /*      .v-treeview-node__root {*/
  /*        min-height: 32px;*/
  /*        color: red;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*}*/

</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-progress-circular
      v-if="loading"
      indeterminate
    ></v-progress-circular>
    <v-expansion-panels
      v-model="tagGroupsOpened"
      multiple
      tile
      dense
      flat
      class="pa-0 ma-0 bu-content-tag-group"
    >
      <v-expansion-panel
        v-for="group in tagGroups"
        :key="group._id"
      >
        <v-expansion-panel-header
          hide-actions
          class="pa-2 ma-0 grey--text"
        >
          <template
            v-slot:default="{ open }"
          >
            <v-container class="text-right text-caption">
              <v-btn
                icon
                x-small
                :ripple="false"
                right
                plain
                block
              >
                <v-divider></v-divider>
                <v-icon>{{open?'mdi-chevron-down':'mdi-chevron-right'}}</v-icon>
                {{group.name}}
              </v-btn>
            </v-container>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="">
          <v-treeview
            dense
            activatable
            :active.sync="group.__active"
            :open.sync="group.__open"
            :items="group.__children"
            :item-key="dataSource.keyProperty"
            :load-children="queryTag"
            item-children="__children"
            @update:active="onActivable(group, $event)"
            class="category"
          >
            <template v-slot:label="{ item }">
              <v-hover
                v-slot="{ hover }"
              >
                <v-container
                  v-if="editItem && editItem.item===item"
                  class="pa-0 ma-0 d-flex align-baseline"
                >
                  <v-text-field
                    dense
                    flat
                    :rules=" [value => !!value || 'Required']"
                    single-line
                    autofocus
                    v-model="editItem.value"
                    @keydown.escape.stop="cancelEditTag"
                    @keydown.enter.stop="endEditTag"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        icon
                        small
                        @click="endEditTag"
                      >
                        <v-icon>
                          mdi-check-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        small
                        @click="cancelEditTag"
                      >
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-container>
                <v-container
                  v-else
                  class="pa-0 ma-0 d-flex align-baseline"
                >
                  <div
                    :draggable="true"
                    @dragstart="startDrag($event, item)"
                    class="pr-3"
                  >{{item.name}}
                  </div>
                  <v-btn
                    v-if="hover"
                    dense
                    icon
                    x-small
                    @click="addTag(group, item)"
                  >
                    <v-icon>mdi-plus-circle</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="hover"
                    dense
                    icon
                    x-small
                    @click="beginEditTag(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="hover"
                    dense
                    icon
                    x-small
                    @click="deleteTag(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>

                </v-container>
              </v-hover>
            </template>
          </v-treeview>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
