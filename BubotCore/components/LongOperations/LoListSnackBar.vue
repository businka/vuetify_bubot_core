<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
// import storage from './store'
import ActionMixin from '../../helpers/mixinTemplate/action'
// import { ObjectId } from 'bson'

export default {
    name: 'LoListSnackBar',
    components: {
        'LoListSnackBarElem': () => import('./LoListSnackBarElem')
    },
    mixins: [ActionMixin],
    props: ['lo'],
    data: function () {
        return {}
    },
    computed: {
        operations() {
            return this.lo.operations || []
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
  .v-snack--vertical .v-snack__content {
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
    :value="true"
    vertical
    :timeout="-1"
    outlined
    right
    color="white"
  >
    <v-card>
      <v-system-bar>
        <span>Long operations</span>
        <v-spacer></v-spacer>
        <v-icon @click="$store.commit('LongOperations/hideList', null, {root: true})">mdi-chevron-down</v-icon>
      </v-system-bar>
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
    </v-card>
  </v-snackbar>
</template>
