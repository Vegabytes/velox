/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */


/**
 * PALETA DE COLORES @@@@@@@@@@@@
 * Color 1: #012030
 * Color 2: #13678A
 * Color 3: #45C4B0
 * Color 4: #9AEBA3
 * Color 5: #DAFDBA
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

const MaastrichtBlue = '#011C40'
const MaastrichtBlue2 = '#d7e4ed'


const customLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    //primary: MaastrichtBlue,
    primary: '#2e1569',
    onPrimary: MaastrichtBlue2,
    secondary: '#FFFFFF',
  }
}

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#000b18',
    surface: '#000b18',
    primary: '#d7e4ed',
    onPrimary: MaastrichtBlue,
    secondary: MaastrichtBlue,
    error: '#d7e4ed',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    locale: 'es',
    messages: { es },
  },
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customDarkTheme,
      customLightTheme
    },
  },
})

