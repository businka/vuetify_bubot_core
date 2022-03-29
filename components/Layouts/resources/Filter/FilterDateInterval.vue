<script>
// let reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
import FilterFieldMixin from './FilterField.mixin'
export default {
  mixins: [FilterFieldMixin]
}
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex">
      <v-text-field
        :value="_value[_name]"
        :label="field[`title_${$i18n.locale}`] || field.text "
        hide-details
        single-line
        :placeholder="field.text"
        :autofocus="autofocus"
        :type="field.type||'text'"
        @change="onChange"
        @keydown.enter="emitAction({name:'UpdateField'})"
        @keydown.escape="emitAction({name:'CancelEditField'})"
      />
        <v-text-field
          :value="_value[_name]"
          :label="field[`title_${$i18n.locale}`] || field.text "
          hide-details
          single-line
          :placeholder="field.text"
          :autofocus="autofocus"
          :type="field.type||'text'"
          @change="onChange"
          @keydown.enter="emitAction({name:'UpdateField'})"
          @keydown.escape="emitAction({name:'CancelEditField'})"
        />
      </v-col>
  </v-row>
</template>
