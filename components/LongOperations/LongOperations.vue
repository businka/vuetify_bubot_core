<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import storage from './store'
import ActionMixin from '../../helpers/mixinTemplate/action'
// import { ObjectId } from 'bson'

export default {
  name: 'LongOperations',
  components: {
    'LoListSnackBar': () => import('./LoListSnackBar'),
    'Operation': () => import('./Operation')
  },
  mixins: [ActionMixin],
  data: function () {
    return {}
  },
  computed: {
    lo () {
      return this.$store.state[this.$options.name] || {}
    },
    currentOperation () {
      try {
        const uid = this.lo['currentUid']
        return this.lo['operations'][uid]
      } catch (e) {
        return ''
      }
    },
    currentOperationTmplParam () {
      if (this.currentOperation) {
        return Object.assign({} , this.currentOperation.templateParams, { item: this.currentOperation })
      }
      return {}
    }
  },
  mounted () {
    // this.init()
  },
  beforeMount () {
    if (!Object.prototype.hasOwnProperty.call(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
      this.$options.sockets.onopen = () => {
        console.error('ws connect')
      }
      this.$options.sockets.onmessage = (message) => {
        if (message.type !== 'message') return
        const data = JSON.parse(message.data)
        const type = data.type || 'unknown'
        this.$store.dispatch(`LongOperations/on_${type}`, data, {root: true})
      }
    }
  },
  methods: {}

}
</script>


<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <component
      :is="currentOperation.template"
      v-if="lo.showCurrent && currentOperation.template"
      :params="currentOperationTmplParam"
      @action="emitAction"
    />
    <component
      :is="lo.listTemplate"
      v-if="lo.listTemplate && lo.showList"
      :lo="lo"
      @action="emitAction"
    />
  </v-container>
</template>
