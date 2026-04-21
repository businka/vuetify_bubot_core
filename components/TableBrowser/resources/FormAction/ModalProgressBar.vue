
<script>
export default {
  name: "ModalProgressBar",
  props: ['visible', 'title', 'message', 'progress', 'error', 'cancelFunction', 'status']
}
</script>

<style scoped>

</style>

<template>
  <v-dialog
      :model-value="visible"
      width="500"
      persistent
  >
    <v-card>
      <v-card-title class="headline bg-grey-lighten-2">
        {{title}}
      </v-card-title>

      <v-card-text
          class="pt-4"
      >
        {{message}}
        <v-progress-linear
            v-if="status==='run'"
            :model-value="progress"
            height="25"
            color="primary"
        />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            v-if="cancelFunction && status==='run'"
            text
            @click="cancelFunction"
        >
          Отмена
        </v-btn>
        <v-btn
            v-if="status!=='run'"
            text
            @click="$emit('action', {name: 'CloseForm'})"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
