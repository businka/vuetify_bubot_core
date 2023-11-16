<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
import storage from './LongOperations.store'
import ActionMixin from '../../helpers/mixinTemplate/action'
import {objHasOwnProperty} from '@/Helpers/BaseHelper'
// import { ObjectId } from 'bson'
import {defineAsyncComponent} from "vue"

export default {
  name: 'LongOperations',
  components: {
    'LoListSnackBar': defineAsyncComponent(() => import('./LoListSnackBar')),
    'LongOperationResult': defineAsyncComponent(() => import('./LongOperationResult'))
  },
  mixins: [ActionMixin],
  data: function () {
    return {}
  },
  computed: {
    showList: function () {
      return this.$store.state[this.$options.name].showList
    },
    showCurrent: function () {
      return this.$store.state[this.$options.name].showCurrent
    },
    listTemplate: function () {
      return this.$store.state[this.$options.name].listTemplate
    },
    currentUid: function () {
      return this.$store.state[this.$options.name].currentUid
    },
    currentOperation: function () {
      if (this.currentUid) {
        return this.$store.getters[`${this.$options.name}/find`](this.currentUid)
      } else {
        return undefined
      }
    },
    currentOperationTmplProps() {
      if (this.currentOperation) {
        return Object.assign({}, this.currentOperation['templateProps'], {item: this.currentOperation})
      }
      return {}
    }
  },
  mounted() {
    // this.init()
  },
  beforeMount() {
    if (!objHasOwnProperty(this.$store.state, this.$options.name)) {
      this.$store.registerModule(this.$options.name, storage)
      if (this.$options.sockets) {
        this.$options.sockets.onopen = () => {
          console.log('ws connect')
        }
        this.$options.sockets.onmessage = (message) => {
          if (message.type !== 'message') return
          const data = JSON.parse(message.data)
          const type = data.type || 'unknown'
          this.$store.dispatch(`LongOperations/on_${type}`, data, {root: true})
        }

      }
    }
  },
  methods: {
    actionCloseForm: function () {
      this.$store.commit('LongOperations/hideOperation', null, {root: true})
    }
  }

}
</script>


<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <span v-if="showCurrent || (listTemplate && showList)">
    <LongOperationResult
      v-if="showCurrent"
      :form-data="currentOperation.dataSource? {dataSource: currentOperation.dataSource}: undefined"
      :uid="currentUid"
      v-bind="currentOperation"
      @action="onAction"
    />
    <component
      :is="listTemplate"
      v-if="listTemplate && showList"
      :nameStorageModule="$options.name"
      @action="onAction"
    />
  </span>
</template>
