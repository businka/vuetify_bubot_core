<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'BtnLink',
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
  data: function() {
    return {
      selectionVisible: false
    }
  },
  methods: {
    selectItem() {
      this.selectionVisible = true
    },
    actionRowActivate(data) {
      this.actionCloseForm()
      this.$emit('input', data)
      console.log('input link-field ' + data.row.title)
    },
    actionCloseForm() {
      this.selectionVisible = false
    },
  }
}
</script>
<style lang="scss">
  /*.linkField .v-input__append-outer {*/
    /*margin-left: 0px;*/
    /*margin-right: 0px;*/
  /*}*/

</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-btn
      text
      small
      :disabled="readOnly"
      class="text-none"
      @click="selectItem"
    >
      {{ value.title }}
    </v-btn>
    <component
      :is="params.handler || 'RightDrawerFormViewer'"
      v-if="params.form && selectionVisible"
      :params="{form: params.form, visible:selectionVisible}"
      @action="onAction"
    />
  </v-container>
</template>
