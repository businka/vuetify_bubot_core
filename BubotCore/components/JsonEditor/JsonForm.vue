<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '@/helpers/mixinTemplate/action'
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
    if (!this.$store.state.hasOwnProperty(this.$options.name)) {
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
        id: this.modeParams._id['$oid']

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
    }
  }
}
</script>
<template>
  <JsonElem
    :schema="params.schema"
    :elem-value="data.item"
    elem-name=""
    :read-only="false"
    path=""
    @action="emitAction"
  />
</template>