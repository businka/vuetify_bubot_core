let Source = require('./Source')
const uuid = require('uuid')
const {getType, objHasOwnProperty, updateObject, getPropValueByPath} = require('../../../Helpers/BaseHelper')

const conditions = {
    'equals': function (filterField, filterValue, row) {
        let fieldPath = filterField.field || filterField.name
        let rowValue = getPropValueByPath(row, fieldPath, null)
        return rowValue === filterValue;
    },
    'in': function (filterField, filterValue, row) {
        let fieldValue = row[filterField['name']]
        const fieldType = getType(fieldValue)
        switch (fieldType) {
            case 'array':
            case 'object':
                return filterValue in fieldValue
            case 'undefined':
                return false
        }
    },
    'from': function (filterField, filterValue, row) {
        let fieldValue = row[filterField['name']]
        const fieldType = getType(filterValue)
        switch (fieldType) {
            case 'number':
                return fieldValue === filterValue
            case 'string':
                filterValue = filterValue.split(',')
                switch (filterField['format']) {
                    case 'int':
                        filterValue = filterValue.map(Number)
                }
                return filterValue.indexOf(fieldValue) >= 0
            case 'array':
                return fieldValue.indexOf(fieldValue) >= 0
            case 'object':
                return filterValue in fieldValue
            case 'undefined':
                return false
        }
    },
    'within': function (filterField, filterValue, row) {
        if (filterValue[0] && row[filterField['name']] < filterValue[0]) {
            return false
        }
        if (filterValue[1] && row[filterField['name']] > filterValue[1]) {
            return false
        }
        return true
    }
}

// module.exports = class Memory extends DataSource {
module.exports = class Memory extends Source {
    data = []
    total = 0
    rows = []
    store
    keyProperty;
    loading = false

    // constructor (props) {
    //   this.props = props
    //   this.keyProperty = this.props.keyProperty || 'id'
    // }

    async query(filter) {
        let filteredRawData = []
        let _filter = updateObject({}, this.props.filterConst, filter)
        for (let i = 0; i < this.rawData.length; i++) {
            const row = this.rawData[i]
            let match = true
            if (this.props.filterFields) {
                for (let i = 0; i < this.props.filterFields.length; i++) {
                    let filterField = this.props.filterFields[i]
                    let condition = conditions[filterField['type'] || 'equals']
                    let value = _filter[filterField['name']] || filterField.default
                    if (value !== undefined) {
                        if (!condition(filterField, value, row)) {
                            match = false
                            break
                        }
                    }
                }
            }
            if (!match)
                continue
            if (objHasOwnProperty(filter, 'searchString') && filter['searchString']) {
                match = false
                for (let elem in row) {
                    if (Object.prototype.hasOwnProperty.call(row, elem)) {
                        try {
                            if (row[elem].indexOf(filter['searchString']) >= 0) {
                                match = true
                                break;
                            }
                        } catch (e) {
                            // continue regardless of error
                        }
                    }
                }
            }
            if (match) {
                filteredRawData.push(row)
            }
        }
        const limit = this.props.itemsPerPage
        if (limit) {
            const page = filter ? filter.page || 1 : 1
            const start = (page - 1) * limit;
            const end = start + limit;
            return {rows: filteredRawData.slice(start, end)}
        }
        return {rows: filteredRawData}
    }

    async read(_id) {
        const filter = {
            [this.keyProperty]: _id
        }
        let items = await this.query(filter)
        if (items.length === 0) {
            return null
        }
        return items[0]
    }

    async create(data) {
        console.log(data)
    }

    async update(data) {
        let _id = data[this.keyProperty]
        if (_id) {
            let item = await this.read(_id)
            if (!item) {
                item = {}
            }
            updateObject(item, data, this.props.filterConst)
            return item
        } else {
            data[this.keyProperty] = uuid.v4()
            updateObject(data, this.props.filterConst)
            return data
        }
    }
}

