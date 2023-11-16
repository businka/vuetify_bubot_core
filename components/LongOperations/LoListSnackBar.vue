<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
// import storage from './store'
import ActionMixin from '../../helpers/mixinTemplate/action'
import {defineAsyncComponent} from "vue"
// import { ObjectId } from 'bson'

export default {
    name: 'LoListSnackBar',
    components: {
        'LoListSnackBarElem': defineAsyncComponent(() => import('./LoListSnackBarElem'))
    },
    mixins: [ActionMixin],
    props: ['nameStorageModule'],
    data: function () {
        return {}
    },
    computed: {
        operations() {
          return this.$store.state[this.nameStorageModule].operations
        }
    },
    mounted() {
        // this.init()
    },
    beforeMount() {
    },
    watch: {
        operations() {
            console.log('bar watch oper')

        }
    },
    methods: {
        actionOnCancel: function (uid) {
            console.log(`cancel ${uid}`)
            this.$store.dispatch('LongOperations/cancel', uid, {root: true})
        },
        actionOnDelete: function (uid) {
            console.log(`delete ${uid}`)
            this.$store.commit('LongOperations/delete', uid, {root: true})
        },
        actionOnActivate: function (uid) {
            this.$store.commit('LongOperations/showOperation', uid, {root: true})
        }
    }

}
</script>
<style lang="scss">
.v-snackbar__content {
    padding: 0;
  }

  .text-short {
    width: 100px;
    white-space: nowrap; /* Отменяем перенос текста */
    overflow: hidden; /* Обрезаем содержимое */
    text-overflow: ellipsis; /* Многоточие */
  }

  /*.text-short:hover {*/
  /*  white-space: normal; !* Обычный перенос текста *!*/
  /*}*/
</style>
<template>
  <v-snackbar
    :model-value="true"
    vertical
    :timeout="-1"
    outlined
    location="bottom end"
    right
    color="white"
  >
    <v-container class="pa-0">
      <v-toolbar density="compact" class="pl-2 pr-2">
        <span>Long operations</span>
        <v-spacer></v-spacer>
        <v-icon
          class="pr-2"
          @click="$store.commit('LongOperations/delete', null, {root: true})"
        >mdi-delete</v-icon>
        <v-icon @click="$store.commit('LongOperations/hideList', null, {root: true})">mdi-chevron-down</v-icon>
      </v-toolbar>
      <v-list
        style="max-height: 400px; min-width: 350px;"
        class="pa-0 overflow-y-auto"
      >
        <lo-list-snack-bar-elem
          v-for="(operation, index) in operations"
          :key="index"
          v-bind="operation"
          @action="onAction"
        ></lo-list-snack-bar-elem>
      </v-list>
    </v-container>
  </v-snackbar>
</template>
