<script>
// import BaseTemplateMixin from '../../helpers/mixinTemplate/baseForm'
// import storage from './store'
import ActionMixin from '../../helpers/mixinTemplate/action'
// import { ObjectId } from 'bson'

export default {
  name: 'SnackBarLo',
  components: {
    // 'SnackBarLO': () => import('./SnackBarLO')
    // 'RowViewer': () => import('../Cells/RowViewer'),
    // 'RowEditor': () => import('../Cells/RowEditor')
  },
  mixins: [ActionMixin],
  props: ['lo'],
  data: function () {
    return {}
  },
  computed: {
    // lo () {
    //   return this.$store.state[this.$options.name] || {}
    // }
  },
  mounted () {
    // this.init()
  },
  beforeMount () {
  },
  methods: {
    onCancel: function (uid) {
      console.log(`cancel ${uid}`)
      this.$store.dispatch('LongOperations/cancel', uid, { root: true })
    },
    onDelete: function (uid) {
      console.log(`delete ${uid}`)
      this.$store.commit('LongOperations/delete', uid, { root: true })
    },
    onActivate: function (uid) {
      this.$store.commit('LongOperations/showOperation', uid, { root: true })
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

  .text-short:hover {
    white-space: normal; /* Обычный перенос текста */
  }</style>
<template>
  <v-snackbar
    :value="true"
    vertical
    :timeout="0"
    right
    color="white"
  >
    <v-system-bar>
      <span>Long operations</span>
      <v-spacer></v-spacer>
      <v-icon @click="$store.commit('LongOperations/hideList', null, {root: true})">mdi-chevron-down</v-icon>
    </v-system-bar>
    <v-list
      style="max-height: 400px"
      class="pa-0 overflow-y-auto"
    >
      <v-container
        v-for="(value, uid) in lo.operations"
        :key="uid"
        class="d-flex pa-0"
      >
        <v-hover
          v-if="value.show"
          v-slot:default="{ hover }"
        >
          <v-list-item
            @click="onActivate(uid)"
          >
            <v-list-item-content>
              <v-list-item-title
                class="text-short"
                v-text="value.title"
              />
              <v-list-item-subtitle
                v-text="value.message"
                class="text-short"
              />
            </v-list-item-content>
            <v-list-item-avatar>
              <v-progress-circular
                v-if="value.status==='pending' || value.status==='run'"
                :value="value.progress"
                :indeterminate="value.progress === -1"
                @click.stop="value.cancelable ? onCancel(uid): onActivate(uid)"
              >
                {{ (value.cancelable && hover) ? 'X' : (value.progress >=0 ? value.progress: '') }}
              </v-progress-circular>
              <v-icon
                v-else-if="value.status==='success'"
                @click.stop="onDelete(uid)"
              >
                {{ (hover) ? 'mdi-delete' : 'mdi-check' }}
              </v-icon>
              <v-icon
                v-else-if="value.status==='error'"
                @click.stop="onDelete(uid)"
              >
                {{ (hover) ? 'mdi-delete' : 'mdi-alert-octagon-outline' }}
              </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-hover>
      </v-container>
    </v-list>
  </v-snackbar>
</template>
