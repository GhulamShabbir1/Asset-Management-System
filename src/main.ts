import vuetify from '@/plugins/vuetify'
import router from '@/routes'
import { useAuthStore } from '@/stores/authStore'
import { UNAUTHORIZED_EVENT } from '@/utils/errorHandler'
import pinia from '@/stores'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(vuetify)

const authStore = useAuthStore(pinia)

window.addEventListener(UNAUTHORIZED_EVENT, () => {
  authStore.clearSession()

  if (router.currentRoute.value.name !== 'login') {
    void router.push({ name: 'login' })
  }
})

void authStore.fetchUser().catch(() => {
  if (router.currentRoute.value.meta.requiresAuth) {
    void router.push({ name: 'login' })
  }
})

// Mount app
app.mount('#app')
