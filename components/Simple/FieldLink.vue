<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
// import {objHasOwnProperty} from '../../helpers/baseHelper'

export default {
  name: 'FieldLink',
  components: {
    RightDrawerFormViewer3: () => import('../FormViewer/RightDrawerFormViewer3'),
  },
  mixins: [ActionMixin],
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
    titleField: {
      type: String,
      default: 'title'
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
  methods: {
    viewItem () {
    },
    beginSelect () {
      this.selectionFormVisible = true
      // const data = Object.assign(this.params, { visible: true, action: this.onAction })
      // this.emitAction('ShowSelectForm', data)

    },
    clearItem () {
      this.$emit('input', null)
    },
    actionRowActivate (data) {
      this.actionCloseForm()
      this.$emit('input', data)
      console.log('input link-field ' + data.row.title)
    },
    actionSelectItems (data) {
      let _selectValue = null
      if (data.length) {
        if (this.multiSelect){
          _selectValue = data
        } else {
          _selectValue = data[0]
        }
      }
      this.$emit('input', _selectValue)
      this.actionCloseForm()
    },
    // eslint-disable-next-line no-unused-vars
    actionCloseForm (data, component) {
      this.selectionFormVisible = false
    },
  }
}
</script>

<style lang="scss">
</style>

<template>
  <div>
    <v-text-field
      class="linkField pb-1"
      :value="value?value[titleField||'title']:''"
      :label="label"
      append-icon="mdi-chevron-up"
      clearable
      hide-details
      :disabled="readOnly"
      flat
      readonly
      :autofocus="autofocus"
      @keydown.enter.stop="emitAction({name:'Update'})"
      @keydown.escape.stop="emitAction({name:'Cancel'})"
      @keydown.up.stop="beginSelect"
      @click="viewItem"
      @click:append="beginSelect"
      @click:clear="clearItem"
    />
    <component
      :is="formHandler"
      v-if="selectionFormVisible"
      :form-uid="formUid"
      :form-data="formData"
      @action="onAction($event, 'selectForm')"
    />
  </div>
</template>
