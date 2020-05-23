<template>
  <div v-if="data">
    <div class="row ma-0">
      <component
        :is="params.components.toolBar.template"
        v-if="params.components.toolBar"
        :store-params="{
          form:storeParams.form,
          namespace: store.namespace,
          uid: `${storeParams.form}`,
        }"
        :params="params.components.toolBar"
        @action="emitAction"
      />
    </div>
    <!--<div class="row">-->
      <!--<component-->
        <!--:is="params.components.massOperationsBar.template"-->
        <!--v-if="params.components.massOperationsBar"-->
        <!--:store-params="{-->
          <!--form:storeParams.form,-->
          <!--namespace: store.namespace,-->
          <!--uid: `${storeParams.form}`,-->
        <!--}"-->
        <!--class="jay-bordered"-->
        <!--:params="params.components.massOperationsBar"-->
      <!--/>-->
    <!--</div>-->
    <!--<div class="row">-->
    <!--<component-->
    <!--v-if="params.components.filterBar"-->
    <!--v-bind:is="params.components.filterBar.template"-->
    <!--:storeParams="{-->
    <!--form:storeParams.form,-->
    <!--namespace: store.namespace,-->
    <!--uid: `${storeParams.form}`,-->
    <!--}"-->
    <!--:params=params.components.filterBar-->
    <!--&gt;</component>-->
    <!--</div>-->
    <component
      :is="params.components.content.template"
      v-if="params.components.content"
      :mode-params="modeParams"
      :store-params="{
        form:storeParams.form,
        uid: `${storeParams.uid}`,
      }"
      :params="params.components.content"
      @action="emitAction"
    />
  </div>
</template>

<style lang="scss">
  .jay-toolbar {
    height: 40px;
  }

  .bordered {
    border-bottom: 1px solid var(--v-delimiter-base);
  }
</style>

<script>
import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import ActionMixin from '../../helpers/mixinTemplate/action'
import storage from './store'

export default {
  name: 'Browser',
  components: {},
  mixins: [BaseTemplateMixin, ActionMixin],
  mounted() {
    this.init()
  },
  beforeMount() {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
    }
  },
  methods: {
    actionMassOperationsBarVisible(action) {
      this.$store.commit(
        `${this.store.namespace}/massOperationsBarVisible`, {
          uid: this.store.uid,
          value: action
        })
    },
    actionMarkRemove() {

    },
    actionMarkAll() {

    },
    actionMarkInvert() {

    }
  }
}
</script>
