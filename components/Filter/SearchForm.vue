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
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'SearchForm',
  mixins: [ActionMixin],
  data () {
    return {
      text: '',
      dense: false
    }
  },
  methods: {
    onSearch () {
      this.emitAction({ name: 'ChangeFilter', data: { search: this.text } })
    },
    onChange (value) {
      this.emitAction({ name: 'ChangeFilter', data: { search: value } })
    },
    onClear () {
      this.emitAction({ name: 'ChangeFilter', data: { search: "" } })
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
