<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-tooltip
    bottom
    :disabled="!tooltipTitle"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="ma-0 mr-1"
        icon
        dense
        small
        @click.stop="emitAction({name: params.name, data: params.data})"
        v-on="on"
      >
        <v-icon>{{ params.icon }}</v-icon>
      </v-btn>
    </template>
    {{ tooltipTitle }}
  </v-tooltip>
</template>
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ActionButton',
  mixins: [ActionMixin],
  props: ['params'],
  computed: {
    tooltipTitle: function () {
      return this.params[`title_${this.$i18n.locale}`] || this.$t(this.params.title)
    }
  }
}
</script>

<style lang="scss">
  .jay-primary-border {
    border: 1px solid rgb(217, 71, 0);
  }

  /*.jay-button {*/
  /*font-size: 14px;*/
  /*}*/

</style>
