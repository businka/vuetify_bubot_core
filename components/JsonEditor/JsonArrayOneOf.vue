<script>
import {defineAsyncComponent} from "vue"

export default {
  components: {
    JsonElem: defineAsyncComponent(() => import('./JsonElem.vue'))
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
  },
  mounted() {
    if (this.schema && this.elemValue === undefined) {
      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value:[]}})
    }
  },
  methods: {
    addElem(data){
      console.log('append',this.path, data.default)
      this.$emit('action', {name: 'UpdateProp', data:{ action:'append', path: this.path, value:data.default}})
      this.show=true
    },
    removeElem(index){
      this.$emit('action', {name: 'UpdateProp', data:{ action:'delete', path: this.path, value: index}})
    },
    getElemSchema(value) {
      for (let key in this.schema.items.oneOf){
        if (Object.prototype.hasOwnProperty.call(this.schema.items.oneOf, key)) {
          if (this.schema.items.oneOf[key].uid === value.uid){
            return this.schema.items.oneOf[key]
          }
        }
      }
      console.error(`not supported array type "${value.uid}"`)  // todo: закидывать все ошибки на сервис
      return {}
    }

  }
}
</script>

<template>
  <v-card
    v-if="elemValue"
    class="pa-0 ma-0"
    flat
  >
    <!--//todo.обработчики добавления / удаления элементов-->
    <v-card-actions
      class="pa-0 pb-1"
    >
      <v-btn
        icon
        density="compact"
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
      </v-btn>
      <v-text-field
        :label="`${schema.title || elemName} (${elemValue.length})`"
        :placeholder="schema['description']"
        solo
        flat
        hide-details
        disabled
        :value="title"
      />
      <v-menu
        v-if="show || !elemValue.length"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            density="compact"
            icon
            v-on="on"
          >
            <v-icon>{{ 'mdi-plus-circle' }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in schema.items.oneOf"
            :key="index"
            @click="addElem(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
                  :elemValue="_elemValue"
                  :elemName="index+'.'"
                  :schema="getElemSchema(_elemValue)"
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
                  density="compact"
                  icon
                  @click="removeElem(index)"
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
