<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row
    v-if="data"
    class="pa-0 ma-0"
  >
    <v-col
      class="pa-0 ma-0"
      :xl="params.xl || '7'"
      :lg="params.xl || '9'"
      :sm="params.xl || '12'"
      :xs="params.xl || '12'"
    >
    </v-col>
  </v-row>
</template>