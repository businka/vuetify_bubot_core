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
  <v-badge
    v-if="count"
    :content="count"
    inline
    @click="$store.commit('LongOperations/showList', null, {root: true})"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          class="mr-0"
          v-on="on"
          @click="$store.commit('LongOperations/showList', null, {root: true})"
        >
          mdi-timer-sand
        </v-icon>
      </template>
      <span>{{ $t('Long operations') }}</span>
    </v-tooltip>
  </v-badge>
</template>
