<script>
import ActionMixin from '../../../../helpers/mixinTemplate/action'

export default {
  name: 'FilterBtn',
  components: {
    'FilterCheckBox': () => import('./FilterCheckBox'),
    'FilterFieldLink': () => import('./FilterFieldLink'),
    'FilterDateInterval': () => import('./FilterDateInterval')
  },
  mixins: [ActionMixin],
  props: ['params', 'filter'],
  data() {
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
    // filter: {
    //   get: function () {
    //     return this.data ? this.data.filter : {}
    //   }
    // },
    icon: function() {
      return this.filter ? 'mdi-filter' : 'mdi-filter-outline'
    }
  },
  methods: {
    onFilterSelected() {
      this.emitAction({ name: 'ChangeFilter', data: this.value })
      this.visible = false
    },
    openSelectBrowser() {
      // this.selectTmpl = 'SelectionDrawer'
    },
    onEvent() {
    }
  }
}
</script>
<template>
  <div>
    <v-menu
      v-model="visible"
      z-index="0"
      :min-width="400"
      left
      :close-on-click="false"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          dense
          small
          v-on="on"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </template>
      <v-card
      >
        <v-toolbar
          dense
          flat
          height="44"
        >
          {{ $t('FilterSelected') }}
          <v-spacer/>
          <v-btn
            outlined
            dense
            rounded
            x-small
            class="mr-2 btn_default_action"
            @click="onFilterSelected"
          >
            {{ $t('FilterSelect') }}
          </v-btn>
          <v-toolbar-items>
            <v-btn
              icon
              dense
              small
              @click="visible=false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container
          v-for="field in params.components"
          :key="field.id"
          class="row no-wrap"
        >
          <component
            :is="field.template"
            v-model="value"
            :editMode="true"
            :field="field"
            @action="onAction"
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
