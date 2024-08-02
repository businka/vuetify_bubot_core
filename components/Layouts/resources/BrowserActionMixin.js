import {initDataSource} from '../../DataSource/DataSourceLoader'
import {updateObject, objHasOwnProperty} from '@/Helpers/BaseHelper'
// import Vue from 'vue'

export default {
    data() {
        return {
            singleSelect: false,
            showOperationsPanel: this.alwaysShowOperationsPanel,
            selected: [],
            selectAll: false,
            loading: true,
            source: undefined,
            options: {},
            editForm: {},
            actionForm: {},
            actionError: undefined,
            needUpdate: false
        }
    },
    methods: {
        init() {
            console.log(`Browser init ${this.dataSource.objName} filterConst ${JSON.stringify(this.filterConst)} options ${JSON.stringify(this.options)}`)
            this.selected = []
            this.editForm = {}
            this.actionForm = {}
            this.actionError = undefined
            this.selectAll = false
            let dataSource = updateObject({}, {
                filterFields: (this.filterFields || {}),
                filterConst: (this.filterConst || {})
            }, this.dataSource, this.options)
            this.needUpdate = true
            try {
                this.source = initDataSource(dataSource, this.$store)
            } catch (err) {
                this.source = initDataSource({type: 'Memory'}, this.$store)
                this.source.error = err
            }
        },
        actionLoading(data) {
            this.$store.commit(`${this.namespace}/loading`, {
                uid: this.store.uid,
                data: data.value
            }, {root: true})
        },
        actionReload: async function () {
            // console.log('actionReload')
            this.source.props.page = 1
            await this.source.fetchRows()
        },
        actionAdd: async function (data) {
            let res = await this.source.add(data)
            this.actionRowActivate(res)
        },

        actionCallDataSourceForSelectedItems: async function (actionData) {
            try {
                let source

                let payload = updateObject({data: {}}, actionData, {data: {filter: this.source.props.filterConst}})
                if (objHasOwnProperty(actionData, 'dataSource')) {
                    source = initDataSource(actionData.dataSource, this.$store)
                } else {
                    source = this.source
                }
                if (objHasOwnProperty(payload.data, 'items')) {
                    // payload.data.filter = null

                } else {
                    if (this.selectAll) {
                        payload.data.items = this.source.listAll()
                        payload.data.filter = this.source.filter
                    } else {
                        payload.data.items = this.selected
                        // payload.data.filter = null
                    }
                }
                await source.call(payload)
                // console.log('actionCallDataSourceForSelectedItems')

                await this.source.fetchRows()
            } catch (err) {
                // Vue.set(this, error,err)
                this.actionError = err
            }
        },
        actionUpdateTag: async function (data) {
            console.log('actionUpdateTag')
            await this.source.call({method: 'update_tag', data})
            await this.source.fetchRow([data.id])
        },
        actionDeleteTag: async function (data) {
            await this.source.call({method: 'delete_tag', data})
            await this.source.fetchRow([data.id])
        },
        RowActivateHandlerEmitAction(data) {
            this.$emit('action', {name: 'RowActivate', data})
        },
        RowActivateHandlerShowForm(data) {
            let formName = data.row.form || this.rowActivateHandler.form
            let formUid
            if (formName.indexOf('/') < 0) {
                formUid = `${this.source.props.objName}${data.row.subtype ? ('/' + data.row.subtype) : ''}/${formName}`
            } else {
                formUid = formName
            }
            this.editForm = {
                handler: this.rowActivateHandler['formViewer'],
                formUid: formUid,
                visible: true,
                formData: {item: data.row, index: data.index, filterConst: this.source.props.filterConst},
            }
            // console.log(`BrowserActionMixin RowActivateHandlerShowForm ${JSON.stringify(this.editForm)}`)
        },
        RowActivateHandlerExternal(data) {
            console.log(`RowActivateHandlerExternal ${JSON.stringify(data)}`)
            this.externalRowActivateHandler(this, data)
        },
        actionRowActivate: function (data) {
            if (!data.row) {
                console.error('rowActivate - "row" not found')
                return
            }
            let handler = `RowActivateHandler${this.rowActivateHandler.name}`
            if (objHasOwnProperty(this, handler)) {
                this[handler](data)
            } else {
                console.log(`RowActivateHandler not found ${this.rowActivateHandler.name}`)
            }
        },
        async actionShowActionForm(data) {
            this.editForm = {
                handler: data.handler,
                formUid: data.formUid,
                visible: true,
                formData: {item: data.row, index: data.index, filterConst: this.source.props.filterConst},
            }
            // this.$store.commit(`${this.store.namespace}/showActionForm`, {
            //     uid: this.store.uid,
            //     data: {
            //         handler: data.handler,
            //         formUid: data.form,
            //         visible: true,
            //         formData: {item: data.item}
            //     }
            // })
        },
        actionCloseForm: async function (data, panelName) {
            this[panelName].visible = false
            if (data) {
                if (data.fetchRow) {
                    console.log(`actionCloseForm fetchRow ${data.fetchRow}`)
                    await this.source.fetchRow(data.fetchRow)
                }
                if (data.fetchRows) {
                    console.log('actionCloseForm fetchRows')
                    await this.source.fetchRows()
                }
            }
        },
        onDrop: async function (event) {
            console.log(event)
        },
        setDefaultFilter: function () {
            this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
                uid: this.store.uid,
                filter: this.modeParams.filter
            })
        },
    },
    watch: {
        dataSource: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch dataSource needUpdate ${this.needUpdate}`)
            if (this.options) {
                this.options.page = 1
            }
            this.init()
            this.needUpdate = true
        },
        filterConst: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch filterConst 2, needUpdate ${this.needUpdate} `)
            this.needUpdate = true
            this.source.changeProps({filterConst: this.filterConst})
        },
        options: function () {
            // console.log(`Browser  ${this.dataSource.objName} watch options ${JSON.stringify(this.options)}`)
            this.source.changeProps(this.options)
            this.needUpdate = true
        },
        needUpdate: async function (value) {
            // await this.$nextTick()
            // console.log(`needUpdate ${value}`)
            if (value) {
                this.needUpdate = false
                await this.source.fetchRows()
            }
        }
    },
    beforeMount() {
        this.init()
    },
}
