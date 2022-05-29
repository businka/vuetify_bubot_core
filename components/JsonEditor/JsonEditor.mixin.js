import {objHasOwnProperty, updateObject} from '../../../Helpers/BaseHelper'
import {updateProp } from './JsonHelper'
// import Vue from 'vue'

import schemaStorage from './ObjSchema.store'
import {initDataSource} from '../DataSource/DataSourceLoader'

export default {
    props: {
        toolBar: {
            type: Object,
            default: function () {
                return {items: []}
            }
        },
        defaultAction: {
            type: Object,
            default: function () {
                return {}
            }
        },
        dataSource: {
            type: Object,
            default: function () {
                return {}
            }
        },
        filterConst: {
            type: Object,
            default: function () {
                return {}
            }
        },
        filterFields: {
            type: Object,
            default: function () {
                return {}
            }
        },
        item: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },

    data() {
        return {
            loading: false,
            schema: {},
            error: {},
            itemFull: undefined,
        }
    },
    beforeCreate() {
        if (!objHasOwnProperty(this.$store.state, 'ObjSchema')) {
            this.$store.registerModule('ObjSchema', schemaStorage)
        }
    },
    watch: {
        dataSource() {
            this.init()
        },
        // item() {
        //     this.loadItem()
        // },
    },
    methods: {
        async init() {
            this.loading = true
            try {
                const dataSource = updateObject({}, { filterFields: this.filterFields, filterConst: this.filterConst }, this.dataSource)
                this.source = initDataSource(dataSource, this.$store)
                await Promise.all([
                    this.loadItem(),
                    this.loadSchema()
                ])
            } catch (err) {
                console.error(err.toString())
                this.error = err
            } finally {
                this.loading = false

            }
        },
        async loadSchema() {
            if (this.dataSource.objName)
                this.schema = await this.$store.dispatch('ObjSchema/read', this.dataSource.objName, {root: true})
        },
        async loadItem() {
            let _id = this.item[this.dataSource.keyProperty]
            if (_id) {
                this.itemFull = await this.source.read(_id)
            } else {
                this.itemFull = await this.source.create(this.source.filterConst)
            }
        },
        actionUpdateProp({path, action, value}) {
            updateProp(this.itemFull, {action, path, value})
            this.$emit('change-value', this.itemFull)
        },

        actionOpenLinkInNewTab(actionData) {
            // actionData = {name: 'routeName', query: {data: "someData"}}
            let routeData = this.$router.resolve(actionData);
            window.open(routeData.href, '_blank');
            this.$router.go(actionData)
        },

        async actionCallDataSourceForSelectedItems (actionData) {
            if (!objHasOwnProperty(actionData, 'data')) {
                actionData.data = {}
            }
            actionData.data.items = [this.itemFull]
            actionData.data.filter = null
            return await this.source.call(actionData)
        }
    }
}
