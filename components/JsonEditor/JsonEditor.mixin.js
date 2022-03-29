import {objHasOwnProperty, updateObject} from '../../helpers/baseHelper'
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
            const dataSource = updateObject({}, { filterFields: this.filterFields, filterConst: this.filterConst }, this.dataSource)

            this.source = initDataSource(dataSource, this.$store)
            try {
                await Promise.all([
                    this.loadItem(),
                    this.loadSchema()
                ])
            } catch (err) {
                this.error = err
            }
            this.loading = false
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
        async actionCallDataSourceForSelectedItems (actionData) {
            if (!objHasOwnProperty(actionData, 'data')) {
                actionData.data = {}
            }
            actionData.data.items = [this.item]
            actionData.data.filter = null
            return await this.source.call(actionData)
        }
    }
}
