import {updateObject, objHasOwnProperty, isEmptyObject} from 'bubot-helper/BaseHelper'
import {findIndexInArrayObj} from 'bubot-helper/ArrayHelper'
import ExtException from 'bubot-helper/ExtException'
// import   Vue = require('vue').default

export default class Source {


    constructor(props, store) {
        this._props = {
            rows: [],
            hasMore: false,
            page: 1,
            filter: {},
            filterConst: {},
            extraFields: [],
            itemsPerPage: 25,
            appName: '',
            objName: '',
            dataTableOptions: {},
            filterFields: [],
            keyProperty: 'id',
            pagination: {}
        }
        this.has_more = false
        this.lastPagination = undefined
        this.total = 0
        this.rawData = undefined
        this.rows = []
        // keyProperty = ""
        this.loading = false
        this.error = undefined

        if (store) {
            this.props.appName = store.state.appName
        }
        this.store = store
        this.changeProps(props)
    }

    get props() {
        return this._props
    }

    set props(x) {
        this._props = x
    }

    changeProps(props) {
        if (objHasOwnProperty(props, 'rows')) {
            this.rawData = props.rows
        }
        this.props = updateObject(this.props, props)
        this.keyProperty = this.props.keyProperty || 'id'
    }

    async nextPage() {
        this.props.page += 1
        await this.fetchRows()
    }

    async changeFilter(filter) {
        // console.log('source changeFilter')
        Object.keys(filter).forEach(key => {
            if (filter[key] === undefined)
                delete filter[key]
                delete this.props.filter[key]
        });
        this.props.filter = updateObject({}, this.props.filterConst, this.props.filter, filter)
        this.props.dataTableOptions.page = 1
        await this.fetchRows()
    }

    async add(data) {
        let _data = updateObject({}, this.props.filterConst, data)
        let row
        row = await this.create({data: _data})
        this.rows.push(row)
        let index = this.rows.length - 1
        return {
            index,
            row
        }
    }

    async fetchRows() {
        this.loading = true
        try {
            let nav = {}
            // if (this.props.page !== 1 && this.last_nav && this.last_nav.page
            //     && this.props.page !== this.last_nav.page) {
            //     updateObject(nav, this.last_nav)
            // }
            this.props.pagination.PageSize = this.props.itemsPerPage
            this.props.pagination.Page = this.props.page
            let resp = await this.list(this.props.filter, this.props.pagination)
            let newRows = resp['Rows'] || []
            this.lastPagination = resp['Pagination'] || undefined
            if (this.lastPagination && objHasOwnProperty(this.lastPagination, 'HasMore')) {
                this.hasMore = this.lastPagination['HasMore']
            } else {
                this.hasMore = this.props.pagination.PageSize && newRows.length && newRows.length >= this.props.pagination.PageSize
            }

            if (isEmptyObject(this.props.pagination) || this.props.pagination.Page === 1) {
                this.rows = newRows//.splice(0,this.rows.length)
            } else {
                this.rows.push.apply(this.rows, newRows)
            }
            this.total = this.rows.length

            // this.total = (page - 1) * limit + this.rows.length + (this.rows.length < limit ? 0 : 1)
            this.error = undefined
        } catch (err) {
            let err1 = new ExtException({parent: err})
            this.error = err1.toDict()
            console.error(err1.toString())
            this.rows = []
        }
        this.loading = false
    }

    async fetchRow(list_id) {
        if (!list_id.length) return
        let filter = updateObject({}, {[this.keyProperty]: list_id.toString()}, this.props.filter)
        let resp
        try {
            resp = await this.list(filter)
        } catch (err) {
            this.rows = []
            this.error = err.toDict()
        }
        for (let i = 0; i < list_id.length; i++) {
            let _id = list_id[i]
            let destValueIndex = findIndexInArrayObj(resp['Rows'], _id, this.keyProperty)
            let srcValueIndex = findIndexInArrayObj(this.rows, _id, this.keyProperty)
            if (srcValueIndex >= 0 && destValueIndex >= 0) {
                console.log('обновили запись')
                this.rows[srcValueIndex] = resp['Rows'][destValueIndex]
                continue
            }
            if (srcValueIndex >= 0 && destValueIndex === -1) { // запись больше не в выборке
                console.log('запись больше не в выборке')
                this.rows.splice(srcValueIndex, 1);
            }
            if (srcValueIndex >= -1 && destValueIndex >= 0) { // новая запись
                console.log('новая запись')
                this.rows.push(resp['Rows'][destValueIndex]);
            }
            console.log('ничего')
        }
    }

    async list() {
        throw new Error('method list not implemented in source class')
    }

    async call() {
        throw new Error('method call not implemented in source class')
    }

    async read() {
        throw new Error('method read not implemented in source class')
    }

    async update() {
        throw new Error('method read not implemented in source class')
    }

    async create() {
        throw new Error('method read not implemented in source class')
    }

    toDict() {
        return {...this._props, rows: this.rows}
    }
}
