<script>
import {defineAsyncComponent} from "vue"

export default {
  name: 'FilterBtn',
  components: {
    FilterCheckBox: defineAsyncComponent(() => import('./FilterCheckBox')),
    FilterFieldLink: defineAsyncComponent(() => import('./FilterFieldLink')),
    FilterDateInterval: defineAsyncComponent(() => import('./FilterDateInterval'))
  },
  props: {
    fields: {
      type: Array,
      default: function () {
        return []
      }
    },
    filter: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  data () {
    return {
      visible: false,
      value: {},

      dialog: false,
      // filter: [],
      text: '',
      selectTmpl: ''
    }
  },
  computed: {
    isEmpty: {
      get: function () {
        for (let i=0; i< this.fields.length; i++) {
            if (Object.prototype.hasOwnProperty.call(this.filter, this.fields[i]['name'])){
              if (this.filter[this.fields[i]['name']]) {
                return false
              }
            }
        }
        return true
      }
    },
    icon: function () {
      return this.isEmpty ? 'mdi-filter-outline' : 'mdi-filter'
    },
  },
  watch: {
    // value (value) {
      // this.$emit('changeFilter', value)
      // this.$emit('input', value)
    // }
  },
  methods: {
    onFilterSelected () {
      this.$emit('changeFilter', this.value)
      this.visible = false
    },
    openSelectBrowser () {
      // this.selectTmpl = 'SelectionDrawer'
    },
    onChange () {
    },
  }
}
</script>
<template>
  <div>
    <v-menu
      v-model="visible"
      location="bottom end"
      :close-on-click="false"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          density="compact"
          small
          v-bind="props"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </template>
      <v-card
        min-width="400"
      >
        <v-toolbar
          density="compact"
          variant="flat"
          height="44"
        >
          <v-toolbar-title :text="$t('FilterSelected')" />
          <v-spacer/>
          <v-btn
            outlined
            density="compact"
            variant="outlined"
            rounded="xl"
            color="primary"
            x-small
            @click="onFilterSelected"
          >
            {{ $t('FilterSelect') }}
          </v-btn>
          <v-toolbar-items>
            <v-btn
              icon
              small
              @click="visible=false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container
          v-for="(field, index) in fields"
          :key="index"
          class="row ma-0 pl-2 pr-2 py-0"
        >
          <component
            :is="field.template"
            v-model="value"
            :editMode="true"
            :field="field"
          />
        </v-container>
      </v-card>
    </v-menu>

  </div>
</template>

<style lang="scss">
  .v-toolbar__content {
    padding-right: 0;
  }
</style>
