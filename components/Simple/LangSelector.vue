<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn
        text
        dense
        x-small
        v-on="on"
      >
        {{ $i18n.locale }}
      </v-btn>
    </template>
    <v-list
      dense
    >
      <v-list-item
        v-for="lang in langs"
        :key="lang"
        @click="changeLang(lang)"
      >
        <v-list-item-title>{{ lang }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>

export default {
  name: 'LangSelector',
  data: function() {
    return {
      langs: ['ru', 'en', 'cn'],
    }
  },
  methods: {
    changeLang(lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
