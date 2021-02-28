<script>
export default {
  name: 'ExtException',
  props: {
    value: {},
    dialog: {
      type: Boolean,
      default: false
    },
    messageTypography: {
      type: String,
      default: 'h6'
    },
    detailTypography: {
      type: String,
      default: 'caption'
    },
  },
  data: function () {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
  /*.linkField .v-input__append-outer {*/
  /*margin-left: 0px;*/
  /*margin-right: 0px;*/
  /*}*/

</style>

<template>
  <div v-if="value">
    <v-snackbar
      v-if="dialog"
      multi-line
      color="error"
      top
      absolute
      timeout="-1"
      :value="true"
      class="pa-0 ma-0"
    >
      <v-row
        class="body-2 pl-3"
      >
        {{ $t(`ErrorMsg.${value.message}`) }}
      </v-row>
      <v-row
        class="caption pl-3 pt-1"
      >
        {{ value.detail }}
      </v-row>
      <template v-slot:action="{ attrs }">
        <v-btn
          dense
          small
          icon
          v-bind="attrs"
          @click="$emit('input', undefined)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <div
      v-else
      class="pa-0 ma-0"
    >
      <div :class="`error--text ${messageTypography}`">
        {{ $t(`ErrorMsg.${value.message}`) }}
      </div>
      <div :class="`error--text ${detailTypography}`">
        {{ value.detail }}
      </div>
    </div>
  </div>
</template>
