<template>
  <v-app>
    <v-row no-gutters class="fill-height ma-0 overflow-hidden">
      
      <v-col cols="12" md="6" class="bg-grey-lighten-4 d-flex flex-column justify-center align-center pa-4 pa-md-8">
        <v-sheet max-width="400" width="100%" color="transparent">
          
          <div class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-sheet color="black" width="32" height="32" rounded="sm" class="d-flex align-center justify-center me-3">
                <v-icon color="success" size="20">mdi-package-variant-closed</v-icon>
              </v-sheet>
              <h1 class="text-h5 font-weight-black text-black ma-0">Shelf</h1>
            </div>
            <div>
              <h2 class="text-h6 font-weight-bold text-black mb-1">Welcome back</h2>
              <p class="text-caption text-black ma-0">Access your IT management dashboard</p>
            </div>
          </div>

          <v-alert
            v-if="showAlert"
            type="error"
            variant="tonal"
            closable
            density="compact"
            class="mb-4 py-1"
            @click:close="showAlert = false"
          >
            <span class="text-caption">{{ alertMessage }}</span>
          </v-alert>

          <v-form ref="formRef" v-model="isFormValid" validate-on="input" @submit.prevent="validateAndLogin">
            
            <div class="mb-3">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Email Address
              </div>
              <v-text-field
                v-model="email"
                placeholder="admin@enterprise.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                :rules="[
                  v => toVuetifyRule(validateRequired(v, 'Email Address')),
                  v => toVuetifyRule(validateEmail(v))
                ]"
                validate-on="input"
                class="success-form-icons"
              ></v-text-field>
            </div>

            <div class="mb-1">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Password
              </div>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                @click:append-inner="showPassword = !showPassword"
                :rules="[
                  v => toVuetifyRule(validateRequired(v, 'Password'))
                ]"
                validate-on="input"
                class="success-form-icons"
              ></v-text-field>
            </div>

            <div class="d-flex align-center justify-end mb-6">
              <v-btn
                variant="text"
                to="/forget-password"
                color="success"
                class="text-caption font-weight-bold text-none px-0"
                :ripple="false"
              >
                Forgot password?
              </v-btn>
            </div>

            <v-btn
              type="submit"
              block
              color="success"
              size="default"
              rounded="sm"
              class="text-none font-weight-bold text-white py-4 d-flex align-center"
              elevation="0"
              :loading="loading"
              :disabled="!canSubmit || loading"
            >
              Sign In
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <span class="text-caption text-black ma-0">Don't have an account?</span>
            <v-btn
              variant="text"
              to="/register"
              color="success"
              class="text-caption font-weight-bold text-none px-1 py-0 h-auto"
              :ripple="false"
            >
              Create one
            </v-btn>
          </div>

          <div class="mt-8 pt-4 border-t" style="border-top: 1px solid #e0e0e0;">
            <div class="d-flex align-center justify-center">
              <div class="d-flex me-3">
                <v-avatar size="24" class="border" color="grey-lighten-4">
                  <v-img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJLO_-igVdlW_C6HxQu6SdyfY6ATF7OUiwtOZapwfXO9JNMZK0CFMCchphFMdc-uT0eHeSknE30JuoJ3tnbqJA0JtVLt82oRPBItOybWfvddWPuC-dFhFVOek3KgxLESq-dD0CJ1TK_4fbAZ7_WSBMgvQ_z3Z2c1__xJx59xnMO4WuxhcKkGFc_29v3oAXWCnI30HFESPXvVyEwXvWv6gR-eQjBSM-ry8rjamsjmdnc8oUhMUMtDX4oO0bVOavRU6982kp0LlS8ZXU" cover></v-img>
                </v-avatar>
                <v-avatar size="24" class="border ms-n2" color="grey-lighten-4">
                  <v-img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDImBTOXzsr5dYL9EYhZ9i6lC5n7BuxmwoPFTrj1rx46p_RmjJjI8lZQTJeE5kliZi726JSwhfti8P68BwN3hYZ0vFdo3f9VQWzbM2PLuiu3Y6_5YrM9J4osVSf0ZLXgt10pOeVHENE2KuOpJ7BJ4KBsXV0TpZter3s4vSVIwFZjB7waC774GJ9Hp2yTHtXJbw7Yk1z8v5CB52CGVLq1OuyJLIfE80NTBos2njJPmvrWzH5ZF7B7b-E0dZY6ajEfaewCzC9730B9c2W" cover></v-img>
                </v-avatar>
              </div>
              <span class="text-caption text-black ma-0">
                Trusted by <strong class="text-black">500+</strong> IT departments globally
              </span>
            </div>
          </div>
          
        </v-sheet>
      </v-col>

      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center position-relative overflow-hidden pa-6 pa-lg-8" style="background-color: #0b1120;">
        
        <v-img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW5C0Tv8L9pGwwlti1_UewuStpIlT6epwruxWCqUpekNmJeIBnlb14hLMRPRzp9OFDKHEQs1mXf9DiDquNZAzlUxX62zkE0muMAE9d11QlDXAgxUDwa0CNpWxZIZ5JrUDFyi-SatSPWCaIVi0AH2GWgVVsXIw37JuWezDKEVXyFvQ1UU6sDP_rurOCWJ7y4zYtPDmXmlX54_S2tY59tK_pJPpKYewWIxlSaleI-UszI_OkKgmADEIRtlKtbYm2qO43Hwtf2F51-bIr"
          cover
          class="position-absolute w-100 h-100 opacity-20"
          style="mix-blend-mode: overlay; inset: 0;"
        ></v-img>

        <v-sheet max-width="500" width="100%" color="transparent" class="position-relative" style="margin: 0 auto;">
          
          <div 
            class="d-inline-flex align-center px-3 py-1 mb-6 rounded-pill"
            style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);"
          >
            <v-icon color="success" size="16" class="me-2">mdi-shield-check</v-icon>
            <span class="text-uppercase text-white font-weight-bold mb-0 lh-1" style="font-size: 10px; letter-spacing: 0.05em;">
              Enterprise Grade Security
            </span>
          </div>

          <div class="mb-8">
            <h3 class="text-h5 font-weight-bold text-white font-italic mb-4" style="line-height: 1.3;">
              "The most intuitive asset tracking platform we've ever deployed."
            </h3>
            <div>
              <p class="text-subtitle-2 font-weight-bold text-white ma-0">Sarah Jenkins</p>
              <p class="text-caption text-blue-grey-lighten-3">Chief Technology Officer, EcoSystems Inc.</p>
            </div>
          </div>

          <v-row dense class="mt-2 opacity-90">
            <v-col cols="6">
              <div class="pa-4 rounded-lg h-100" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px);">
                <v-icon color="success" size="24" class="mb-2">mdi-speedometer</v-icon>
                <div class="text-white font-weight-bold text-subtitle-2 mb-1">99.9% Uptime</div>
                <div class="text-white opacity-80" style="font-size: 10px;">Guaranteed reliability</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="pa-4 rounded-lg h-100" style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px);">
                <v-icon color="success" size="24" class="mb-2">mdi-lock</v-icon>
                <div class="text-white font-weight-bold text-subtitle-2 mb-1">256-bit AES</div>
                <div class="text-white opacity-80" style="font-size: 10px;">End-to-end encryption</div>
              </div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginPayload } from '../../services/authService'
import { useAuthStore } from '../../stores/authStore'
import { toVuetifyRule, validateEmail, validateRequired } from '../../utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const showAlert = ref(false)
const alertMessage = ref('')

const canSubmit = computed(() => {
  return (
    isFormValid.value && 
    validateEmail(email.value).valid && 
    validateRequired(password.value, 'Password').valid && 
    !loading.value
  )
})

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
    router.push('/dashboard')
  } catch (error: any) {
    alertMessage.value =
      error?.response?.data?.message || error.message || 'Failed to login. Please check your credentials.'
    showAlert.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.success-form-icons :deep(.v-icon) {
  color: rgb(var(--v-theme-success)) !important;
}
</style>