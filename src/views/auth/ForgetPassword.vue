<template>
  <v-app>
    <div class="d-flex align-center justify-center position-relative w-100" style="height: 100vh; background-color: #f7f9fb; overflow: hidden;">
      
      <div class="position-absolute w-100 h-100 top-0 left-0 pe-none" style="z-index: 0;">
        <div class="position-absolute rounded-circle bg-blue-lighten-4" style="top: -10%; right: -10%; width: 40vw; height: 40vw; filter: blur(120px); opacity: 0.4; transform: translateZ(0);"></div>
        <div class="position-absolute rounded-circle bg-success" style="bottom: -10%; left: -10%; width: 40vw; height: 40vw; filter: blur(120px); opacity: 0.1; transform: translateZ(0);"></div>
      </div>

      <div class="position-relative d-flex flex-column w-100 px-4" style="z-index: 1; max-width: 420px;">
        
        <div class="d-flex flex-column align-center text-center mb-4">
          <v-icon color="success" size="40" class="mb-2">mdi-package-variant-closed</v-icon>
          <h1 class="text-h5 font-weight-black text-black mb-1">InventoryFlow</h1>
          <p class="text-caption text-black ma-0 ma-0">Precision Enterprise Asset Management</p>
        </div>

        <v-card class="w-100 rounded-lg border bg-white pa-5 mb-4" elevation="0">
          
          <div class="mb-4">
            <h2 class="text-h6 font-weight-bold text-black mb-1">
              {{ step === 1 ? 'Reset your password' : 'Verify Code' }}
            </h2>
            <p class="text-caption text-black ma-0 ma-0 lh-1-5" style="line-height: 1.4;">
              <span v-if="step === 1">
                Enter your email to receive a reset link. We'll send instructions to regain access to your IT inventory dashboard.
              </span>
              <span v-else>
                Enter the 6-digit code sent to
                <strong class="text-black">{{ form.email }}</strong>
              </span>
            </p>
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            density="compact"
            class="mb-4 py-1"
            @click:close="error = null"
          >
            <span class="text-caption">{{ error }}</span>
          </v-alert>

          <v-fade-transition mode="out-in">
            <v-form
              v-if="step === 1"
              key="email-form"
              v-model="isEmailValid"
              validate-on="input"
              @submit.prevent="handleSendOtp"
            >
              <div class="mb-4">
                <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                  Email Address
                </div>
                <v-text-field
                  v-model.trim="form.email"
                  placeholder="admin@enterprise.com"
                  type="email"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  color="success"
                  base-color="grey-lighten-2"
                  rounded="sm"
                  hide-details="auto"
                  density="compact"
                  prepend-inner-icon="mdi-email-outline"
                  validate-on="input"
                  :rules="[
                    v => {
                      const result = validateRequired(v, 'Email')
                      return result.valid ? true : result.error || 'Email is required'
                    },
                    v => {
                      const result = validateEmail(v)
                      return result.valid ? true : result.error || 'Please enter a valid email address'
                    }
                  ]"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="success">mdi-email-outline</v-icon>
                  </template>
                </v-text-field>
              </div>

              <v-btn
                type="submit"
                color="success"
                size="large"
                block
                rounded="sm"
                class="text-none font-weight-bold text-white"
                elevation="0"
                append-icon="mdi-arrow-right"
                :loading="isLoading"
                :disabled="!isEmailValid || isLoading"
              >
                Send Reset Link
              </v-btn>

              <div class="mt-5 pt-4 border-t d-flex justify-center" style="border-top-color: #EEEEEE !important;">
                <v-btn
                  variant="text"
                  to="/login"
                  color="grey-darken-1"
                  prepend-icon="mdi-arrow-left"
                  class="text-none text-caption font-weight-medium"
                  :ripple="false"
                >
                  Back to Login
                </v-btn>
              </div>
            </v-form>

            <v-form
              v-else
              key="otp-form"
              v-model="isOtpValid"
              validate-on="input"
              @submit.prevent="handleVerifyOtp"
            >
              <div class="mb-4">
                <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1" style="font-size: 10px !important; letter-spacing: 0.05em;">
                  6-Digit Code
                </div>
                <v-text-field
                  v-model="form.otp"
                  placeholder="000000"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  color="success"
                  base-color="grey-lighten-2"
                  rounded="sm"
                  hide-details="auto"
                  density="compact"
                  prepend-inner-icon="mdi-shield-key-outline"
                  validate-on="input"
                  class="text-center font-weight-bold tracking-widest"
                  maxlength="6"
                  inputmode="numeric"
                  autofocus
                  @update:model-value="handleOtpInput"
                  :rules="[
                    v => {
                      const result = validateOTP(v)
                      return result.valid ? true : result.error || 'OTP must be exactly 6 digits'
                    }
                  ]"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="success">mdi-shield-key-outline</v-icon>
                  </template>
                </v-text-field>
              </div>

              <v-btn
                type="submit"
                color="success"
                size="large"
                block
                rounded="sm"
                class="text-none font-weight-bold text-white"
                elevation="0"
                append-icon="mdi-arrow-right"
                :loading="isLoading"
                :disabled="!isOtpValid || isLoading"
              >
                Verify Code
              </v-btn>

              <div class="d-flex flex-column align-center mt-5 pt-4 border-t" style="border-top-color: #EEEEEE !important; gap: 4px;">
                <div class="d-flex align-center">
                  <span class="text-caption text-black ma-0">Didn't receive the code?</span>
                  <v-btn
                    variant="text"
                    color="success"
                    class="text-none text-caption font-weight-bold px-1 py-0 h-auto ms-1"
                    :ripple="false"
                    :disabled="isLoading"
                    @click="handleSendOtp"
                  >
                    Resend
                  </v-btn>
                </div>

                <v-btn
                  variant="text"
                  color="grey-darken-1"
                  prepend-icon="mdi-arrow-left"
                  class="text-none text-caption font-weight-medium mt-1"
                  :ripple="false"
                  @click="step = 1"
                >
                  Use different email
                </v-btn>
              </div>
            </v-form>
          </v-fade-transition>
          
        </v-card>

        <div class="d-flex justify-space-between align-center px-2 opacity-60">
          <div class="d-flex align-center">
            <v-sheet color="success" width="8" height="8" rounded="circle" class="me-2"></v-sheet>
            <span class="text-uppercase text-grey-darken-3 font-weight-bold" style="font-size: 10px; letter-spacing: 0.05em;">
              System Operational
            </span>
          </div>
          <span class="text-uppercase text-grey-darken-3 font-weight-bold" style="font-size: 10px; letter-spacing: 0.05em;">
            Est. 2024
          </span>
        </div>

      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { validateEmail, validateRequired, validateOTP } from '../../utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isEmailValid = ref(false)
const isOtpValid = ref(false)

const form = reactive({
  email: '',
  otp: '',
})

/**
 * Handle OTP input - only allow digits
 */
const handleOtpInput = (value: string | Event) => {
  const rawValue = typeof value === 'string' ? value : (value.target as HTMLInputElement | null)?.value ?? ''
  form.otp = rawValue.replace(/\D/g, '').slice(0, 6)
}

/**
 * Send OTP to email
 */
const handleSendOtp = async () => {
  if (step.value === 1 && !isEmailValid.value) return

  isLoading.value = true
  error.value = null

  try {
    await authStore.forgetPassword({ email: form.email.trim() })

    // Move to OTP verification step
    step.value = 2
    form.otp = '' // Reset OTP for new attempt
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to send reset code'
  } finally {
    isLoading.value = false
  }
}

/**
 * Verify OTP and proceed to password reset
 */
const handleVerifyOtp = async () => {
  if (!isOtpValid.value) return

  isLoading.value = true
  error.value = null

  try {
    router.push({
      path: '/reset-password',
      query: {
        email: form.email.trim(),
        verification_code: form.otp,
      },
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Invalid or expired code'
  } finally {
    isLoading.value = false
  }
}
</script>