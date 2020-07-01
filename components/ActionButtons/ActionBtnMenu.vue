<template>
  <v-menu
    v-if="params.items"
    v-model="show"
    min-width="300"
  >
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn
            :class="params.primary?'ma-0 jay-space-right btn_default_action':'ma-0 jay-space-right'"
            icon
            dense
            small
            :outlined="params.primary || false"
            v-on="{ ...onMenu, ...onTooltip }"
            @click="show=true"
          >
            <v-icon>{{ params.icon }}</v-icon>
          </v-btn>
        </template>
        {{ params[`title_${$i18n.locale}`] || params.title || '' }}
      </v-tooltip>
    </template>
    <v-list
      dense
      class="pa-0"
    >
      <v-list-item
        v-for="(menuItem, index) in params.items"
        :key="index"
        class="px-3"
        @click="emitAction({name: menuItem.name, data: menuItem.data})"
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
<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'ActionBtnMenu',
  mixins: [ActionMixin],
  props: ['params'],
  data: function () {
    return {
      show: false
    }
  }
}
</script>

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
