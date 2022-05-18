<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonEditorMixin from './JsonEditor.mixin'
import {objHasOwnProperty} from '../../../Helpers/BaseHelper'
import storage from './store'
// import schemaStorage from './ObjSchema.store'


export default {
    name: 'JsonForm',
    components: {
        JsonElem: () => import('./JsonElem'),
        ActionBtn: () => import('../ActionButtons/ActionBtn'),

        // JsonEditor: () => import('./JsonEditor'),
    },
    mixins: [JsonEditorMixin, ActionMixin],
    props: {
        // toolBar: {
        //     type: Object,
        //     default: function () {
        //         return {items: []}
        //     }
        // },
        tabs: {
            type: Array,
            default: function () {
                return undefined
            }
        },
        // defaultAction: {
        //     type: Object,
        //     default: function () {
        //         return {}
        //     }
        // },
        // dataSource: {
        //     type: Object,
        //     default: function () {
        //         return {}
        //     }
        // },
        // item: {
        //     type: Object,
        //     default: function () {
        //         return {}
        //     }
        // },
    },
    data: () => ({
        source: null,
        visible: false,
        // loading: false,
        // schema: {},
        // itemFull: {},
        active: [],
        avatar: null,
        open: [],
        props_schema: null,
        props_data: null
    }),
    computed: {
        // inputListeners: function () {
        //   var vm = this
        //   // `Object.assign` merges objects together to form a new object
        //   return Object.assign({},
        //     this.$listeners,
        //     {
        //       input: function (value) {
        //         vm.$emit('input', value)
        //       }
        //     }
        //   )
        // },
        items() {
            return this.props
        },
        selected() {
            if (!this.active.length) return undefined

            const id = this.active[0]

            return this.users.find(user => user.id === id)
        }
    },
    watch: {
        selected: 'randomAvatar',
        view: function (val) {
            console.log('action ' + val.name + ' view', val.id)
            this.loading = true

            if (!this.visible && this.item.id !== val.id) {
                val.item = {}
            }
            this.visible = true

            this.$http.get(`resource`, {params: {id: val.id}}).then(response => {
                this.item = response.data
                this.loading = false
            })
        }
    },
    mounted() {
        this.init()
    },
    beforeCreate() {
        if (!objHasOwnProperty(this.$store.state, this.$options.name)) {
            this.$store.registerModule(this.$options.name, storage)
        }
        // if (!objHasOwnProperty(this.$store.state, 'ObjSchema')) {
        //     this.$store.registerModule('ObjSchema', schemaStorage)
        // }

    },
    methods: {
        async actionUpdate() {
            await this.$store.dispatch(
                `${this.store.namespace}/update`,
                {
                    store: this.store,
                    params: this.params,
                },
                {root: true})
            this.emitAction({name: ''})
        },
        viewItem() {
            this.visible = true
        },
        close() {
            this.visible = false
        },
        emitInternalAction(action) {
            const context = this.$refs[this.store.uid]
            context.emitAction(action)
        },
        async actionDefaultAction() {
            // await this.dispatchInternalAction({ name: this.form.components.defaultAction.name })
            // this.emitAction({ name: 'CloseForm', data: { name: this.name, result: true } })
            // await this.dispatchAction({name: 'update'})
            await this.source[this.defaultAction.name](this.itemFull)
            this.$emit('action', {name: 'CloseForm', data: {name: this.name, result: false}})
        },
        onClose() {
            this.$emit('action', {name: 'CloseForm', data: {name: this.name, result: false}})
        },
    }
}
</script>

<style lang="scss">
    .v-toolbar__content {
        padding-right: 0;
    }
</style>

<template>
    <v-container class="pa-0 ma-0">
        <v-progress-linear
                :indeterminate="loading"
                height="2"
                background-color="header1_bg"
        />
        <v-toolbar
                height="30"
                flat
                dense
                class="header1_bg pa-0"
        >
            <v-spacer/>
            <v-toolbar-items
                    v-if="toolBar"
                    class="pa-0"
            >
                <component
                        :is="item.template || 'ActionBtn'"
                        v-for="(item, index) in toolBar.items"
                        :key="index"
                        v-bind="item"
                        @action="emitInternalAction"
                />
            </v-toolbar-items>
            <ActionBtn
                    v-if="defaultAction"
                    v-bind="defaultAction"
                    primary
                    @action="actionDefaultAction"
            />
            <v-toolbar-items>
                <v-btn
                        icon
                        dense
                        small
                        @click="onClose"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-toolbar
                v-if="tabs"
                flat
                dense
                height="30"
                class="header1_bg"
        >
            <v-toolbar-items>
                <v-btn
                        text
                        :class="activeTab===0? 'activeTab text-none' : 'Tab text-none'"
                        @click="activeTab=0"
                >
                    {{ tabs[0][`title_${$i18n.locale}`] || tabs[0].title }}
                </v-btn>
            </v-toolbar-items>

            <v-spacer/>

            <v-toolbar-items>
                <v-container
                        v-for="(tab, index) in tabs"
                        :key="index"
                >
                    <v-btn
                            v-if="index>0"
                            text
                            :class="activeTab===index ? 'activeTab text-none' : 'text-none'"
                            @click="activeTab=index"
                    >
                        {{ tab[`title_${$i18n.locale}`] || tab.title }}
                    </v-btn>
                </v-container>
            </v-toolbar-items>
        </v-toolbar>
        <v-container
                v-if="!loading"
                class="pa-4 pt-0 pb-0 ma-0"
        >
            <JsonElem
                    :schema="schema"
                    :elem-value="itemFull"
                    elem-name=""
                    :read-only="false"
                    path=""
                    @action="onAction"
            />
        </v-container>
    </v-container>

</template>
