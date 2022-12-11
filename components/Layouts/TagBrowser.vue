<script>

export default {
  name: 'TagBrowser',
  props: ['treeView', 'browser'],
  data: () => ({
    browserOptions: {}
  }),
  components: {
    TagTreeView: () => import('../Simple/TagTreeView'),
    Browser: () => import('./TableBrowser'),
  },
  methods: {
    getBrowserSource () {
      let _browser = this.$refs['browser']
      return _browser.source
    },
    onSelect: function ({tags}) {
      let browserSource = this.getBrowserSource()
      browserSource.changeFilter({ tags: tags.toString() })
    }
  }
}
</script>
<style scoped lang="scss">
  .tag-tree-view {
    /*width: 400px;*/
    /*min-width: 300px;*/
  }

  .tag-browser {
    /*margin: 0;*/
  }
</style>
<template>
  <v-container class="pa-0 ma-0" >
    <v-row class="pa-0 ma-0 tag-browser">
      <v-col cols="3" class="pa-0 ma-0">
        <TagTreeView
          v-bind="treeView"
          @update="onSelect"
          class="tag-tree-view"
        ></TagTreeView>
      </v-col>
      <v-col
        :xl="browser.col_xl || '7'"
        :lg="browser.col_lg || '8'"
        :md="browser.col_md || '9'"
        :sm="browser.col_sm || '9'"
        :xs="browser.col_xs || '9'"
        class="pa-0 ma-0"
      >
        <Browser
          ref="browser"
          v-bind="browser"
        ></Browser>
      </v-col>
    </v-row>
  </v-container>
</template>
