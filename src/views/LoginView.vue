<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (authStore.isAuthenticated) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" min-width="360" max-width="420" width="100%">
      <v-card-title class="text-h5 mb-2">Sign in</v-card-title>
      <v-card-text>
        <v-alert v-if="authStore.error" type="error" variant="tonal" class="mb-4">
          {{ authStore.error }}
        </v-alert>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="username"
            class="mb-3"
            required
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            class="mb-4"
            required
          />

          <v-btn
            block
            color="primary"
            type="submit"
            :loading="authStore.loading"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
