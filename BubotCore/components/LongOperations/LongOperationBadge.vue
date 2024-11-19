<script>
export default {
  name: 'LongOperationBadge',
  computed: {
    count () {
      try {
        return this.$store.state['LongOperations']['executed']
      } catch {
        return 0
      }
    }
  }
}
</script>
<template>
  <v-btn
    class="pa-0"
    :title="$t('Long operations')"
    density="compact"
    @click="$store.commit('LongOperations/showList', null, {root: true})"
  >
    <template v-slot:append>
      <v-badge
        v-if="count"
        inline
        :content="count"
      >
        <v-icon>mdi-timer-sand</v-icon>
      </v-badge>
    </template>
  </v-btn>
</template>
