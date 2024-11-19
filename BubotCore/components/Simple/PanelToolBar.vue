<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonString from '../JsonEditor/JsonString'


export default {
  name: 'ToolBarPanel',
  components: { JsonString },
  mixins: [ActionMixin],
  props: {
    editHeader: {
      type: Boolean,
      default: false
    },
    headerSchema: {
      type: Object,
      default: function () {
        return {}
      }
    },
    headerValue: {
      type: String,
      default: ''
    },
    panelName: {
      type: String,
      default: ''
    },
    toolBar: {
      type: Object,
      default: function () {
        return { items: [] }
      }
    },
    defaultAction: {
      type: Object,
      default: function () {
        return { items: [] }
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  methods: {}
}

</script>

<style lang="scss">
  div .PanelHeader {
    .v-text-field > .v-input__control > .v-input__slot:before {
      border-style: none;
    }

    input {
      font-size: x-large;
    }
  }

  .bordered {
    border-bottom: thin solid #cccccc;
  }
</style>


<template>
  <v-toolbar
    height="30"
    flat
    dense
    class="header1_bg pa-0 justify-end"
  >
    <JsonString
      v-if="headerSchema"
      :schema="headerSchema"
      :array-elem="true"
      :elem-value="headerValue"
      class="PanelHeader"
      @action="emitAction('UpdateHeader', $event)">
    </JsonString>
    <v-toolbar-items
      v-if="toolBar && !loading"
      class="pa-0 flex-grow-0 flex-shrink-1"
    >
      <component
        :is="elem.template || 'ActionBtn'"
        v-for="elem in toolBar.items"
        :key="elem.name"
        v-bind="elem"
        @action="onAction"
      />
    </v-toolbar-items>
    <ActionBtn
      v-if="defaultAction && defaultAction.name && !loading"
      primary
      v-bind="defaultAction"
      @action="onAction"
    />
    <v-toolbar-items>
      <v-btn
        icon
        dense
        small
        @click="emitAction('CloseForm')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>
