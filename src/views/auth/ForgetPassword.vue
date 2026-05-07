<template>
  <v-container fluid class="fill-height pa-0 bg-surface">
    <v-row no-gutters class="fill-height ma-0">
      <!-- LEFT PANEL: FORGOT PASSWORD FORM -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 pa-md-10">
        <v-card class="w-100 mx-auto rounded-xl elevation-4 pa-6 pa-sm-8" max-width="460">
          <!-- HEADER -->
          <div class="text-center mb-8">
            <v-img src="@/assets/logo.png" height="50" contain class="mx-auto" />
            <h1 class="text-h5 font-weight-bold mt-4 text-on-surface">
              {{ step === 1 ? 'Reset Password' : 'Verify Code' }}
            </h1>
            <p class="text-body-2 text-medium-emphasis mt-2">
              <span v-if="step === 1">
                Enter your email to receive a reset code
              </span>
              <span v-else>
                Enter the 6-digit code sent to
                <strong class="text-primary">{{ form.email }}</strong>
              </span>
            </p>
          </div>

          <!-- ERROR ALERT -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mb-6"
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <!-- STEP 1: EMAIL FORM -->
          <v-fade-transition mode="out-in">
            <v-form
              v-if="step === 1"
              key="email-form"
              v-model="isEmailValid"
              validate-on="input"
              @submit.prevent="handleSendOtp"
            >
              <!-- EMAIL INPUT -->
              <v-text-field
                v-model.trim="form.email"
                label="Email Address"
                type="email"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-email-outline"
                validate-on="input"
                class="mb-6"
                :rules="emailRules"
              />

              <!-- SEND OTP BUTTON -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!isEmailValid || isLoading"
              >
                Send Reset Code
              </v-btn>

              <!-- BACK TO LOGIN LINK -->
              <div class="text-center mt-6">
                <v-btn
                  variant="text"
                  to="/login"
                  class="text-none text-caption"
                  color="primary"
                >
                  Back to Login
                </v-btn>
              </div>
            </v-form>

            <!-- STEP 2: OTP FORM -->
            <v-form
              v-else
              key="otp-form"
              v-model="isOtpValid"
              validate-on="input"
              @submit.prevent="handleVerifyOtp"
            >
              <!-- OTP INPUT -->
              <v-text-field
                v-model="form.otp"
                label="6-Digit Code"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-shield-key-outline"
                validate-on="input"
                class="mb-6 text-center"
                maxlength="6"
                inputmode="numeric"
                autofocus
                :rules="otpRules"
                @input="handleOtpInput"
              />

              <!-- VERIFY OTP BUTTON -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!isOtpValid || isLoading"
              >
                Verify Code
              </v-btn>

              <!-- RESEND OTP -->
              <div class="text-center mt-6">
                <span class="text-body-2 text-medium-emphasis">Didn't receive the code?</span>
                <v-btn
                  variant="text"
                  class="text-none px-1"
                  color="primary"
                  density="compact"
                  :disabled="isLoading"
                  @click="handleSendOtp"
                >
                  Resend
                </v-btn>
              </div>

              <!-- BACK BUTTON -->
              <div class="text-center mt-4">
                <v-btn
                  variant="text"
                  class="text-none text-caption"
                  color="primary"
                  @click="step = 1"
                >
                  Use different email
                </v-btn>
              </div>
            </v-form>
          </v-fade-transition>
        </v-card>
      </v-col>

      <!-- RIGHT PANEL: BRAND MESSAGE -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center bg-primary text-white pa-10">
        <div class="text-center px-6">
          <v-icon size="80" class="mb-6">mdi-lock-reset</v-icon>
          <h2 class="text-h4 font-weight-bold mb-3">Password Recovery</h2>
          <p class="text-body-1">
            We'll help you regain access to your account. Follow the steps to reset your password securely.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
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

// EMAIL VALIDATION RULES
const emailRules = [
  (v: string) => {
    const result = validateRequired(v, 'Email')
    return result.valid ? true : result.error || 'Email is required'
  },
  (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email format'
  },
]

// OTP VALIDATION RULES
const otpRules = [
  (v: string) => {
    const result = validateOTP(v)
    return result.valid ? true : result.error || 'Invalid OTP'
  },
]

/**
 * Handle OTP input - only allow digits
 */
const handleOtpInput = (value: string) => {
  form.otp = value.replace(/\D/g, '').slice(0, 6)
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
    // Backend contract does not expose a separate verify endpoint for forgot-password flow.
    // We validate code format here and submit it on the reset-password API.
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