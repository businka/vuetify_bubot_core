<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
// import {isEmptyObject} from '../../../Helpers/BaseHelper'

export default {
    name: "FieldDateRange",
    mixins: [ActionMixin],
    data: () => ({
        begin: undefined,
        end: undefined,
        showPicker: false
    }),
    computed: {
        // dateRangeText () {
        //     return this.dates.join(' ~ ')
        // },
    },
}
</script>

<style scoped>

</style>

<template>
  <v-container class="pa-0 ma-0" d-flex>

    <v-text-field
      label="from"
      single-line
      dense
      type="datetime-local"
    >
    </v-text-field>
    -
    <v-text-field
      label="to"
      type="datetime-local"
      single-line
      dense
      append-icon="mdi-calendar"
    >
      <template v-slot:prepend>
      </template>
    </v-text-field>
    <v-dialog
      v-if="showPicker"
      v-model="modal"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <v-date-picker
        v-model="date"
        scrollable
      >
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.dialog.save(date)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>


  </v-container>
</template>
