<script>
import {defineAsyncComponent} from "vue"

export default {
  name: 'JsonObject',
  components: {
    JsonElem: defineAsyncComponent(() => import('./JsonElem.vue'))
  },
  props: {
    schema: Object,
    elemValue: {
      validator: function (value) {
        const result = (typeof value === 'object')
        if (!result)
          console.warn(`JsonObject validator warn:${value}`)
        return result
      }
    },
    elemName: String,
    path: String,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean,
    hideReadOnly: Boolean
  },
  data() {
    return {
      linkListData: null,
      options: null,
      show: false,
      delimiter: '.'
    }
  },
  computed: {
    _elemName() {
      let _value = this.elemValue
      if (this.arrayElem || this.path) { // если показываем объект являющийся элементом массива, показываем узел name или значения первого из схемы
        if (Object.prototype.hasOwnProperty.call(this.elemValue, 'title')) {
          return this.elemValue.name
        } else {
          for (let elem in this.schema.properties) {
            if (Object.prototype.hasOwnProperty.call(this.schema.properties, elem)) {
              return this.elemValue[elem]
            }
          }
        }
      } else {
        return this.elemName
      }
      return _value
    },
    value: {
      get() {
        return this.elemValue.title
      },
      set(value) {
        this.$emit('action', {
          name: 'UpdateProp',
          data: {action: 'change', path: this.path, value: this.linkListData[value]}
        })
      }
    }
  },
  mounted() {
    if (this.schema && this.elemValue === undefined) {
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value: {}}})
    }
  },
  // beforeCreate: function () {
  //   this.$options.components.JsonElem = require('./JsonElem.vue').default
  // },
  methods: {
    onChange(value) {
      console.log('oc2' + this.path + '-' + value)
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    },
    filterFn(val, update) {
      if (this.options !== null) {
        update()
        return
      }
      this.$axios.get(this.schema.link).then(response => {
        this.options = []
        this.linkListData = {}
        let self = this
        response.data.items.forEach(function (item) {
          self.options.push(item.title)
          self.linkListData[item.title] = item
        })
        update(() => {
          return this.options
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>

<template>
  <span
    v-if="elemValue"
  >
    <!--Это не корень-->
    <!--//todo.добавить выбор ссылок-->
    <!--//todo.варианты объектов-->
    <v-card
      v-if="path"
      class="pa-0 ma-0"
      variant="flat"
    >
      <v-card-actions
        class="pa-0 ma-0 pb-1"
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
          :label="schema.title || elemName"
          :placeholder="schema.description || null"
          density="compact"
          variant="underlined"
          hide-details
          disabled
        />
      </v-card-actions>
      <!--<v-divider v-if="show" />-->
      <v-expand-transition>
        <v-card
          v-show="show"
          class="ml-4 pl-2"
          style="border-left: 1px solid"
          variant="flat"
          tile
        >
          <JsonElem
            v-for="(_schema, _propName ) in schema['properties']"
            :key="(path?path+delimiter:'')+_propName"
            :elemName="_propName"
            :elemValue="elemValue[_propName]"
            :schema="_schema"
            :path="(path?path+delimiter:'')+_propName"
            :read-only="readOnly ? readOnly : schema.readOnly"
            :hide-read-only="hideReadOnly"
            v-bind="$attrs"
          ></JsonElem>
        </v-card>
      </v-expand-transition>
    </v-card>
    <!--Это корень-->
    <span v-else>
      <JsonElem
        v-for="(_schema, _propName ) in schema['properties']"
        :key="(path?path+delimiter:'')+_propName"
        :elemName="_propName"
        :elemValue="elemValue[_propName]"
        :schema="_schema"
        :path="(path?path+delimiter:'')+_propName"
        :read-only="readOnly ? readOnly : schema.readOnly"
        :hide-read-only="hideReadOnly"
        v-bind="$attrs"
        class="pb-1"
      ></JsonElem>
    </span>
  </span>
</template>
