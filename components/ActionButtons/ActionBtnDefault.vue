<template>
  <v-btn
    id="default-btn-action"
    rounded
    x-small
    class="mr-1"
    outlined
    @click.stop="emitAction({name: params.name, data: params.data || {}})"
  >
    {{ params[`title_${$i18n.locale}`] || $t(params.title) }}
  </v-btn>
</template>
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ActionBtnDefault',
  mixins: [ActionMixin],
  props: ['params'],
}

</script>

<style lang="scss">

  #default-btn-action {
    border: thin solid #FF7033;
    background-color: transparent;

    &:hover {
      background-color: #FDECD9;
    }
  }
</style>
