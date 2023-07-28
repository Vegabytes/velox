
// Components
import App from './App.vue'

//Pinia
import { createPinia } from 'pinia'

// Composables
import { createApp } from 'vue'

//Router
import router from "./router/index"

import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css"; // vue3-openlayers version < 1.0.0-*

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
const pinia = createPinia()

registerPlugins(app)

app.use(pinia)
app.use(router)
app.use(OpenLayersMap);
app.mount('#app')
