<script>
import ActionMixin from '../../helpers/mixinTemplate/action'
import PanelToolBar from '../Simple/PanelToolBar'
import TableBrowser from "../TableBrowser/TableBrowser";
import DefaultProperties from "../TableBrowser/resources/DefaultProperties";

export default {
    name: 'SelectBrowser',
    components: {
        PanelToolBar, TableBrowser
    },
    mixins: [ActionMixin, DefaultProperties],
    props: {
        title: {
            type: String,
            default: ''
        },
        selectedItemFields: {
          type: Array,
          default: function () {
            return ['_id', 'Title']
          }

        },
        panelToolbar: {
            type: Object,
            default: function () {
                return {items: []}
            }
        },
    },
    data: () => ({
    }),
    computed: {},
    watch: {},
    mounted() {
        // this.init()
    },
    methods: {
        actionSelectItems(data) {
            let result = [];
            let key = this.dataSource.keyProperty
            let fields = this.selectedItemFields || []
            for (let i = 0; i < data.Rows.length; i++) {

                let item = {
                    // title: data.items[i].title
                }
                item[key] = data.Rows[i][key]
                for (let j = 0; j < fields.length; j++) {
                    let value = data.Rows[i][fields[j]]
                    if (value) {
                        item[fields[j]] = value
                    }

                }
                result.push(item)
            }
            this.emitAction('SelectItems', result)
        }
    }
}
</script>

<style lang="scss">
</style>

<template>
  <v-container class="pa-0 ma-0">
    <v-progress-linear
      height="2"
      bg-color="header1_bg"
    />
    <PanelToolBar
      :tool-bar="panelToolbar"
      :header-value="title"
      :edit-header="false"
      @action="onAction"
    ></PanelToolBar>
    <TableBrowser
      :data-source="dataSource"
      :columns="columns"
      :filter-fields="filterFields"
      :filter-const="filterConst"
      :row-activate-handler="rowActivateHandler"
      :row-actions="rowActions"
      @action="onAction"
    />
  </v-container>
</template>
