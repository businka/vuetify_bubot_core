import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import messages from '@/lang/en'
import axios from 'axios'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: navigator.language.substr(0, 2).toLowerCase(), // set locale
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: undefined //loadLocaleMessages() // set locale messages
})

const loadedLanguages = [] // our default language that is preloaded

// function loadLocaleMessages () {
//   const locales = require.context('../../i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (!lang)
    lang = navigator.language.substr(0, 2).toLowerCase()
  // If the same language and If the language was already loaded
  if (i18n.locale === lang && loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language hasn't been loaded yet
  return axios.get(`/i18n/${lang}.json`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.data)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
  )

  // import(/* webpackChunkName: "lang-[request]" */ `../../i18n/${lang}.json`).then(
  //   messages => {
  //     i18n.setLocaleMessage(lang, messages.default)
  //     loadedLanguages.push(lang)
  //     return setI18nLanguage(lang)
  //   }
  // )
}
