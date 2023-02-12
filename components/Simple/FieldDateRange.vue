<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
// import {isEmptyObject} from '../../../Helpers/BaseHelper'

export default {
    name: "FieldDateRange",
    mixins: [ActionMixin],
}
</script>

<style scoped>

</style>

<template>
  <v-container class="pa-0 ma-o">
    <v-text-field
      v-model="dateRangeText"
      :label="label_range_from"
    ></v-text-field>
    <v-text-field
      :v-model="label_range_to"
      :label="label_range_to"
      prepend-icon="mdi-calendar"
    ></v-text-field>
  </v-container>
</template>
