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
    methods: {
        init() {
            this.internalSelected = []
            this.activate = undefined
            this.editForm = {}
            this.actionForm = {}
            this.actionError = undefined
            this.selectAll = false
            let dataSource = updateObject({}, {
                filterFields: (this.filterFields || {}),
                filterConst: (this.filterConst || {})
            }, this.dataSource, this.options)
            console.log(`Browser  ${this.dataSource.objName} init needUpdate set true`)
            this.needUpdate = true
            try {
                this.source = initDataSource(dataSource, this.$store)
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

        actionCallDataSource: async function (actionData, addSelectionItems) {
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
                        payload.data.items = this.internalSelected
                        // payload.data.filter = null
                    }
                }
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
                    handler: this.rowActivateHandler['formViewer'],
                    formUid: formUid,
                    formVisible: true,
                    _updateKey: Date.now(),
                    _id: Math.random().toString(36).substring(2), // Уникальный ID
                    formData: {
                        item: data.row,
                        index: data.index,
                        filterConst: this.source.props.filterConst
                    },
                }

                // Обновляем query
                this.addIdToRouteQuery(this.source.props.keyProperty, data.row[this.source.props.keyProperty])
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
                    handler: data.handler,
                    formUid: data.formUid,
                    formVisible: true,
                    _updateKey: Date.now(),
                    _id: Math.random().toString(36).substring(2),
                    formData: {
                        item: data.row,
                        index: data.index,
                        filterConst: this.source.props.filterConst
                    },
                }
                this.addIdToRouteQuery(this.source.props.keyProperty, data.row[this.source.props.keyProperty])
            })
        },

        // Обновляем query через pushState - БЕЗ ПЕРЕЗАГРУЗКИ
        addIdToRouteQuery: function (name, value) {
            const url = new URL(window.location.href)
            url.searchParams.set(name, value)
            window.history.replaceState({}, '', url) // replaceState вместо pushState
        },

        removeIdFromRouteQuery: function (name) {
            const url = new URL(window.location.href)
            url.searchParams.delete(name)
            window.history.replaceState({}, '', url) // replaceState вместо pushState
        },

        actionCloseForm: async function (data, panelName) {
            // Закрываем форму
            this[panelName].formVisible = false

            // Получаем ID из закрываемой формы
            const closedForm = this[panelName]
            const keyProperty = this.source?.props?.keyProperty
            const itemId = closedForm?.formData?.item?.[keyProperty]

            // Удаляем query параметр
            if (itemId) {
                this.removeIdFromRouteQuery(keyProperty)
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
            const keyProperty = this.source?.props?.keyProperty
            const id = this.$route.query[keyProperty]

            if (id && this.items) {
                // Ищем элемент по ID
                let foundItem = null
                for (const category of this.items) {
                    const item = category.children?.find(child => child[keyProperty] === id)
                    if (item) {
                        foundItem = item
                        break
                    }
                }

                if (foundItem) {
                    this.$nextTick(() => {
                        this.actionRowActivate({row: foundItem})
                    })
                }
            }
        },

        onDrop: async function (event) {
            console.log(event)
        },

        autoActivateRow: function () {
            if (isEmptyObject(this.autoActivate) || this.internalActive) {
                return
            }
            let findIndex = this.autoActivate.index
            let findKey = this.autoActivate[this.source.props.keyProperty]
            if (findKey) {
                findIndex = findIndexInArrayObj(this.source.rows, findKey, this.source.props.keyProperty)
            }
            if (findIndex !== undefined) {
                let data = {
                    row: this.source.rows[this.autoActivate.index],
                    index: this.autoActivate.index
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
        }
    }
}