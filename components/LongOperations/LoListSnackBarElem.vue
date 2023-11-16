<script>
import ActionMixin from '../../helpers/mixinTemplate/action'

export default {
  name: 'LoListSnackBarElem',
  mixins: [ActionMixin],
  props: ['status', 'uid', 'message', 'result', 'show', 'title', 'progress', 'cancelable', 'formUid'],
  data: function () {
    return {}
  }
}
</script>
<style lang="scss">
.v-snack--vertical .v-snack__content {
  padding: 0;
}

.lo {
  .v-list-item__prepend {
    width: 28px;

    .v-list-item__spacer {
      width: 0;
    }
  }
}

.text-short {
  width: 100px;
  white-space: nowrap; /* Отменяем перенос текста */
  overflow: hidden; /* Обрезаем содержимое */
  text-overflow: ellipsis; /* Многоточие */
}

/*.text-short:isHovering {*/
/*  white-space: normal; !* Обычный перенос текста *!*/
/*}*/
</style>
<template>
  <v-hover
    v-if="show"
    v-slot="{ isHovering }"
  >
    <v-list-item
      class="lo pl-2"
      :title="title"
      :subtitle="message"
      @click="emitAction('OnActivate', uid)"
    >
      <template v-slot:prepend>
        <v-progress-circular
          v-if="status==='pending' || status==='run'"
          size="small"
          :operation="progress"
          :indeterminate="progress === -1"
          @click.stop="cancelable ? emitAction('OnCancel', uid): emitAction('OnActivate', uid)"

        >
          {{ (cancelable && isHovering) ? 'X' : (progress >= 0 ? progress : '') }}
        </v-progress-circular>
        <v-icon
          v-else-if="status==='success'"
          :color="isHovering ? '' : 'primary'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ isHovering ? 'mdi-delete' : 'mdi-check' }}
        </v-icon>
        <v-icon
          v-else-if="status==='error' "
          :color="isHovering ? '' : 'error'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (isHovering) ? 'mdi-delete' : 'mdi-alert-octagon-outline' }}
        </v-icon>
        <v-icon
          v-else-if="status==='canceling'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (isHovering) ? 'mdi-delete' : 'mdi-close' }}
        </v-icon>
        <v-icon
          v-else-if="status==='cancel'"
          :color="isHovering ? '' : 'error'"
          @click.stop="emitAction('OnDelete', uid)"
        >
          {{ (isHovering) ? 'mdi-delete' : 'mdi-cancel' }}
        </v-icon>
      </template>

    </v-list-item>
  </v-hover>
</template>
