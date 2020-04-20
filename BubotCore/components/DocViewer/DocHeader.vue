<script>
// import BaseTemplateMixin from '../../jay/mixinTemplate/baseForm'
import ActionMixin from '@/helpers/mixinTemplate/action'
// import Vue from 'vue'
// import storage from './store'

export default {
  name: 'ParamEditor',
  components: {
    // ParamsString: () => import('./ParamsString'),
    // ParamsLink: () => import('./ParamsLink'),
  },
  //todo.чтение схем и данных
  //todo.локализация схем
  mixins: [ActionMixin],
  props: ['schema', 'value', 'paramsIndex', 'path', 'data'],
  data() {
    return {
      show: false
    }
  },
  methods: {
    // onChange(action, path, value) {
    //   console.log('JsonEditor.onChange', action, path, value)
    //   if (this.indexValue.hasOwnProperty(path)) {
    //     path
    //   } else {
    //     action = 'push'
    //   }
    //   this.$emit('change-value', this.edit_value)
    // }
  }
}
</script>
<template>
  <div
    class="pa-0 ma-0 d-flex flex-column"
  >
    <BtnLink
      :value="data.item.org"
      path="item/org"
      :params="{title: 'Организация', description: '', form:'/Catalog/Organization/Select'}"
      @action="emitAction"
    />
    <BtnLink
      :value="data.item.org"
      path="item/org"
      :params="{title: 'Подразделение', description: '', form:'/Catalog/Organization/Select'}"
      @action="emitAction"
    />
  </div>
</template>