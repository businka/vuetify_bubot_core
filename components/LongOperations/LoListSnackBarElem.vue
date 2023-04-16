<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
    name: 'LoListSnackBarElem',
    mixins: [ActionMixin],
    props: ['status', 'uid', 'message', 'result', 'show', 'title', 'progress', 'cancelable'],
    data: function () {
        return {}
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
  <v-hover
    v-if="show"
    v-slot:default="{ hover }"
  >
    <v-list-item
      @click="emitAction('OnCancel', uid)"
    >
      <v-list-item-content>
        <v-list-item-title
          class="text-short"
        >{{title}}
        </v-list-item-title>
        <v-list-item-subtitle
          class="text-short"
        >
          <span title="message"> {{ message }} </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar>
        <v-progress-circular
          v-if="status==='pending' || status==='run'"
          :operation="progress"
          :indeterminate="progress === -1"
          @click.stop="cancelable ? emitAction('OnCancel', uid): emitAction('OnActivate', uid)"
        >
          {{ (cancelable && hover) ? 'X' : (progress >=0 ? progress: '') }}
        </v-progress-circular>
        <v-icon
          v-else-if="status==='success'"
          :color="hover ? '' : 'primary'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ hover ? 'mdi-delete' : 'mdi-check' }}
        </v-icon>
        <v-icon
          v-else-if="status==='error' "
          :color="hover ? '' : 'error'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (hover) ? 'mdi-delete' : 'mdi-alert-octagon-outline' }}
        </v-icon>
        <v-icon
          v-else-if="status==='canceling'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (hover) ? 'mdi-delete' : 'mdi-close' }}
        </v-icon>
        <v-icon
          v-else-if="status==='cancel'"
          :color="hover ? '' : 'error'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (hover) ? 'mdi-delete' : 'mdi-cancel' }}
        </v-icon>
      </v-list-item-avatar>
    </v-list-item>
  </v-hover>
</template>
