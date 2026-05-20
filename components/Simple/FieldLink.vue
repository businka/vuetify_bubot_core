<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import {isEmptyObject} from 'bubot-helper/BaseHelper'
import {defineAsyncComponent} from "vue"

export default {
  name: 'FieldLink',
  components: {
    RightDrawerFormViewer3: defineAsyncComponent(() => import('../FormViewer/RightDrawerFormViewer3')),
  },
  mixins: [ActionMixin],
  emits: ['input'],
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    formHandler: {
      type: String,
      default: 'RightDrawerFormViewer3'
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    titleField: {
      type: String,
      default: 'Title'
    },
    fields: {
      type: Array,
      default: () => ([])
    },
    formUid: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selectionFormVisible: false
    }
  },
  computed: {
    _title() {
      if (isEmptyObject(this.value)) {
        return ''
      }
      return this.value[this.titleField || 'Title'] || this.value['_id']
    }
  },
  methods: {
    viewItem() {
    },
    beginSelect() {
      this.selectionFormVisible = true
      // const data = Object.assign(this.params, { visible: true, action: this.onAction })
      // this.emitAction('ShowSelectForm', data)

    },
    clearItem() {
      this.$emit('input', null)
    },
    actionRowActivate(data) {
      this.actionCloseForm()
      this.$emit('input', data)
      console.log('input link-field ' + data.row.title)
    },
    actionSelectItems(data) {
      let _selectValue = null
      if (data && data.length) {
        if (this.multiSelect) {
          _selectValue = data
        } else {
          _selectValue = data[0]
        }
      }
      this.$emit('input', _selectValue)
      this.actionCloseForm()
    },
    // eslint-disable-next-line no-unused-vars
    actionCloseForm(data, component) {
      this.selectionFormVisible = false
    },
  }
}
</script>

<template>
    <v-text-field
        :model-value="_title"
        :label="label"
        :placeholder="description"
        :append-inner-icon="readOnly?undefined:'mdi-chevron-up'"
        :clearable="!readOnly"
        hide-details
        density="compact"
        :readonly="readOnly"
        :autofocus="autofocus"
        @keydown.enter.stop="emitAction({name:'Update'})"
        @keydown.escape.stop="emitAction({name:'Cancel'})"
        @keydown.up.stop="beginSelect"
        @click="viewItem"
        @click:append-inner="beginSelect"
        @click:clear="clearItem"
    />
    <component
        v-if="selectionFormVisible"
        :is="formHandler"
        :visible="selectionFormVisible"
        :form-uid="formUid"
        :form-data="formData"
        @action="onAction($event, 'selectForm')"
    />
</template>

<style lang="scss">
</style>
