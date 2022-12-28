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
        },
        rounded: {
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
  .v-btn__content {
    span {
      text-transform: none !important;
    }
  }
</style>

<template>
  <v-btn
    :icon="!!icon"
    :outlined="!!primary"
    :color="primary?'primary':''"
    dense
    :title="title"
    :rounded="rounded"
    small
    :text="!icon"
    @click.stop="emitAction(name, data)"
  >
    <v-icon v-if="icon">
      {{ icon }}
    </v-icon>
    <span v-else>{{ $t(title) }}</span>
  </v-btn>
</template>
