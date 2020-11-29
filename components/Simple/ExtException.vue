<script>
export default {
  name: 'ExtException',
  props: {
    error: {},
    typography: {
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
  <p
    v-if="typeof(error) === 'object' && error"
    :class="`error--text ${typography}`"
  >
    {{ $t(`Error.${error.message}`) }} {{ error.detail }}
  </p>
</template>
