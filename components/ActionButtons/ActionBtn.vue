<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
export default {
  name: 'ActionButton',
  mixins: [ActionMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
    },
    icon: {
      type: String,
      default: ''
    },
    primary: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss" scoped>
  /*.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).default-btn-action  {*/
  /*  border: thin solid #FF7033;*/
  /*  background-color: transparent;*/

  /*  &:hover {*/
  /*    background-color: #FDECD9;*/
  /*  }*/
  /*}*/
</style>

<template>
  <v-tooltip
    bottom
    :disabled="!title || !icon"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :icon="!!icon"
        :outlined="!!primary"
        :color="primary?'primary':''"
        dense
        small
        :text="!icon"
        class="mr-2"
        @click.stop="emitAction(name, data)"
        v-on="on"
      >
        <v-icon v-if="icon">
          {{ icon }}
        </v-icon>
        <span v-else>{{ $t(title) }}</span>
      </v-btn>
    </template>
    {{ $t(title) }}
  </v-tooltip>
</template>
