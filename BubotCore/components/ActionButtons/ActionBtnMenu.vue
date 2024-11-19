<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
    name: 'ActionBtnMenu',
    mixins: [ActionMixin],
    props: {
        title: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        minWidth: {
            type: String,
            default: '150px'
        },
        data: {
            type: Object,
        },
        items: {
            type: Array,
        },
        icon: {
            type: String,
            default: ''
        },
        primary: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            show: false
        }
    }
}
</script>

<template>
  <v-menu
    v-if="items"
    v-model="show"
    offset-y
    :min-width="minWidth"
  >
    <template v-slot:activator="{ on: onMenu }">
      <v-btn
        :class="primary?'ma-0 jay-space-right btn_default_action':'ma-0 jay-space-right'"
        icon
        dense
        small
        :outlined="primary || false"
        v-on="onMenu"
        @click="show=true"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list
      dense
      class="pa-0"
    >
      <v-list-item
        v-for="(menuItem, index) in items"
        :key="index"
        class="px-3"
        @click="emitAction(menuItem.name, menuItem.data)"
      >
        <v-list-item-icon
          v-if="menuItem.icon"
          class="mr-2"
        >
          <v-icon>
            {{ menuItem.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ menuItem[`title_${$i18n.locale}`] || menuItem.title || null }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss">
  .btn_default_action {
    border: thin solid #FF7033;
    background-color: transparent;

    &:hover {
      background-color: #FDECD9;
    }
  }

  .jay-primary-border {
    border: 1px solid rgb(217, 71, 0);
  }

  /*.jay-button {*/
  /*font-size: 14px;*/
  /*}*/

</style>
