<template>
  <v-toolbar-title class="pr-2 header--text subtitle-1">
    {{ params.title }}
  </v-toolbar-title>
</template>
<script>
import ActionMixin from '@/helpers/mixinTemplate/action'

export default {
  name: "ActionButton",
  mixins: [ActionMixin],
  props: ['params'],

}
</script>

<style lang="scss">
  /*.jay-primary-border {*/
    /*border: 1px solid rgb(217, 71, 0);*/
  /*}*/

  /*.jay-button {*/
  /*font-size: 14px;*/
  /*}*/

</style>
