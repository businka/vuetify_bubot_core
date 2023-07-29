// import Vue from 'vue'
// import Vuetify from 'vuetify/lib'
// import { i18n } from './i18n'
// import '@mdi/font/css/materialdesignicons.css'
//
// Vue.use(Vuetify)
//
// export default new Vuetify({
//   lang: {
//     t: (key, ...params) => i18n.t(key, params),
//   },
//   icons: {
//     iconfont: 'mdi',
//   }
// })
/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})

