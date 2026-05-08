<template>
  <v-app>
    <v-row no-gutters class="fill-height ma-0 overflow-hidden">
      
      <v-col cols="12" md="6" class="bg-grey-lighten-4 d-flex flex-column justify-center align-center pa-2 pa-md-6">
        <v-sheet max-width="400" width="100%" color="transparent">
          
          <div class="mb-4">
            <h1 class="text-h5 font-weight-black text-black mb-1">Shelf</h1>
            <p class="text-caption text-black ma-0">The future of enterprise asset management starts here.</p>
          </div>

          <v-alert
            v-if="showAlert"
            type="error"
            variant="tonal"
            closable
            density="compact"
            class="mb-2 py-1"
            @click:close="showAlert = false"
          >
            <span class="text-caption">{{ alertMessage }}</span>
          </v-alert>

          <v-form ref="formRef" v-model="isFormValid" validate-on="input" @submit.prevent="validateAndRegister">
            
            <div class="mb-2">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Full Name
              </div>
              <v-text-field
                v-model="fullName"
                placeholder="Enter your full name"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                :rules="[
                  v => validateRequired(v, 'Full Name').valid || validateRequired(v, 'Full Name').error,
                  v => validateFullName(v).valid || validateFullName(v).error
                ]"
                validate-on="input"
              ></v-text-field>
            </div>

            <div class="mb-2">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Work Email
              </div>
              <v-text-field
                v-model="email"
                placeholder="name@company.com"
                type="email"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                :rules="[
                  v => validateRequired(v, 'Email').valid || validateRequired(v, 'Email').error,
                  v => validateEmail(v).valid || validateEmail(v).error
                ]"
                validate-on="input"
              ></v-text-field>
            </div>

            <div class="mb-2">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Company Name
              </div>
              <v-text-field
                v-model="organization"
                placeholder="Organization name"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                :rules="[
                  v => validateRequired(v, 'Organization').valid || validateRequired(v, 'Organization').error,
                  v => validateOrganization(v).valid || validateOrganization(v).error
                ]"
                validate-on="input"
              ></v-text-field>
            </div>

            <div class="mb-1">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Password
              </div>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                @click:append-inner="showPassword = !showPassword"
                :rules="[
                  v => validateRequired(v, 'Password').valid || validateRequired(v, 'Password').error,
                  v => validatePassword(v).valid || validatePassword(v).error
                ]"
                validate-on="input"
                class="success-form-icons"
              ></v-text-field>
            </div>

            <div v-if="password.length > 0" class="mb-2">
              <v-progress-linear
                :model-value="passwordStrength"
                :color="passwordStrengthColor"
                height="3"
                rounded
                class="mt-1 mb-1"
              ></v-progress-linear>
            </div>

            <div class="mb-4" :class="{'mt-2': password.length === 0}">
              <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                Confirm Password
              </div>
              <v-text-field
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                variant="outlined"
                bg-color="white"
                color="success"
                base-color="grey-lighten-1"
                rounded="sm"
                hide-details="auto"
                density="compact"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="[
                  v => validateRequired(v, 'Confirm Password').valid || validateRequired(v, 'Confirm Password').error,
                  v => password === v || 'Passwords do not match'
                ]"
                validate-on="input"
                class="success-form-icons"
              ></v-text-field>
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
              Create Account
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <span class="text-caption text-black ma-0">Already have an account?</span>
            <v-btn
              variant="text"
              to="/login"
              color="success"
              class="text-caption font-weight-bold text-none px-1 py-0 h-auto"
              :ripple="false"
            >
              Sign In
            </v-btn>
          </div>
          
        </v-sheet>
      </v-col>

      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center position-relative overflow-hidden pa-6 pa-lg-8" style="background-color: #0b1120;">
        <v-img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhTEkQ9Yw3RH3bqwqGYtDt4DRFl9q2_Aapvs3vhriVeAGiOeaoihzpsQmNZqd-GR77w9Yr3o21adJTyCsMTSZXNu_sef9Cu_46aaKOv2qDpuauMO-ZLubSWfMzUNzPCZule9y3m6GmySjdP6AJCuLgJj27TGd1lJNlamiEFVi2mDl7IJoUC1we-au9FBBYDdejMt0nzI1-amTZRO7uw3ZEcPyalZCrJvCiMEp5aCxTsLks5Fa8gnz4FiUzaWQddzb8mmF-CgiNiuMG"
          cover
          class="position-absolute w-100 h-100 opacity-20"
          style="mix-blend-mode: overlay; inset: 0;"
        ></v-img>

        <div class="position-relative z-10 w-100" style="max-width: 500px; margin: 0 auto;">
          <div class="d-flex align-center mb-4">
            <v-sheet color="#4ae176" width="24" height="24" rounded="sm" class="d-flex align-center justify-center me-3">
              <v-icon color="#002109" size="16">mdi-package-variant-closed</v-icon>
            </v-sheet>
            <span class="text-subtitle-1 font-weight-bold text-white">Shelf Enterprise</span>
          </div>

          <div class="mb-6">
            <h2 class="text-h5 font-weight-black text-white mb-2" style="line-height: 1.2;">
              Engineered for absolute asset precision.
            </h2>
            <p class="text-caption text-blue-grey-lighten-3 font-weight-regular">
              Join over 500 clean-tech enterprises managing their infrastructure with carbon-neutral software architecture.
            </p>
          </div>

          <v-row dense class="mt-1">
            <v-col cols="6">
              <v-sheet color="rgba(255, 255, 255, 0.05)" rounded="lg" class="pa-3 border h-100" style="border-color: rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px);">
                <v-icon color="#4ae176" size="20" class="mb-2">mdi-speedometer</v-icon>
                <h4 class="text-caption font-weight-bold text-white mb-1">Instant Audit</h4>
                <p class="text-white opacity-80 ma-0" style="font-size: 10px; line-height: 1.4;">Track 1000+ assets with ease using our real-time scanning protocols.</p>
              </v-sheet>
            </v-col>
            
            <v-col cols="6">
              <v-sheet color="rgba(255, 255, 255, 0.05)" rounded="lg" class="pa-3 border h-100" style="border-color: rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px);">
                <v-icon color="#4ae176" size="20" class="mb-2">mdi-leaf</v-icon>
                <h4 class="text-caption font-weight-bold text-white mb-1">Eco-Tracking</h4>
                <p class="text-white opacity-80 ma-0" style="font-size: 10px; line-height: 1.4;">Monitor the lifecycle and recycling status of every hardware component.</p>
              </v-sheet>
            </v-col>
            
            <v-col cols="12">
              <v-sheet color="rgba(255, 255, 255, 0.05)" rounded="lg" class="pa-3 border mt-1" style="border-color: rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px);">
                <div class="d-flex align-start">
                  <v-sheet color="rgba(74, 225, 118, 0.15)" rounded="circle" class="pa-2 me-3 mt-1">
                    <v-icon color="#4ae176" size="16">mdi-shield-check</v-icon>
                  </v-sheet>
                  <div>
                    <h4 class="text-caption font-weight-bold text-white mb-1">Enterprise Security</h4>
                    <p class="text-white opacity-80 ma-0" style="font-size: 10px; line-height: 1.4;">SOC2 Type II compliant infrastructure with encrypted assignment history.</p>
                  </div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>

          <div class="d-flex align-center mt-6 pt-4" style="border-top: 1px solid rgba(255, 255, 255, 0.08);">
            <v-avatar size="32" class="me-3 border-sm" style="border-color: #4ae176 !important;">
              <v-img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPoRncMuadMnNmZbPBngpkZDFSVpHiHzJx2TqP5f1tuRQCGVHA2ldZcNdgctW7Otq2WeI8_8HNJiwZxeIOI18cpmhCKVngz-W48gHqHCHSrQZU9z0zFL9JDLizFOhcY8Hdr8EpvKS_Tpz8dVHx6S-4hQVqygJCFDtjPawBY9Fq9a8hTZmi71ZFMaFJZWyWcMJycVMbfQP960HQBXHfXyw6tqEVg50qKm8Qg_WIY7cJ0hXRWliIEzVCGyZMVtsTE6YPlRFogf9lGplo" cover></v-img>
            </v-avatar>
            <div>
              <p class="font-italic text-blue-grey-lighten-3 mb-0" style="font-size: 11px;">
                "Shelf reduced our equipment loss by 40% in just six months."
              </p>
              <p class="font-weight-bold text-uppercase ma-0" style="color: #4ae176; letter-spacing: 0.05em; font-size: 9px !important;">
                Director of IT, GreenNode Labs
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import {
  validateEmail,
  validateFullName,
  validateOrganization,
  validatePassword,
  validateRequired,
} from '../../utils/validation'
import type { SignupPayload } from '../../services/authService'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

