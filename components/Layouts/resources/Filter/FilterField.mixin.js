// import {objHasOwnProperty, updateObject} from '../../helpers/baseHelper'
import {updateProp} from '../../../JsonEditor/JsonHelper'
// import Vue from 'vue'

// import schemaStorage from './ObjSchema.store'
// import {initDataSource} from '../DataSource/DataSourceLoader'

export default {
    props: {
        field: {
            type: Object,
            default() {
                return {}
            }
        },
        value: {
            type: Object,
            default() {
                return {}
            }
        },
        autofocus: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        path() {
            if (this.field && this.field.name)
                return this.field.name.split('.')
            else
                return []
        },
        _value() {
            let result = this.value
            let i, len
            for (i = 0, len = this.path.length; i < len - 1; i++) {
                if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
                    result = result[this.path[i]]
                }
            }
            return result
        },
        _name() {
            return this.path[this.path.length - 1]
        }
    },
    methods: {
        onChange(value) {
            let data = Object.assign({}, this.value)
            let result = data
            let i, len
            for (i = 0, len = this.path.length; i < len - 1; i++) {
                if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
                    result = result[this.path[i]]
                }
            }
            if (this.field.type && this.field.type === 'number') {
                result[this._name] = parseFloat(value)
            } else {
                result[this._name] = value
            }
            this.$emit('input', data)
        },

        actionUpdateProp({path, action, value}) {
            updateProp(this.itemFull, {action, path, value})
            this.$emit('change-value', this.itemFull)
        },

    },

}
