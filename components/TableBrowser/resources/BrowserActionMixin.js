import {initDataSource} from '../../DataSource/DataSourceLoader'
import {updateObject, objHasOwnProperty, isEmptyObject} from 'bubot-helper/BaseHelper'
import {findIndexInArrayObj} from "bubot-helper/ArrayHelper";

export default {

    data() {
        return {
            singleSelect: false,
            showOperationsPanel: this.alwaysShowOperationsPanel,
            selectAll: false,
            loading: true,
            source: undefined,
            options: {},
            editForm: {},
            actionForm: {},
            actionError: undefined,
            needUpdate: false,
        }
    },
    beforeMount() {
        this.init()
    },
    computed: {
        internalSelected: {
            get() {
                return Array.isArray(this.selected) ? this.selected : []
            },
            set(val) {
                this.$emit('update:selected', val)
            }
        },
        internalActive: {
            get() {
                return this.active || undefined
            },
            set(val) {
                this.$emit('update:active', val)
            }
        }
    },
    watch: {
        dataSource: {
            deep: true,
            handler(newVal, oldVal) {
                console.log('DataTable watch datasource', this.dataSource.objName, needInit, oldVal, newVal)
                // Проверяем, действительно ли изменились данные
                let needInit = false
                if (newVal && oldVal) {
                    const newHash = JSON.stringify(newVal)
                    const oldHash = JSON.stringify(oldVal)
                    needInit = newHash !== oldHash
                } else {
                    needInit = true
                }

                if (needInit) {
                    // console.log('👁️ CategoryCards dataSource changed, reinitializing', newHash, oldHash)
                    this.needUpdate = true
                }
            }
        },
        filterConst: function (filterConst) {
            // console.log(`Browser  ${this.dataSource.objName} watch filterConst, needUpdate ${this.needUpdate} `)
            this.source.changeProps({
                page: 1,
                filterConst
            })
            // console.log(`Browser  ${this.dataSource.objName} watch filterConst needUpdate set true`)
            this.needUpdate = true
        },
        options: function (options) {
            this.source.changeProps(options)
            // console.log(`Browser  ${this.dataSource.objName} watch options needUpdate set true`)
            this.needUpdate = true
        },
        needUpdate: async function (value) {
            // console.log(`needUpdate ${value}`)
            if (value) {
                await this.source.fetchRows()
                this.autoActivateRow()
            }
            this.needUpdate = false
            // console.log(`needUpdate end ${this.needUpdate}`)
        }
    },

    methods: {
        init() {
            this.internalSelected = []
            this.activate = undefined
            this.editForm = {}
            this.actionForm = {}
            this.actionError = undefined
            this.selectAll = false
            let source = updateObject({}, {
                filterFields: (this.filterFields || {}),
                filterConst: (this.filterConst || {})
            }, this.dataSource, this.options)
            console.log(`Browser  ${this.dataSource.objName} init needUpdate set true`)
            this.needUpdate = true
            try {
                this.source = initDataSource(source, this.$store)
                this.checkRouteQuery()
            } catch (err) {
                this.source = initDataSource({type: 'Memory'}, this.$store)
                this.source.error = err
            }
        },

        actionReload: async function () {
            this.source.props.page = 1
            await this.source.fetchRows()
        },

        actionAdd: async function (data) {
            let res = await this.source.add(data)
            this.actionRowActivate(res)
        },

        actionCallDataSourceForSelectedItems: async function (actionData) {
            await this.actionCallDataSource(actionData, true)
        },
        prepareCallDataSource: function (actionData) {
            let source
            let payload = updateObject({data: {}}, actionData, {data: {Filter: this.source.props.filterConst}})
            if (objHasOwnProperty(actionData, 'dataSource')) {
                source = initDataSource(actionData.dataSource, this.$store)
            } else {
                source = this.source
            }
            if (objHasOwnProperty(payload.data, 'items')) {
                // payload.data.filter = null
            } else {
                if (this.selectAll || !this.internalSelected.length) {
                    Object.assign(payload.data.Filter, this.source.props.filter);
                } else {
                    payload.data.items = this.internalSelected
                    // payload.data.filter = null
                }
            }
            return [source, payload]
        },
        actionCallDataSource: async function (actionData, addSelectionItems) {
            try {
                const [source, payload] = this.prepareCallDataSource(actionData)
                await source.call(payload)
                await this.source.fetchRows()
            } catch (err) {
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

            // Сначала закрываем предыдущую форму
            this.editForm = null

            this.$nextTick(() => {
                // Создаем новую форму
                this.editForm = {
                    template: this.rowActivateHandler['formViewer'],
                    formUid: formUid,
                    visible: true,
                    _updateKey: Date.now(),
                    _id: Math.random().toString(36).substring(2), // Уникальный ID
                    formData: {
                        item: data.row,
                        index: data.index,
                        filterConst: this.source.props.filterConst
                    },
                }

                // Обновляем query
                this.addIdToRouteQuery(this.source.props.objName, data.row[this.source.props.keyProperty])
            })
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
            this.internalActive = data.row
            let handler = `RowActivateHandler${this.rowActivateHandler.name}`
            if (objHasOwnProperty(this, handler)) {
                this[handler](data)
            }
        },

        async actionShowActionForm(data) {
            this.editForm = null

            this.$nextTick(() => {
                this.editForm = {
                    template: data.template,
                    formUid: data.formUid,
                    visible: true,
                    _updateKey: Date.now(),
                    _id: Math.random().toString(36).substring(2),
                    formData: {
                        item: data.row,
                        index: data.index,
                        filterConst: this.source.props.filterConst
                    },
                }
                this.addIdToRouteQuery([this.source.props.objName], data.row[this.source.props.keyProperty])
            })
        },

        // Обновляем query через pushState - БЕЗ ПЕРЕЗАГРУЗКИ
        addIdToRouteQuery: function (name, value) {
            if (!this.source.props.activateFromUrl)
                return true

            const url = new URL(window.location.href)
            if (!value) {
                url.searchParams.delete(name);
            } else {
                url.searchParams.set(name, value);
            }
            window.history.replaceState({}, '', url) // replaceState вместо pushState
        },

        removeIdFromRouteQuery: function (name) {
            if (!this.source.props.activateFromUrl)
                return true
            const url = new URL(window.location.href)
            url.searchParams.delete(name)
            window.history.replaceState({}, '', url) // replaceState вместо pushState
        },

        actionCloseForm: async function (data, panelName) {
            // Закрываем форму
            this[panelName].visible = false

            // Получаем ID из закрываемой формы
            const closedForm = this[panelName]
            const keyProperty = this.source?.props?.keyProperty
            const itemId = closedForm?.formData?.item?.[keyProperty]

            // Удаляем query параметр
            if (itemId) {
                this.removeIdFromRouteQuery(this.source.props.objName)
            }

            // Очищаем форму
            this.$nextTick(() => {
                this[panelName] = {}
            })

            if (data) {
                if (data.fetchRow) {
                    await this.source?.fetchRow(data.fetchRow)
                }
                if (data.fetchRows) {
                    await this.source?.fetchRows()
                }
            }
        },

        // Проверка query параметров при загрузке
        checkRouteQuery() {
            if (!this.source.props.activateFromUrl)
                return true
            let objName
            let keyProperty
            try {
                objName = this.source.props.objName
                keyProperty = this.source.props.keyProperty
            } catch {
                return
            }
            const id = this.$route.query[objName]
            if (!id) return
            this.autoActivate = {[this.source.props.keyProperty]: id}
        },

        onDrop: async function (event) {
            console.log(event)
        },

        autoActivateRow: function () {
            const autoActivateFirstRow = this.source.props.autoActivateFirstRow
            if ((isEmptyObject(this.autoActivate) && !autoActivateFirstRow) || this.internalActive) {
                return
            }

            let findIndex = autoActivateFirstRow ? 0 : undefined
            let findKey = this.autoActivate[this.source.props.keyProperty]
            if (findKey) {
                findIndex = findIndexInArrayObj(this.source.rows, findKey, this.source.props.keyProperty)
            }
            if (findIndex !== undefined && this.source.rows.length && this.source.rows.length >= findIndex) {
                let data = {
                    row: this.source.rows[findIndex],
                    index: findIndex
                }
                this.actionRowActivate(data)
            }
        },

        setDefaultFilter: function () {
            this.$store.commit(`${this.store.namespace}/setDefaultFilter`, {
                uid: this.store.uid,
                filter: this.modeParams.filter
            })
        },

        onOptionsUpdate(newOptions) {
            this.options = newOptions
        },

    }
}