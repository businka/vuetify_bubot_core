<script>
import FilterFieldMixin from './FilterField.mixin'
export default {
  mixins: [FilterFieldMixin]
}

</script>

<template>
  <v-row class="ma-0">
    <v-col cols="12">
      <v-checkbox
          v-model="_value[_name]"
          :label="field.title|| _name"
          hide-details
          :placeholder="field.description ||''"
          :autofocus="autofocus"
          @change="onChange"
      />
    </v-col>
  </v-row>
</template>