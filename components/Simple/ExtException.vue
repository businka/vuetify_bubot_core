<script>
export default {
  name: 'ExtException',
  props: ['message', 'detail'],
  data: function () {
    return {}
  },
}
</script>
<style lang="scss">
</style>

<template>
  <v-card>
    <v-row>
      <v-col>
        {{message}}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{detail}}
      </v-col>
    </v-row>

  </v-card>
</template>
