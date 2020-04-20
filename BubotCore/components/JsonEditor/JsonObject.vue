<script>

export default {
  props: {
    schema: Object,
    elemValue: Object,
    elemName: String,
    path: String,
    inputListeners: Object,
    arrayElem: Boolean,
    level: Number,
    readOnly: Boolean
  },
  data() {
    return {
      linkListData: null,
      options: null,
      show: false
    }
  },
  computed: {
    _elemName() {
      let _value = this.elemValue
      if (this.arrayElem || this.path) { // если показываем объект являющийся элементом массива, показываем узел name или значения первого из схемы
        if (this.elemValue.hasOwnProperty('title')) {
          return this.elemValue.name
        } else {
          for (let elem in this.schema.properties) {
            if (this.schema.properties.hasOwnProperty(elem)) {
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
        this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value: this.linkListData[value]}})
      }
    }
  },
  mounted() {
    if (this.schema && this.elemValue === undefined) {

      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value: {}}})
    }
  },
  beforeCreate: function() {
    this.$options.components.JsonElem = require('./JsonElem.vue').default
  },
  methods: {
    onChange(value) {
      console.log('oc2' + this.path + '-' + value)
      this.$emit('action', {name: 'UpdateProp', data:{ action:'change', path: this.path, value}})
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
        response.data.items.forEach(function(item) {
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
      flat
    >
      <v-card-actions
        class="pa-0 ma-0 pb-1"
      >
        <v-btn
          icon
          dense
          @click="show = !show"
        >
          <v-icon>{{ show ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
        </v-btn>
        <v-text-field
          :label="schema.title || elemName"
          :placeholder="schema.description || null"
          solo
          flat
          hide-details
          disabled
          :dense="arrayElem"
        />
      </v-card-actions>
      <!--<v-divider v-if="show" />-->
      <v-expand-transition>
        <v-card
          v-show="show"
          class="ml-4 pl-2"
          style="border-left: 1px solid var(--v-delimiter-base)"
          flat
          tile
        >
          <JsonElem
            v-for="(_schema, _elemName ) in schema['properties']"
            :key="path+'/'+_elemName"
            :elem-name="_elemName"
            :elem-value="elemValue[_elemName]"
            :read-only="readOnly?readOnly:schema.readOnly"
            :schema="_schema"
            :path="path+'/'+_elemName"
            :input-listeners="inputListeners"
          />
        </v-card>
      </v-expand-transition>
    </v-card>
    <!--Это корень-->
    <span v-else>
      <JsonElem
        v-for="(_schema, _elemName ) in schema['properties']"
        :key="path+'/'+_elemName"
        :elem-name="_elemName"
        :elem-value="elemValue[_elemName]"
        :schema="_schema"
        :path="path+'/'+_elemName"
        :input-listeners="inputListeners"
        :read-only="readOnly?readOnly:schema.readOnly"
      />
    </span>
  </span>
</template>