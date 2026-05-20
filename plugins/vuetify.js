
/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles

import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#333333', // Ваш цвет (красный)
          secondary: '#EOEOEO',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          'primary-btn': '#333333',
          "toolbar-bg": '#F5F5F5'
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#212121', // Ваш цвет (красный)
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          'primary-btn': '#FF5252',
          "toolbar-bg": '#F5F5F5'
        }
      }
    },
  },
})