const fullName = ref('')
const organization = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const showAlert = ref(false)
const alertMessage = ref('')

const canSubmit = computed(() => {
  return (
    isFormValid.value &&
    validateFullName(fullName.value).valid &&
    validateOrganization(organization.value).valid &&
    validateEmail(email.value).valid &&
    validatePassword(password.value).valid &&
    confirmPassword.value.trim().length > 0 &&
    password.value === confirmPassword.value &&
    !loading.value
  )
})

const passwordStrength = computed(() => {
  let score = 0
  if (password.value.length >= 8) score += 25
  if (/[A-Z]/.test(password.value)) score += 25
  if (/[a-z]/.test(password.value)) score += 25
  if (/[0-9]/.test(password.value)) score += 25
  return score
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'error'
  if (passwordStrength.value <= 50) return 'warning'
  if (passwordStrength.value <= 75) return 'info'
  return 'success'
})

const validateAndRegister = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  loading.value = true
  showAlert.value = false

  try {
    const payload: SignupPayload = {
      name: fullName.value.trim(),
      organization: organization.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirm_password: confirmPassword.value,
    }

    await authStore.signup(payload)

    router.push({
      path: '/verify',
      query: { email: email.value.trim() },
    })
  } catch (error: any) {
    let message = 'Registration failed'

    if (error?.response?.status === 409) {
      message = 'This email is already registered. Please try logging in or use a different email.'
    } else {
      message = error?.response?.data?.message || error.message || 'Registration failed. Please try again.'
    }

    alertMessage.value = message
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