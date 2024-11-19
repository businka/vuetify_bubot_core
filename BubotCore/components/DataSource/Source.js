const {updateObject, objHasOwnProperty} = require('../../../Helpers/BaseHelper')
const {findIndexInArrayObj} = require('../../../Helpers/ArrayHelper')
const ExtException = require('../../../Helpers/ExtException').default
const Vue = require('vue').default

module.exports = class Source {
    props = {
        rows: [],
        has_more: false,
        page: 1,
        filter: {},
        filterConst: {},
        itemsPerPage: 25,
        appName: '',
        objName: '',
        dataTableOptions: {},
        filterFields: [],
        keyProperty: 'id'
    }
    last_nav = undefined
    total = 0
    rawData = []
    rows = []
    store = {}
    // keyProperty = ""
    loading = false
    error = {}
    selected = []

    constructor(props, store) {
        if (store) {
            this.props.appName = store.state.appName
        }
        this.store = store
        this.rawData = props.rows || []
        this.changeProps(props)
        this.keyProperty = this.props.keyProperty || 'id'
    }

    changeProps(props) {
        this.props = updateObject(this.props, props)
    }

    async changeFilter(filter) {
        // console.log('source changeFilter')
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
            if (this.props.page !== 1 && this.last_nav && this.last_nav.page
                && this.props.page !== this.last_nav.page) {
                updateObject(nav, this.last_nav)
            }
            nav.limit = this.props.itemsPerPage
            nav.page = this.props.page
            let resp = await this.list(this.props.filter, nav)
            let new_rows = resp.rows || []
            this.last_nav = resp.nav || undefined
            if (this.last_nav && objHasOwnProperty(this.last_nav, 'has_more')) {
                this.has_more = this.last_nav.has_more
            } else {
                this.has_more = nav.limit && new_rows.length && new_rows.length >= nav.limit
            }

            if (nav.page === 1) {
                this.rows = new_rows//.splice(0,this.rows.length)
            } else {
                this.rows.push.apply(this.rows, new_rows)
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
            let destValueIndex = findIndexInArrayObj(resp.rows, _id, this.keyProperty)
            let srcValueIndex = findIndexInArrayObj(this.rows, _id, this.keyProperty)
            if (srcValueIndex >= 0 && destValueIndex >= 0) {
                Vue.set(this.rows, srcValueIndex, resp.rows[destValueIndex])
                continue
            }
            if (srcValueIndex >= 0 && destValueIndex === -1) { // запись больше не в выборке
                this.rows.splice(srcValueIndex, 1);
            }
            if (srcValueIndex >= -1 && destValueIndex > 0) { // новая запись
                this.rows.push(resp.rows[destValueIndex]);
            }
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
}
