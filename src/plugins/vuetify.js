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


// Composables
import { createVuetify } from 'vuetify'

const RetroBlue = '#2E6FF2'
const AndreaBlue = '#4174D9'
const BlueBlush = '#D7D9D8'
const CapriIsle = '#4F5954'
const SpringKiss = '#E5F2B6'

const MaastrichtBlue = '#011C40'
const BlueJeans = '#5CB9F2'
const HeisenbergBlue = '#6DCCF2'
const Scandal = '#ADD9D4'
const SpaghettiMonster = '#F2CD88'


const customLightTheme = {
  dark: false,
  colors: {
    background: '#E3F2FD',
    surface: Scandal,
    primary: MaastrichtBlue,
    secondary: '#E1F5FE',
  }
}

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#52A5D9',
    surface:MaastrichtBlue ,
    primary: Scandal,
    secondary: CapriIsle,
    error:Scandal
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

