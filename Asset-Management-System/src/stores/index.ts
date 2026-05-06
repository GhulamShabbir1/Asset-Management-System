/**
 * Create and configure Pinia store
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// Add persistence plugin
pinia.use(piniaPluginPersistedstate)

export default pinia
