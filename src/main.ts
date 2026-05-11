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

const bootstrap = async () => {
  // Resolve auth state before initial render to prevent protected layout flash.
  if (!authStore.initialized) {
    try {
      await authStore.fetchUser()
    } catch {
      authStore.clearSession()
    }
  }

  await router.isReady()
  app.mount('#app')
}

void bootstrap()
