<template>
  <v-btn
    rounded
    x-small
    class="jay-space-right btn_default_action"
    outlined
    @click.stop="emitAction({name: params.name, data: params.data || {}})"
  >
    {{ params[`title_${$i18n.locale}`] || '' }}
  </v-btn>
</template>
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: "ActionBtnDefault",
  mixins: [ActionMixin],
  props: ['params'],
}

</script>

<style lang="scss">
  .btn_default_action {
    border: thin solid #FF7033;
    background-color: transparent;
    &:hover {
      background-color: #FDECD9;
    }
  }

</style>
