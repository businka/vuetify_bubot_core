<script>
import { jsonClone } from '../../helpers/clone'
import ActionMixin from '../../helpers/mixinTemplate/action'


export default {
  name: 'RowEditor',
  components: {
    'Default': () => import('./RowCellDefault'),
    'FieldLink': () => import('./RowCellFieldLink'),
  },
  mixins: [ActionMixin],
  props: {
    headers: {
      type: Array,
      default: () => ([])
    },
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: undefined
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      row: {}
    }
  },
  computed: {
    indexHeaders () {
      let res = {}
      for (let elem in this.headers) {
        if (Object.prototype.hasOwnProperty.call(this.headers, elem)){
          res[this.headers[elem].value] = this.headers[elem]
        }
      }
      return res
    }
  },
  watch: {
    item() {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init() {
      this.row = jsonClone(this.item)
    },
    actionUpdateRow() {
      this.$emit('action', { name: 'UpdateRow', data: { value: this.row, index: this.index } })
    },
    actionCancelEdit() {
      this.row = jsonClone(this.item)
      this.$emit('action', { name: 'RowActivate', data: { row: this.item, index: undefined } })
    },
    onClickRow(data) {
      console.log('edit row ' + data)
      this.$emit('action', { name: 'RowActivate', data: { row: this.item, index: this.index } })
    }
  }
}
</script>

<template>
  <tr
    @click.stop="onClickRow"
  >
    <td
      :colspan="headers.length"
      class="grey lighten-4"
    >
      <v-container class="pa-0 ma-0">
        <v-row
          no-gutters
          style="flex-wrap: nowrap;"
        >
          <v-col
            cols="10"
            class=" flex-grow-0 flex-shrink-1"
          >
            <FieldLink
              v-model="row"
              :col="indexHeaders['item_title']"
              :edit-mode="true"
              :autofocus="true"
              @action="onAction"
            />
          </v-col>
          <v-col
            cols="2"
            class="flex-grow-0 flex-shrink-0"
          >
            <Default
              v-model="row"
              :col="indexHeaders['amount']"
              :edit-mode="true"
              @action="onAction"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex justify-end">
          <v-col
            cols="2"
            class=" flex-grow-1 flex-shrink-0"
          >
            <v-btn
              icon
              dense
              @click="actionUpdateRow"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              icon
              dense
              @click="actionCancelEdit"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </td>
  </tr>
</template>
