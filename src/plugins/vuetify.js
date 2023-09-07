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
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import 'vuetify/styles'
import { es } from 'vuetify/locale'
/* import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'; */


// Composables
import { createVuetify } from 'vuetify'

const RetroBlue = '#2E6FF2'
const AndreaBlue = '#4174D9'
const BlueBlush = '#D7D9D8'
const CapriIsle = '#4F5954'
const SpringKiss = '#E5F2B6'

const MaastrichtBlue = '#011C40'
const MaastrichtBlue2 = '#d7e4ed'
const BlueJeans = '#5CB9F2'
const HeisenbergBlue = '#6DCCF2'
const Scandal = '#ADD9D4'
const SpaghettiMonster = '#F2CD88'


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
    primary: 'd7e4ed',
    onPrimary: MaastrichtBlue,
    secondary: MaastrichtBlue,
    error: 'd7e4ed'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    /*     VueDatePicker, */
  },
  /*   locale: {
      locale: 'es',
      fallback: 'es',
      messages: { es },
    }, */
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customDarkTheme,
      customLightTheme
    },
  },
})

