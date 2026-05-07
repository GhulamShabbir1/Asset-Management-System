<template>
  <v-container fluid class="fill-height pa-0 bg-surface">
    <v-row no-gutters class="fill-height ma-0">
      <!-- LEFT PANEL: LOGIN FORM -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 pa-md-10">
        <v-card class="w-100 mx-auto rounded-xl elevation-4 pa-6 pa-sm-8" max-width="440">
          <!-- HEADER -->
          <div class="text-center mb-8">
            <v-img src="@/assets/logo.png" height="50" contain class="mx-auto" />
            <h1 class="text-h5 font-weight-bold mt-4 text-on-surface">Welcome Back</h1>
            <p class="text-body-2 text-medium-emphasis">
              Sign in to your account to manage your assets
            </p>
          </div>

          <!-- ERROR ALERT -->
          <v-alert
            v-if="showAlert"
            type="error"
            variant="tonal"
            closable
            class="mb-6"
            @click:close="showAlert = false"
          >
            {{ alertMessage }}
          </v-alert>

          <!-- LOGIN FORM -->
          <v-form ref="formRef" v-model="isFormValid" validate-on="input" @submit.prevent="validateAndLogin">
            <!-- EMAIL -->
            <v-text-field
              v-model="email"
              label="Email Address"
              type="email"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              prepend-inner-icon="mdi-email-outline"
              validate-on="input"
              class="mb-4"
              :rules="[rules.required, rules.email]"
            />

            <!-- PASSWORD -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              validate-on="input"
              class="mb-4"
              :rules="[rules.required]"
            />

            <!-- FORGOT PASSWORD LINK -->
            <div class="d-flex align-center justify-space-between mb-6">
              <span />
              <v-btn
                variant="text"
                to="/forget-password"
                class="text-caption text-none px-0"
                color="primary"
              >
                Forgot Password?
              </v-btn>
            </div>

            <!-- LOGIN BUTTON -->
            <v-btn
              color="primary"
              size="large"
              block
              type="submit"
              :loading="loading"
              :disabled="!canSubmit || loading"
            >
              Sign In
            </v-btn>
          </v-form>

          <!-- SIGNUP LINK -->
          <div class="text-center mt-6">
            <span class="text-body-2 text-medium-emphasis">Don't have an account?</span>
            <v-btn variant="text" to="/register" class="text-none font-weight-medium px-1">
              Create one
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT PANEL: BRAND MESSAGE -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center bg-primary text-white pa-10">
        <div class="text-center px-6">
          <v-icon size="80" class="mb-6">mdi-shield-lock-outline</v-icon>
          <h2 class="text-h4 font-weight-bold mb-3">Secure Access</h2>
          <p class="text-body-1">
            Your assets are protected with enterprise-grade security. Sign in to your secure dashboard now.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { validateEmail, validateRequired } from '../../utils/validation'
import type { LoginPayload } from '../../services/authService'

const router = useRouter()
const authStore = useAuthStore()

// FORM STATE
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

// ALERT STATE
const showAlert = ref(false)
const alertMessage = ref('')

// VALIDATION RULES
const rules = {
  required: (v: string) => {
    const result = validateRequired(v, 'This field')
    return result.valid ? true : result.error || 'This field is required'
  },
  email: (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email address'
  },
}

const canSubmit = computed(() => {
  const isEmailValid = validateEmail(email.value).valid
  const isPasswordValid = validateRequired(password.value, 'Password').valid

  return isFormValid.value && isEmailValid && isPasswordValid && !loading.value
})

// LOGIN HANDLER
const validateAndLogin = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  loading.value = true
  showAlert.value = false

  try {
    const payload: LoginPayload = {
      email: email.value.trim(),
      password: password.value,
    }

    await authStore.login(payload)

    const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (error: any) {
    alertMessage.value =
      error?.response?.data?.message || error.message || 'Failed to login. Please check your credentials.'
    showAlert.value = true
  } finally {
    loading.value = false
  }
}
</script>

