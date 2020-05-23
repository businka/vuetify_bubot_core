<script>

export default {
  components: {
    'JsonElem': () => import('./JsonElem.vue')
  },
  props: ['schema', 'elemValue', 'elemName', 'path', 'inputListeners', 'arrayElem', 'level', 'readOnly'],
  data: () => ({
    show: false,
    delimiter: "."
  }),
  computed: {
    title() {
      let value = ''
      if (!this.elemValue) {
        return ''
      }
      switch (this.schema.items.type) {
        case 'string':
          for (let i = 0; i <= Math.min(this.elemValue.length - 1, 1); i++) {
            if (value) {
              value += ', '
            }
            value += this.elemValue[i]
          }
          if (this.elemValue.length > 2) {
            value += ', ...'
          }
          return value
      }
      return ''
    }
  }

}
</script>

<template>
  <v-card
    class="pa-0 ma-0"
    flat
  >
    <!--//todo.обработчики добавления / удаления элементов-->
    <v-card-actions
      class="pa-0 pb-1"
    >
      <v-btn
        class="pt-3"
        icon
        dense
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
      </v-btn>
      <v-text-field
        :label="`${schema.title || elemName} [${elemValue.length}]`"
        :placeholder="schema['description']"
        flat
        hide-details
        disabled
        :value="title"
      />
      <v-btn
        v-if="show"
        dense
        icon
        :disabled="readOnly"
      >
        <v-icon>{{ 'mdi-plus-circle' }}</v-icon>
      </v-btn>
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
        >
          <v-hover v-slot:default="{ hover }">
            <v-row class="pa-0 ma-0">
              <v-col
                class="pa-0 ma-0"
                cols="11"
              >
                <JsonElem
                  :elem-value="_elemValue"
                  :elem-name="index+'.'"
                  :schema="schema.items"
                  :path="`${path}${delimiter}${index}`"
                  :input-listeners="inputListeners"
                  :array-elem="true"
                  :level="level + 1"
                  :read-only="readOnly?readOnly:schema.readOnly"
                />
              </v-col>
              <v-col
                class="pa-0 ma-0"
                cols="1"
              >
                <v-btn
                  dense
                  icon
                  :disabled="readOnly"
                >
                  <v-icon v-if="hover">
                    {{ 'mdi-delete' }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-hover></span>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>
