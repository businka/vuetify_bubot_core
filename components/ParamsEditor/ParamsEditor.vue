<script>
// import BaseTemplateMixin from '../../jay/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'

import {defineAsyncComponent} from "vue"
// import storage from './store'

export default {
    name: 'ParamEditor',
    components: {
        ParamsString: defineAsyncComponent(() => import('./ParamsString')),
        ParamsSelect: defineAsyncComponent(() => import('./ParamsSelect')),
        ParamsLink: defineAsyncComponent(() => import('./ParamsLink')),
    },
    //todo.чтение схем и данных
    //todo.локализация схем
    mixins: [ActionMixin],
    props: ['schema', 'value', 'paramsIndex', 'path', 'filter'],
    data() {
        return {
            groupShow: {}
        }
    },
    computed: {
        // indexValue: function() {
        //   let params = {}
        //   if (!this.value)
        //     return params
        //   let index, len
        //   for (index = 1, len = this.value.length; index < len; ++index) {
        //     params[this.value[index].name] = index
        //   }
        //   return params
        // }
    },
    // beforeCreate: function() {
    //   this.$options.components.JsonElem = require('./ParamsElem.vue').default
    // },
    methods: {
        showGroup(name) {
            if (Object.prototype.hasOwnProperty.call(this.groupShow, name)) {
                this.groupShow[name] = !this.groupShow[name]
            } else {
                Vue.set(this.groupShow, name, true)
            }

        },
        // onChange(action, path, value) {
        //   console.log('JsonEditor.onChange', action, path, value)
        //   if (Object.prototype.hasOwnProperty.call(this.indexValue, path)) {
        //     path
        //   } else {
        //     action = 'append'
        //   }
        //   this.$emit('change-value', this.edit_value)
        // }
    }
}
</script>
<template>
    <div
        class="pa-0 ma-0"
    >
        <v-container
            v-for="param in schema"
            :key="param.name"
            class="pa-0 ma-0"
        >
            <v-container
                v-if="!filter || filter.indexOf(param.name)>=0"
            >
                <v-container
                    v-if="param.children"
                    class="pa-0 ma-0"
                    flat
                >
                    <v-row class="d-flex pl-1">
                        <!--<v-card-actions-->
                        <!--class="pa-0 ma-0 pb-1"-->
                        <!--&gt;-->
                        <v-btn
                            icon
                            dense
                            @click="showGroup(param.name)"
                        >
                            <v-icon>{{ groupShow[param.name] ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
                            </v-icon>
                        </v-btn>
                        <v-text-field
                            :label="param[`title_${$i18n.locale}`] || param.title || param.name"
                            :placeholder="param.description || null"
                            solo
                            flat
                            hide-details
                            disabled
                            :dense="true"
                        />
                    </v-row>
                    <!--</v-card-actions>-->
                    <!--<v-divider v-if="show" />-->
                    <v-expand-transition>
                        <p
                            v-show="groupShow[param.name]"
                            class="ml-2 pl-2"
                            style="border-left: 1px solid var(--v-delimiter-base)"
                            flat
                            tile
                        >
                            <component
                                :is="child.template"
                                v-for="child in param.children"
                                :key="child.name"
                                :schema="child"
                                :value="Object.prototype.hasOwnProperty.call(paramsIndex, child.name)?value[paramsIndex[child.name]]:{}"
                                :read-only="false"
                                @action="onAction"
                            />
                        </p>
                    </v-expand-transition>
                </v-container>

                <component
                    :is="param.template"
                    v-else
                    :schema="param"
                    :value="Object.prototype.hasOwnProperty.call(paramsIndex, param.name)?value[paramsIndex[param.name]]:{}"
                    :read-only="false"
                    @action="onAction"
                />
            </v-container>
        </v-container>
    </div>
</template>
