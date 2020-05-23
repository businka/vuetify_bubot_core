<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import storage from './store'


export default {
  name: 'JsonForm',
  components: {
    JsonElem: () => import('./JsonElem'),
    // JsonEditor: () => import('./JsonEditor'),
  },
  mixins: [BaseTemplateMixin, ActionMixin],
  // props: ['view'],
  data: () => ({
    visible: false,
    loading: false,
    active: [],
    avatar: null,
    open: [],
    props_schema: null,
    props_data: null
  }),
  computed: {
    // inputListeners: function () {
    //   var vm = this
    //   // `Object.assign` merges objects together to form a new object
    //   return Object.assign({},
    //     this.$listeners,
    //     {
    //       input: function (value) {
    //         vm.$emit('input', value)
    //       }
    //     }
    //   )
    // },
    items() {
      return this.props
    },
    selected() {
      if (!this.active.length) return undefined

      const id = this.active[0]

      return this.users.find(user => user.id === id)
    }
  },
  watch: {
    selected: 'randomAvatar',
    view: function(val) {
      console.log('action ' + val.name + ' view', val.id)
      this.loading = true

      if (!this.visible && this.item.id !== val.id) {
        val.item = {}
      }
      this.visible = true

      this.$http.get(`resource`, { params: { id: val.id } }).then(response => {
        this.item = response.data
        this.loading = false
      })
    }
  },
  mounted() {
    this.init()
  },
  beforeCreate() {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    async init() {
      this.initStore()
      await this.initForm()
      await this.$store.dispatch(`${this.namespace}/read`, {
        store: this.store,
        params: this.params,
        id: this.modeParams.id

      }, { root: true })
    },
    async actionUpdate() {
      await this.$store.dispatch(
        `${this.store.namespace}/update`,
        {
          store: this.store,
          params: this.params,
        },
        { root: true })
      this.emitAction({ name: '' })
    },
    actionUpdateProp({ path, action, value }) {
      this.$store.commit(`${this.store.namespace}/updateItemProps`, {
        uid: this.store.uid,
        path: 'item' + path,
        action,
        value
      }, { root: true })
    },
    // onChange(action, path, value) {
    //   this.$store.commit(`${this.namespace}/updateItemProps`, {
    //     uid: this.store.uid,
    //     action,
    //     path: 'item' + path,
    //     value
    //   }, { root: true })
    //   console.log('ress' + event)
    // },
    viewItem() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    emitInternalAction(action) {
      const context = this.$refs[this.store.uid]
      context.emitAction(action)
    },
    async defaultAction() {
      // await this.dispatchInternalAction({ name: this.form.components.defaultAction.name })
      // this.emitAction({ name: 'CloseForm', data: { name: this.name, result: true } })
      await this.dispatchAction({ name: 'update' })
      this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    },
    onClose() {
      this.$emit('action', { name: 'CloseEditForm', data: { name: this.name, result: false } })
    },
  }
}
</script>

<style lang="scss">
  .v-toolbar__content {
    padding-right: 0;
  }
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-progress-linear
      :indeterminate="data.loading"
      height="2"
      background-color="header1_bg"
    />
    <v-toolbar
      height="30"
      flat
      dense
      class="header1_bg pa-0"
    >
      <v-spacer/>
      <v-toolbar-items
        v-if="params.components.toolBar"
        class="pa-0"
      >
        <component
          :is="item.template || 'ActionBtn'"
          v-for="item in params.components.toolBar.items"
          :key="item.name"
          :params="item"
          @action="emitInternalAction"
        />
      </v-toolbar-items>
      <ActionBtnDefault
        v-if="params.components.defaultAction"
        :params="params.components.defaultAction"
        @action="defaultAction"
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
      <JsonElem
        :schema="params.schema"
        :elem-value="data.item"
        elem-name=""
        :read-only="false"
        path=""
        @action="emitAction"
      />
    </v-container>
  </v-container>

</template>
