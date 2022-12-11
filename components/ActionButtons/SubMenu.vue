<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
    name: 'SubMenu',
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
        },
        firstLevel: {
            type: Boolean,
            default: false
        },
    },
    data: function () {
        return {
            show: false
        }
    }
}

</script>

<style scoped>

</style>

<template>
  <v-list-group
    :sub-group="!firstLevel"
  >
    <template v-slot:activator>
      <v-list-item
        dense
      >{{title}}
      </v-list-item>
    </template>
    <v-container
      v-for="(item, index) in items"
      class="pa-0 ma-0"
      :key="index"
    >
      <SubMenu
        v-if="item.items"
        v-bind="item"
        @action="onAction"
      ></SubMenu>
      <v-list-item
        v-else
        dense
        @click="emitAction('OnClick', item)"
      >
        <v-list-item-icon
          v-if="item.icon"
        >
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item[`title_${$i18n.locale}`] || item.title || null }}</v-list-item-title>
      </v-list-item>
    </v-container>
  </v-list-group>
</template>

