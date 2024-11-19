import ActionMixin from '../../../../helpers/mixinTemplate/action'
import { getPropValueByPath } from '../../../../../Helpers/BaseHelper'

export default {
    mixins: [ActionMixin],
    props: {
        items: {
            type: Array,
            default: () => [{
            }]
        },
        modelValue: {
            type: Object,
            default: () => {
            }
        },
        index: {
            type: Number
        },
        field: {
            type: String
        },

        title: {
            type: String
        },
        // type: {
        //     type: String,
        //     default: 'string'
        // },
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
            return getPropValueByPath(this.modelValue, this.field, '')
        },
    },
    methods: {
        getPreviousValue() {
            let previousIndex = this.index - 1
            if (previousIndex < 0)
                return undefined
            let previous = this.items[this.index - 1]
            return getPropValueByPath(previous, this.field, '')
        },
        onChange (value) {
            let data = Object.assign({}, this.modelValue)
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
