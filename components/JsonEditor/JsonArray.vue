<script>

export default {
  components: {
    'JsonElem': () => import('./JsonElem.vue')
  },
  props: {
    schema: Object,
    elemValue: Array,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
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

    }
  },
  methods: {
    deleteItem (index) {
      this.$emit('action', { name: 'UpdateProp', data: { action: 'delete', path: this.path, value: index } })
    }
  }

}
</script>
<style lang="scss" scoped>
  .expand-btn {
    margin: 6px 0 0 -6px;
    padding: 12px 0 0;
  }
</style>
<template>
  <v-card
    class="pa-0 ma-0"
    flat
  >
    <!--//todo.обработчики добавления / удаления элементов-->
    <v-card-actions
      class="pa-0 pb-1"
    >
      <div class="pa-0 ma-0 pt-4">
        <v-btn
          icon
          dense
          @click="show = !show"
        >
          <v-icon>{{ show ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
        </v-btn>
      </div>
      <v-text-field
        :label="`${schema.title || elemName} [${elemValue.length}]`"
        :placeholder="schema['description']"
        flat
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
          dense
          icon
          :disabled="readOnly"
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
        flat
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
                :elem-value="_elemValue"
                elem-name=""
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
                dense
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
