<script>
import {defineAsyncComponent} from "vue"

export default {
  name: 'JsonArray',
  components: {
    JsonElem: defineAsyncComponent(() => import('./JsonElem.vue'))
  },
  props: {
    schema: Object,
    elemValue: {
      type: Array,
      default: function () {
        return []
      }
    },
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
  emits: ['action'],
  data: () => ({
    show: false,
    delimiter: '.'
  }),
  computed: {
    arrayLen () {
      return this.elemValue.length
    },
    title () {
      let value = ''
      if (!this.elemValue) {
        return ''
      }
      let _value = ''
      for (let i = 0; i <= Math.min(this.elemValue.length - 1, 1); i++) {
        switch (this.schema.items.type) {
          case 'string':
            _value = this.elemValue[i]
            break
          case 'object':
            _value = this.elemValue[i][this.schema.items['titleField'] || 'title']
            break
          default:
            return ''


        }
        if (value) {
          value += ', '
        }
        value += _value
      }
      if (this.elemValue.length > 2) {
        value += ', ...'
      }
      return value

    },
  },
  methods: {
    getDefault() {
      if (this.schema.default) {
        return this.schema.default
      }
      switch (this.schema.items.type) {
        case 'string':
          return ''
        case 'object':
          return {}
        case 'integer':
          return 0
        default:
          return ''
      }

    },
    addItem () {
      this.$emit('action', { name: 'UpdateProp', data: { action: 'append', path: this.path, value: this.getDefault() } })
    },
    deleteItem (index) {
      this.$emit('action', { name: 'UpdateProp', data: { action: 'delete', path: this.path, value: index } })
    }
  }

}
</script>
<style lang="scss" scoped>
  .expand-btn1 {
    margin: 6px 0 0 -6px;
    padding: 12px 0 0;
  }
</style>
<template>
  <v-card
    class="pa-0 ma-0"
    variant="flat"
  >
    <!--//todo.обработчики добавления / удаления элементов-->
    <v-card-actions
      class="pa-0 pb-1"
    >
      <div class="pa-0 ma-0 pt-4">
        <v-btn
          icon
          density="compact"
          @click="show = !show"
        >
          <v-icon>{{ show ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
        </v-btn>
      </div>
      <v-text-field
        :label="`${schema.title || elemName} [${elemValue.length}]`"
        :placeholder="schema['description']"
        density="compact"
        variant="underlined"
        hide-details
        disabled
        :value="title"
      />
      <div
        v-if="!readOnly"
        class="pa-0 ma-0 pt-4"
      >
        <v-btn
          v-if="show"
          density="compact"
          icon
          :disabled="readOnly"
          @click="addItem()"
        >
          <v-icon>{{ 'mdi-plus-circle' }}</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
    <v-expand-transition>
      <v-card
        v-show="show"
        class="ml-4 pb-1 pl-2"
        style="border-left: 1px solid var(--v-delimiter-base)"
        variant="flat"
        tile
      >
        <span
          v-for="(_elemValue, index ) in elemValue"
          :key="`${path}${delimiter}${index}`"
          class=""
        >
          <v-hover v-slot:default="{ hover }">
            <v-row
              no-gutters
              class="pl-2"
              style="flex-wrap: nowrap;"
            >
              <JsonElem
                class="flex-grow-1 flex-shrink-0"
                style="min-width: 100px; max-width: 100%;"
                :elemValue="_elemValue"
                elemName=""
                :schema="schema.items"
                :path="(path?path+delimiter:'')+index"
                :input-listeners="inputListeners"
                :array-elem="true"
                :level="level + 1"
                :read-only="readOnly?readOnly:schema.readOnly"
                :hide-read-only="hideReadOnly"
              />
              <v-btn
                v-if="!readOnly"
                class="flex-grow-0 flex-shrink-1"
                density="compact"
                icon
                :disabled="readOnly"
              >
                <v-icon
                  v-if="hover"
                  @click="deleteItem(index)"
                >
                  {{ 'mdi-delete' }}
                </v-icon>
              </v-btn>
            </v-row>
          </v-hover></span>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>
