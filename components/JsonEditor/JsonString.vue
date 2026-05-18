<script>
// import Vue from 'vue'
import {getPropByPath} from './JsonHelper'

export default {
  name: 'JsonString',
  props: {
    schema: Object,
    elemValue: {},
    elemName: String,
    path: String,
    arrayElem: Boolean,
    level: Number,
    readOnly: {
      type: Boolean,
      default: undefined
    },
    hideReadOnly: Boolean,
    variant: {
      type: String,
      default: 'underlined'
    },
    density: {
      type: String,
      default: 'compact'
    },
    singleLine: Boolean,
    byPath: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autofill: {
      type: Boolean,
      default: undefined,
    }
  },
  data: function () {
    return {
      value: this.elemValue || '',
      autofillDetect: false,
      autofillComplete: false,
      autofillDeception: true,
    }
  },
  watch: {
    elemValue: function (value) {
      if (this.byPath) {
        this.value = getPropByPath(value, this.path)
      } else {
        this.value = value
      }
      if (value) {
        if (this.autofillDetect) {
          this.autofillComplete = true
        }
        this.autofillDetect = false
      }
      else if (value === undefined && this.schema.default) {
        this.onChange(this.schema.default)
      }
    }
  },
  mounted() {
    switch (this.autofill) {
      case undefined:
        this.autofillDeception = false
        break
      case false:
        setTimeout(() => {
          this.autofillDeception = false
        }, 300)
        break
      case true:
        if (!this.elemValue) {
          setTimeout(() => {
            this.checkAutofillState()
          }, 100)
          setTimeout(() => {
            this.checkAutofillState()
          }, 300)
          setTimeout(() => {
            this.checkAutofillState()
          }, 500)
        }
        break
    }
  },
  methods: {
    checkAutofillState() {
      if (this.$refs.textField) {
        const input = this.$refs.textField.$el.querySelector("input:-webkit-autofill")
        if (input) {
          this.autofillDetect = true
        }
      }
    },
    onChange(value) {
      console.log('JsonString onChange' + this.elemName + '-' + JSON.stringify(value))
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    },
    convertToTime(date) {
      let value = new Date(date)
      this.$emit('action', {name: 'UpdateProp', data: {action: 'change', path: this.path, value}})
    },
    cancelInput() {
      this.test++
      this.value = this.elemValue
      // Vue.set(this, 'value', this.elemValue)
    }
  }
}
</script>


<template>
  <v-container class="pa-0 ma-0" v-if="schema">
    <v-select
        v-if="Object.prototype.hasOwnProperty.call(schema, 'enum')"
        :label="schema.title || elemName"
        :items="schema.enum"
        :placeholder="schema['description']"
        :readonly="(readOnly ? readOnly : schema.readOnly)"
        :density="density"
        :variant="variant"
        :single-line="singleLine"
        hide-details
        :model-value="value"
        @update:modelValue="onChange"
    />
    <!--//todo.добавить выбор перечисляемых-->
    <v-text-field
        v-else-if="Object.prototype.hasOwnProperty.call(schema, 'format') && schema.format==='datetime'"
        :label="schema.title || elemName"
        :placeholder="schema.description || ''"
        :readonly="(readOnly ? readOnly : schema.readonly)"
        :density="density"
        :variant="variant"
        :single-line="singleLine"
        hide-details
        :value="value?value.toLocaleString('sv'):''"
        type="datetime-local"
        @update:modelValue="convertToTime">

    </v-text-field>
    <span
        v-else
    >
    <v-text-field
        v-if="type==='password' && !autofill"
        ref="textField"
        :label="schema.title || elemName"
        :placeholder="schema.description || ''"
        :readonly="(autofillDeception || (readOnly ? readOnly : schema.readonly))"
        hide-details
        :model-value="value"
        :density="density"
        :variant="variant"
        :single-line="singleLine"
        :name="'pwd_' + Math.random().toString(36).substr(2, 5)"
        autocomplete="new-password"
        :type="type"
        :class="{
          'autofill-fix': autofillDetect,
          'autofill-complete': autofillComplete
        }"
        @keydown.escape.stop="cancelInput"
        @update:modelValue="onChange"
    />
    <v-text-field
        v-else
        ref="textField"
        :label="schema.title || elemName"
        :placeholder="schema.description || ''"
        :readonly="(autofillDeception || (readOnly ? readOnly : schema.readonly))"
        hide-details
        :model-value="value"
        :density="density"
        :variant="variant"
        :single-line="singleLine"
        :type="type"
        :class="{
          'autofill-fix': autofillDetect,
          'autofill-complete': autofillComplete
        }"
        @keydown.escape.stop="cancelInput"
        @update:modelValue="onChange"
    />

    </span>
  </v-container>
</template>


<style lang="scss" scoped>


:deep(.autofill-fix.v-text-field .v-label) {
  transform: translateY(-16px) scale(.75);
  line-height: 1 !important;
}

:deep(.autofill-complete.v-text-field .v-label) {
  transform: translateY(-16px) !important;
  animation: none !important;
  transition: none !important;
  font-size: 12px !important;
  line-height: 1 !important;
}

/* При фокусе ничего не меняем */
:deep(.autofill-complete.v-text-field .v-field--focused .v-field-label--floating) {
  transform: translateY(-16px) !important;
  animation: none !important;
  transition: none !important;
  font-size: 12px !important;
  line-height: 1 !important;
}


/* Убираем фон автозаполнения */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  box-shadow: 0 0 0 30px transparent inset !important;
  background-color: transparent !important;
  background-image: none !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Для Firefox */
:deep(input:-moz-autofill),
:deep(input:-moz-autofill:hover),
:deep(input:-moz-autofill:focus),
:deep(input:-moz-autofill:focus),
:deep(input:-moz-autofill:active) {
  filter: none;
  background-color: transparent !important;
}
</style>
