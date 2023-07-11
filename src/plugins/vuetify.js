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

const customLightTheme = {
  dark: false,
  colors: {
    background: '#E3F2FD',
    surface: '#82B1FF',
    primary: '#E65100',
    secondary: '#039BE5',
  }
}

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#1A237E',
    surface: '#1A237E',
    primary: '#FF5722',
    secondary: '#FFE0B2',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customDarkTheme,
      customLightTheme
    },
  },
})