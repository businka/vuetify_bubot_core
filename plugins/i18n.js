import {createI18n} from 'vue-i18n/dist/vue-i18n.cjs'
import {nextTick} from 'vue'

import axios from 'axios'
import {updateObject} from '@/Helpers/BaseHelper'
import AppConst from '@/AppConst'


export function setupI18n(options = {
  // allowComposition: true, // you need to specify that!
  locale: navigator.language.substr(0, 2).toLowerCase(), // set locale
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: undefined //loadLocaleMessages() // set locale messages

}) {
  // console.log(options.locale)
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale)
  return i18n
}

function setI18nLanguage(i18n, lang) {
  // console.log('setI18nLanguage', lang)

  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export async function loadLocaleMessages(i18n, locale) {

  if (!locale) {
    locale = navigator.language.substr(0, 2).toLowerCase()
  }
  // console.log('loadLocaleMessages', locale)

  // If the language hasn't been loaded yet
  let resp = await axios.get(`/${AppConst.appName}/i18n/${locale}.json`)
  let messages = await loadLocale(locale, resp.data)
  i18n.setLocaleMessage(locale, messages)
  loadedLanguages.push(locale)
  // return setI18nLanguage(locale)

  return nextTick()
}

const loadedLanguages = [] // our default language that is preloaded


async function loadLocale(lang, message) {
  // console.log('loadLocale', lang)
  lang = await import(/* webpackChunkName: "lang-[request]" */ `../i18n/${lang}.json`)
  updateObject(message, lang)
  return message
}

export const i18n = setupI18n()

