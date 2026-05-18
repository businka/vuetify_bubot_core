<script>
export default {
  name: 'FieldSearch',

  props: {
    // Значение поиска (v-model)
    modelValue: {
      type: String,
      default: ''
    },

    // Внешний вид
    width: {
      type: [String, Number],
      default: '200px'
    },
    placeholder: {
      type: String,
      default: 'Поиск...'
    },
    density: {
      type: String,
      default: "compact"
    },
    singleLine: {
      type: Boolean,
      default: true
    },
    hideDetails: {
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: false
    },

    // Режимы
    compact: {
      type: Boolean,
      default: false
    },
    autoCollapse: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      internalValue: this.modelValue,
      isExpanded: false,
      buttonTitle: 'Поиск',

    }
  },

  computed: {
    fieldWidth() {
      if (typeof this.width === 'number') {
        return `${this.width}px`
      }
      return this.width
    },

    fieldClasses() {
      return {
        'compact-field': this.compact,
        'expanded': this.isExpanded
      }
    },

    showPrefixIcon() {
      return this.compact || this.dense
    },

    showSearchIcon() {
      return !this.compact
    }
  },

  watch: {
    modelValue(newVal) {
      this.internalValue = newVal
    },

    internalValue(newVal) {
      // ЕМИТИМ ТОЛЬКО ИЗМЕНЕНИЕ СТРОКИ ПОИСКА
      this.$emit('input', newVal)

      // Автоматически сворачиваем если поле пустое
      if (this.compact && this.autoCollapse && !newVal && this.isExpanded) {
        this.collapseSearch()
      }
    }
  },

  methods: {
    expandSearch() {
      this.isExpanded = true
      // НЕ эмитим лишних событий

      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus()
        }
      })
    },

    collapseSearch(event) {
      if (!event || !event.target.closest('.v-icon')) {
        return
      }
      event.stopPropagation();
      if (!this.internalValue) {
        this.isExpanded = false
      }
      this.internalValue = ''
    },

    clearSearch() {
      this.internalValue = ''
      // НЕ эмитим лишних событий

      if (this.compact && this.autoCollapse) {
        this.collapseSearch()
      } else {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      }
    },

    onInput(value) {
      // Все изменения уже обрабатываются через watch
    },

    onEnter() {
      // НЕ эмитим - только внутренняя обработка
    },

    onEscape() {
      if (this.compact && this.isExpanded) {
        this.collapseSearch()
      } else if (this.internalValue) {
        this.clearSearch()
      }
      // НЕ эмитим
    },

    onBlur() {
      if (this.compact && this.autoCollapse && !this.internalValue) {
        this.collapseSearch()
      }
      // НЕ эмитим
    },

    focus() {
      if (this.compact && !this.isExpanded) {
        this.expandSearch()
      } else if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      }
    },

    blur() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.blur()
      }
    }
  },

  mounted() {
    if (this.compact && this.internalValue) {
      this.isExpanded = true
    }
  }
}
</script>

<template>
  <!-- Компактный режим: сначала кнопка -->
  <v-btn
      v-if="compact && !isExpanded"
      icon="mdi-magnify"
      size="small"
      @click="expandSearch"
      class="search-toggle-btn"
      :title="buttonTitle"
  />
  <!-- Поле поиска -->
  <v-text-field
      v-if="!compact || isExpanded"
      ref="searchInput"
      v-model="internalValue"
      :placeholder="placeholder"
      :density="density"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :autofocus="autofocus || (compact && isExpanded)"
      :style="{ width: fieldWidth }"
      :class="fieldClasses"
      @input="onInput"
      @keydown.enter="onEnter"
      @keydown.esc="onEscape"
      @blur="onBlur"
  >
    <template v-slot:prepend-inner>
      <v-icon
          v-if="showPrefixIcon"
          icon="mdi-magnify"
          :class="{ 'clickable': compact }"
          @click.stop="compact ? collapseSearch() : null"
          style="pointer-events: auto;"
      />
    </template>

    <template v-slot:append-inner>
      <div @click.stop>
        <v-icon
            v-if="internalValue || (compact && isExpanded)"
            icon="mdi-close"
            @click.stop="collapseSearch"

        />
      </div>
    </template>

  </v-text-field>
</template>


<style scoped>
.search-field {
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-field.compact-mode {
  position: relative;
}

.search-toggle-btn {
  margin: 0 4px;
  transition: all 0.2s ease;
}

.compact-field {
  transition: all 0.3s ease;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
}

.compact-field.expanded {
  max-width: 300px;
  opacity: 1;

}


.clickable {
  cursor: pointer;
}

/* Основной контейнер занимает всю высоту */
.search-field {
  height: 100%;
  min-height: 48px;
}

/* Стили для поля ввода */
.v-text-field {
  height: 100%;
}

/* Настройка внутренних элементов VField */
:deep(.v-field) {
  min-height: 48px !important;
  height: 48px !important;
  align-items: center;
  margin: 0 !important;
}

/* Поле ввода текста */
:deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 48px !important;
  height: 48px !important;
  line-height: 48px !important;
  margin: 0 !important;
}

/* Контейнеры для иконок */
:deep(.v-field__prepend-inner),
:deep(.v-field__append-inner) {
  align-items: center;
  height: 48px;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

/* Сами иконки */
:deep(.v-icon) {
  height: 48px;
  line-height: 48px;
}

/* Кнопка поиска в свернутом режиме */
.search-toggle-btn {
  height: 48px !important;
  width: 48px !important;
  margin: 0 !important;
  border-radius: 0;
}

:deep(.search-toggle-btn .v-btn__content) {
  height: 48px;
  line-height: 48px;
}

/* Для развернутого состояния */
.compact-field.expanded {
  height: 100%;
  max-width: 300px;
}

/* Кнопка закрытия (если используется отдельно) */
.close-btn {
  height: 48px;
  width: 48px;
  margin: 0;
}
</style>