import ActionMixin from '../../helpers/mixinTemplate/action'
import {updateObject, isEmptyObject} from '../../helpers/baseHelper';

export default {
    mixins: [ActionMixin],
    props: {
        formUid: {
            type: String,
        },
        formProps: {
            type: Object,
            default: function () {
                return {}
            }
        },
        formData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // panelName: {
        //     type: String,
        // },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        loading: false,
        error: ''
    }),
    computed: {
        form() {
            return updateObject({}, this.$store.getters['storeData']('Form', this.formUid), this.formProps, this.formData)
        },
        width() {
            return this.form ? this.form.width || 600 : 600
        },
        errorType() {
            if (!this.error) return ''
            if (this.error && typeof error === 'string') {
                return 'string'
            }
        },
        errorMessage() {
            switch (this.errorType) {
                case '':
                    return ''
                case 'string':
                    return this.error
                default:
                    return String(this.error)
            }

        }
    },
    watch: {
        // formData() {
        //     this.init()
        // }
    },
    mounted() {
        this.init()
    },
    methods: {
        init: async function() {
            if (this.formUid && isEmptyObject(this.formProps))
                if (!this.$store.getters['storeData']('Form', this.formUid)) {
                    this.loading = true
                    this.error = ''
                    try {
                        await this.$store.dispatch(`Form/load`, {
                            uid: this.formUid,
                        }, {root: true})

                    } catch (err) {
                        this.error = err
                    }
                    this.loading = false
                    console.log('init form loader ' + this.formUid)
                }
        },
        emitInternalAction: function (action) {
            const context = this.$refs[this.form]
            context.emitAction(action)
        },
        dispatchInternalAction: function (action) {
            const context = this.$refs[this.form]
            context.dispatchAction(action)
        }

    }
}
