import ActionMixin from '../../helpers/mixinTemplate/action'
import {updateObject, isEmptyObject} from 'bubot-helpers/BaseHelper';

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
        visible: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        loading: false,
        error: '',
        form: null

    }),
    computed: {
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
        formData: async function() {
            console.log(`FormLoader.mixin watch FormData ${this.formUid}`)
            this.init()
        }
    },
    mounted: async function() {
        await this.init()
    },
    methods: {
        init: async function() {
            console.log(`FormLoader.mixin init ${this.formUid} `)
            if (this.formUid && isEmptyObject(this.formProps))
                if (!this.$store.getters['storeData']('Form', this.formUid)) {
                    this.loading = true
                    this.error = ''
                    try {
                        await this.$store.dispatch(`Form/load`, {
                            uid: this.formUid,
                        }, {root: true})
                        // console.log(`FormLoader.mixin init ${this.formUid} complete`)

                    } catch (err) {
                        this.error = err
                        this.form = null
                        // console.log(`FormLoader.mixin init ${this.formUid} error`)
                    }
                    this.loading = false
                }
            this.updateForm()
        },
        updateForm: function (){
            this.form = updateObject({}, this.$store.getters['storeData']('Form', this.formUid), this.formProps, this.formData)
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
