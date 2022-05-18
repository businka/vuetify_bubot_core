import ActionMixin from '../../../../helpers/mixinTemplate/action'
import { getPropValueByPath } from '../../../../../Helpers/BaseHelper'

export default {
    mixins: [ActionMixin],
    props: {
        value: {
            type: Object,
            default: () => {
            }
        },
        field: {
            type: String
        },
        title: {
            type: String
        },
        type: {
            type: String,
            default: 'string'
        },
        editMode: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            name2: ''
        }
    },
    computed: {
        _value () {
            return getPropValueByPath(this.value, this.field, '')
        },
    },
    methods: {
        onChange (value) {
            let data = Object.assign({}, this.value)
            let path = this.field.split(".")
            let result = data
            let _name = path[0]
            let i, len
            for (i = 0, len = path.length; i < len - 1; i++) {
                _name = this.path[i]
                if (Object.prototype.hasOwnProperty.call(result, this.path[i])) {
                    result = result[_name]
                }
            }
            if (this.type && this.type === 'number') {
                result[_name] = parseFloat(value)
            } else {
                result[_name] = value
            }
            this.$emit('input', data)
        }
    }
}
