<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import JsonEditorMixin from './JsonEditor.mixin'
// import {initDataSource} from '../DataSource/DataSourceLoader'
// import {objHasOwnProperty} from '../../helpers/baseHelper'
// import schemaStorage from './ObjSchema.store'


export default {
    name: "SimpleForm",
    components: {
        // JsonElem: () => import('./JsonElem'),
    },
    mixins: [JsonEditorMixin, ActionMixin],
    props: {
        content: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data: () => ({
    }),
    computed: {
    },
    mounted() {
        this.init()
    },
    methods: {
        emitInternalAction(action) {
            const content = this.$refs['content']
            content.onAction(action)
        },
        async actionUpdate() {
            this.itemFull = await this.source.update(this.itemFull)
        },
        async actionDefaultAction() {
            await this.source[this.defaultAction.name](this.itemFull)
            let _id = this.itemFull[this.dataSource.keyProperty]
            if (_id) {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRow: [_id]}})
            } else {
                this.$emit('action', {name: 'CloseForm', data: {name: this.name, fetchRows: true}})
            }
        },
        onClose() {
            this.$emit('action', {name: 'CloseForm', data: {name: this.name}})
        },
    }
}
</script>

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
                class="form-toolbar pa-0"
        >
            <v-spacer/>
            <v-toolbar-items
                    v-if="toolBar"
                    class="pa-0"
            >
                <component
                        :is="item.template || 'ActionBtn'"
                        v-for="(item, i) in toolBar.items"
                        :key="i"
                        v-bind=item
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
        <component
                :is="content.template"
                v-if="content && itemFull"
                ref="content"
                v-bind="content"
                :schema="schema"
                :item="itemFull"
                :key-property="dataSource.keyProperty"
                @action="onAction"
        />
    </v-container>
</template>

<style lang="scss">
    .form-toolbar {
        .v-toolbar__content {
            padding-right: 0;
        }
    }
</style>