<script>
// import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'SearchField',
  // mixins: [ActionMixin],
  data() {
    return {
      text: '',
      searchTimeout: null,
      lastSearchText: ''
    }
  },
  watch: {
    text(newVal, oldVal) {
      // Очищаем предыдущий таймер
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Если символов больше 3
      if (newVal.length > 3) {
        this.searchTimeout = setTimeout(() => {
          // Проверяем, что текст не изменился за время ожидания
          if (this.text === newVal) {
            this.onSearch();
          }
        }, 2000); // 2 секунды
      }
    }
  },
  methods: {
    onSearch() {
      if (this.text === this.lastSearchText) return
      this.lastSearchText = this.text
      this.$emit('changeFilter', {Search: this.text})
    },
    onClear() {
      this.text = undefined
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
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
    />
  </v-responsive>
</template>
