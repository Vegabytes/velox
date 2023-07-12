
// Components
import App from './App.vue'

//Pinia
import { createPinia } from 'pinia'

// Composables
import { createApp } from 'vue'

//Router
import router from "./router/index"

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
const pinia = createPinia()

registerPlugins(app)

app.use(pinia)
app.use(router)
app.mount('#app')
