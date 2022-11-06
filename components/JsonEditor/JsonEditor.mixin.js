import {objHasOwnProperty, updateObject} from '../../../Helpers/BaseHelper'
import {updateProp} from './JsonHelper'
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
            source: undefined,
            itemFull: undefined,
        }
    },
    beforeMount() {
        // console.log('JsonEditorMixin beforeMount')
        this.init()
    },
    beforeCreate() {
        if (!objHasOwnProperty(this.$store.state, 'ObjSchema')) {
            this.$store.registerModule('ObjSchema', schemaStorage)
        }
    },
    computed: {
        // _id() {
        //     if (this.dataSource && this.dataSource.keyProperty && this.item) {
        //         return this.item[this.dataSource.keyProperty]
        //     }
        //     return undefined
        // }
    },
    watch: {
        item() {
            this.init()
        },
    },
    methods: {
        init: function () {
            // console.log(`JsonEditor.mixin init`)
            const dataSource = updateObject({}, {
                filterFields: this.filterFields,
                filterConst: this.filterConst
            }, this.dataSource)
            this.source = initDataSource(dataSource, this.$store)
            this.loadData()
        },
        loadData: async function () {
            try {
                // console.log(`JsonEditor.mixin loadData ${this.item.subtype}`)
                this.loading = true
                await Promise.all([
                    this.loadItem(),
                    this.loadSchema()
                ])
                await this.afterLoadData()
            } catch (err) {
                console.error(err.toString())
                this.error = err
            } finally {
                this.loading = false
            }
        },
        afterLoadData: async function () {
        },
        loadSchema: async function () {
            if (this.dataSource.objName)
                this.schema = await this.$store.dispatch('ObjSchema/read', this.dataSource.objName, {root: true})
        },
        loadItem: async function () {
            let _id = this.item[this.dataSource.keyProperty]
            if (_id) {
                this.itemFull = await this.source.read(_id)
            } else {
                this.itemFull = await this.source.create(this.source.filterConst)
            }
        },
        actionUpdateProp: function ({path, action, value}) {
            updateProp(this.itemFull, {action, path, value})
            this.$emit('change-value', this.itemFull)
        },

        actionOpenLinkInNewTab: function (actionData) {
            // actionData = {name: 'routeName', list: {data: "someData"}}
            let routeData = this.$router.resolve(actionData);
            window.open(routeData.href, '_blank');
            this.$router.go(actionData)
        },

        actionCallDataSourceForSelectedItems: async function (actionData) {
            if (!objHasOwnProperty(actionData, 'data')) {
                actionData.data = {}
            }
            actionData.data.items = [this.itemFull]
            actionData.data.filter = null
            return await this.source.call(actionData)
        },
        onClose: function () {
            this.$emit('action', {name: 'CloseForm', data: {name: this.name}})
        },
    }
}
