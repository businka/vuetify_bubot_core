<template>
  <v-text-field
    v-model="text"
    :placeholder="$t('Find') + '...'"
    dense
    hide-details
    clearable
    append-icon="mdi-magnify"
    style="max-width: 250px"
    @change="onChange"
    @click:clear="onClear"
    @click:append="onSearch"
  >
  </v-text-field>
</template>

<script>
// import ActionMixin from '@/BubotCore/helpers/mixinTemplate/action'

export default {
  name: 'SearchField',
  // mixins: [ActionMixin],
  data () {
    return {
      text: '',
      dense: false
    }
  },
  methods: {
    onSearch () {
      this.$emit('changeFilter', { _search: this.text })
    },
    onChange (value) {
      this.$emit('changeFilter', { _search: value })
    },
    onClear () {
      this.$emit('changeFilter', { _search: '' })
    }
  }
}
</script>
<style lang="scss">
  /*.q-field--dense {*/
  /*height: 22px;*/
  /*}*/

  /*.q-field--standout {*/
  /*border-radius: 14px;*/
  /*}*/

  /*.q-field--control {*/
  /*border-radius: 14px;*/
  /*height: 22px;*/
  /*}*/

  /*.jay-button {*/
  /*font-size: 14px;*/
  /*}*/

</style>
