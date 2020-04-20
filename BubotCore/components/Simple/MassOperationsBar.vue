<template>
  <v-toolbar
    dense
    flat
    height="44"
    class="bordered jay-toolbar"
    style="border-color:#cccccc"
  >
    <v-checkbox
      hide-details
      :input-value="selectAll.everyItem"
      :indeterminate="selectAll.someItems"
      class="jay-space-right"
      @change="selectAll.select"
    />
    <component
      :is="item.template || 'ActionBtn'"
      v-for="item in params.items"
      :key="item.name"
      :params="item"
      @action="emitAction"
    />
    <!--<v-btn-->
      <!--v-for="item in params.items"-->
      <!--:key="item.id"-->
      <!--small-->
      <!--icon-->
      <!--class="jay-space-right"-->
      <!--@click="emitAction({name: `Mass${item.name}`})"-->
    <!--&gt;-->
      <!--<v-icon>{{ item.icon }}</v-icon>-->
    <!--</v-btn>-->
  </v-toolbar>
</template>
<script>

import ActionMixin from '@/helpers/mixinTemplate/action'
import SimpleChild from '@/helpers/mixinTemplate/simpleChild'

export default {
  name: 'MassOperationBar',
  mixins: [ActionMixin, SimpleChild],
  props: ["params", "store", "selectAll"],
  computed: {
    // massOperationsBarVisible: {
    //   get: function () {
    //     return this.data.massOperationsBarVisible
    //   }
    // }
  },
  mounted() {
    // this.init()
  },
  methods: {
    // initForm () {
    // }
  }
}

</script>

<style lang="scss">
  .jay-space-right {
    margin-right: 8px;
  }

  .bordered {
    border-bottom: 1px solid #cccccc;
  }
</style>