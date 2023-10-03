<script>
// import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'SearchField',
  // mixins: [ActionMixin],
  data() {
    return {
      text: ''
    }
  },
  methods: {
    onSearch() {
      this.$emit('changeFilter', {_search: this.text})
    },
    // onChange(value) {
    //   this.$emit('changeFilter', {_search: value})
    // },
    onClear() {
      this.text = ''
      this.onSearch()
    }
  }
}
</script>
<style lang="scss">

</style>

<template>
  <v-responsive
    class="mx-auto"
    max-width="250"
  >
    <v-text-field
      v-model="text"
      :placeholder="$t('Find') + '...'"
      density="compact"
      hide-details
      clearable
      append-inner-icon="mdi-magnify"
      @keydown.enter="onSearch"
      @keydown.esc="onClear"
      @click:clear="onClear"
      @click:append="onSearch"
    >
    </v-text-field>
  </v-responsive>
</template>
