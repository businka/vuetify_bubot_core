import {initDataSource} from '../../DataSource/DataSourceLoader'
import {updateObject, objHasOwnProperty} from '../../../helpers/baseHelper'
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
            actionError: undefined
        }
    },
    methods: {
        init() {
            this.selected = []
            this.editForm = {}
            this.actionForm = {}
            this.actionError = undefined
            this.selectAll = false
            let dataSource = updateObject({}, {
                filterFields: this.filterFields,
                filterConst: this.filterConst
            }, this.dataSource, this.options)
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
        // async query () {
        //   this.emitAction({ name: 'Loading', data: { value: true } })
        //   try {
        //     await this.$store.dispatch(`${this.namespace}/query`, {
        //       store: this.store,
        //       params: this.params,
        //       data: this.data
        //     }, { root: true })
        //   } finally {
        //     this.emitAction({ name: 'Loading', data: { value: false } })
        //   }
        //
        // },
        // async actionChangeFilter (data) {
        //   await this.$store.commit(`${this.namespace}/setFilter`, {
        //     uid: this.store.uid,
        //     filter: data,
        //   }, { root: true })
        //   this.query()
        // },
        // getSelected() {
        //   return this.$refs[this.store.uid].selection
        //   return
        // },
        // onChangeSelect (event) {
        //   let find = this.selected.indexOf(event['item'])
        //   if (event['value']) {
        //     if (find < 0)
        //       this.selected.push(event['item'])
        //   } else {
        //     this.selectAll = false;
        //     if (find < 0)
        //       return;
        //     this.selected.splice(find, 1)
        //   }
        // },
        // onChangeSelectAll (event) {
        //   if (event['value']) {
        //     this.selectAll = true
        //     this.selected = event['items']
        //   } else {
        //     this.selectAll = false
        //     this.selected = []
        //   }
        // },
        // actionRemoteItemAction: function (actionData) {
        //   // const payload = updateObject({}, actionData.data, {item: this.deviceLink, })
        //   const source = objHasOwnProperty(actionData, 'dataSource')? initDataSource(actionData.dataSource.type, this.dataSource): this.source
        //   source.call(actionData.name, this.deviceLink)
        // },
        actionReload: async function () {
            console.log('actionReload')
            await this.source.fetchRows()
        },
        actionAdd: async function () {
            let res = await this.source.add()
            this.actionRowActivate(res)
        },

        async actionCallDataSourceForSelectedItems(actionData) {
            try {
                let source

                let payload = updateObject({data: {}}, actionData, {data: this.source.props.filterConst})
                if (objHasOwnProperty(actionData, 'dataSource')) {
                    source = initDataSource(actionData.dataSource, this.$store)
                } else {
                    source = this.source
                }
                if (objHasOwnProperty(payload.data, 'items')) {
                    payload.data.filter = null

                } else {
                    if (this.selectAll) {
                        payload.data.items = this.source.queryAll()
                        payload.data.filter = this.source.filter
                    } else {
                        payload.data.items = this.selected
                        payload.data.filter = null
                    }
                }
                await source.call(payload)
                console.log('actionCallDataSourceForSelectedItems')

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
        actionRowActivate: function (data) {
            if (!data.row) {
                console.error('rowActivate - "row" not found')
                return
            }
            if (this.rowActivateHandler.name === 'emitAction') {
                this.$emit('action', {name: 'RowActivate', data})
            } else {

                let form = data.row.form || this.rowActivateHandler.form
                this.editForm = {
                    handler: this.rowActivateHandler.name,
                    formUid: form,
                    visible: true,
                    formData: {item: data.row, index: data.index, filterConst: this.source.props.filterConst},
                }
                console.log(this.editForm)
            }
        },
        async actionHandler(data) {
            this.$store.commit(`${this.store.namespace}/showActionForm`, {
                uid: this.store.uid,
                data: {
                    handler: data.handler,
                    formUid: data.form,
                    visible: true,
                    formData: {item: data.item}
                }
            })
        },
        actionCloseForm: async function (data, panelName) {
            this[panelName].visible = false
            if (data) {
                if (data.fetchRow) {
                    console.log('actionCloseForm')
                    await this.source.fetchRow(data.fetchRow)
                }
                if (data.fetchRows) {
                    console.log('actionCloseForm')
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
    }
}
