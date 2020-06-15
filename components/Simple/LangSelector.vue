<script>
import { loadLanguageAsync } from '../../plugins/i18n'
export default {
  name: 'LangSelector',
  data: function () {
    return {
      langs: ['ru', 'en', 'cn'],
    }
  },
  methods: {
    changeLang (lang) {
      loadLanguageAsync(lang)
      // this.$i18n.locale = lang
    }
  }
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn
        text
        dense
        x-small
        v-on="on"
      >
        <div :class="`LangSelectorFlag LangSelectorFlag-${$i18n.locale}`" />
        <div class="pl-1 LangSelectorText">
          {{ $i18n.locale }}
        </div>
      </v-btn>
    </template>

    <v-list
      min-width="60px"
      class="pa-0"
    >
      <v-list-item
        v-for="lang in langs"
        :key="lang"
        max
        class="d-flex flex-row"
        @click="changeLang(lang)"
      >
        <div :class="`d-flex LangSelectorFlag LangSelectorFlag-${lang}`" />
        <div class="pl-1 LangSelectorText">
          {{ lang }}
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<style lang="scss">
  .LangSelectorFlag {
    background: url("../../../assets/img/flags.png");
    /*background-position: left center;*/
    background-repeat: no-repeat;
    width: 20px;
    height: 14px;
  }

  .LangSelectorFlag-ru {
    background-position: 0 -563px;
  }

  .LangSelectorFlag-en {
    background-position: 0 -763px;
  }

  .LangSelectorFlag-cn {
    background-position: 0 -123px;
  }

  .LangSelectorText {
    /*text-transform: uppercase;*/

    /*height: 24px;*/
  }

</style>
