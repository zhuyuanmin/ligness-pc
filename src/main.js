import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'

import 'virtual:svg-icons-register'

import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'

const app = createApp(App)

app.component('svg-icon', SvgIcon)

app.use(router)
  .use(createPinia())
  .mount('#app')
