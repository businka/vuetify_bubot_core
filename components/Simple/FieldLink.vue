<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'FieldLink',
  mixins: [ActionMixin],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    params: {
      type: Object,
      default: () => ({
        form: '',
        handler: '',
        title: '',
        description: ''
      })
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
      selectionVisible: false
    }
  },
  methods: {
    viewItem () {
    },
    selectItem () {
      // this.selectionVisible = true
      const data = Object.assign(this.params, { visible: true, action: this.emitAction })
      this.emitAction({ name: 'ShowSelectForm', data })
    },
    clearItem () {
      this.$emit('input', null)
    },
    actionRowActivate (data) {
      this.actionCloseForm()
      this.$emit('input', data)
      console.log('input link-field ' + data.row.title)
    },
    actionCloseForm () {
      // this.selectionVisible = false
      this.emitAction({ name: 'ShowSelectForm', data: {} })
    },
  }
}
</script>
<style lang="scss">
  /*.linkField .v-input__append-outer {*/
  /*margin-left: 0px;*/
  /*margin-right: 0px;*/
  /*}*/

</style>//

<template>
  <div>
    <span
      v-if="!readOnly"
    >
      <v-text-field
        class="linkField pb-1"
        :value="value?value.title:''"
        :label="params.title"
        append-icon="mdi-chevron-up"
        clearable
        hide-details
        readonly
        :autofocus="autofocus"
        @keydown.enter.stop="emitAction({name:'Update'})"
        @keydown.escape.stop="emitAction({name:'Cancel'})"
        @keydown.up.stop="selectItem"
        @click="viewItem"
        @click:append="selectItem"
        @click:clear="clearItem"
      />
      <component
        :is="params.handler || 'RightDrawerFormViewer'"
        v-if="params.form && selectionVisible"
        :params="{form: params.form, visible:selectionVisible}"
        @action="onAction"
      />

    </span>
    <span
      v-else
    >
      {{ value[col.value] }}
    </span>
  </div>
</template>
