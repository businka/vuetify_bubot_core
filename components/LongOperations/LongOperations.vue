<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import storage from './store'
import ActionMixin from '../../helpers/mixinTemplate/action'
import { objHasOwnProperty } from '../../helpers/baseHelper'
// import { ObjectId } from 'bson'

export default {
  name: 'LongOperations',
  components: {
    'LoListSnackBar': () => import('./LoListSnackBar'),
    'LoResult': () => import('./LongOperationResult')
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
    currentOperationTmplProps () {
      if (this.currentOperation) {
        return Object.assign({}, this.currentOperation['templateProps'], { item: this.currentOperation })
      }
      return {}
    }
  },
  mounted () {
    // this.init()
  },
  beforeMount () {
    if (!objHasOwnProperty(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
      this.$options.sockets.onopen = () => {
        console.log('ws connect')
      }
      this.$options.sockets.onmessage = (message) => {
        if (message.type !== 'message') return
        const data = JSON.parse(message.data)
        const type = data.type || 'unknown'
        this.$store.dispatch(`LongOperations/on_${type}`, data, { root: true })
      }
    }
  },
  methods: {
    actionCloseEditForm: function () {
      this.$store.commit('LongOperations/hideOperation', null, { root: true })
    }
  }

}
</script>


<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <LoResult
      v-if="lo.showCurrent"
      :form-data="{dataSource: currentOperation.dataSource}"
      :uid=lo.currentUid
      v-bind="currentOperation"
      @action="onAction"
    />
    <component
      :is="lo.listTemplate"
      v-if="lo.listTemplate && lo.showList"
      :lo="lo"
      @action="onAction"
    />
  </v-container>
</template>
