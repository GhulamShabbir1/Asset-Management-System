<template>
  <v-container fluid class="fill-height pa-0 bg-surface">
    <v-row no-gutters class="fill-height ma-0">
      <!-- LEFT PANEL: BRAND MESSAGE -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center bg-primary text-white pa-10">
        <div class="text-center px-10">
          <v-icon size="80" class="mb-6">mdi-shield-check-outline</v-icon>
          <h1 class="text-h3 font-weight-bold mb-4">Email Verification</h1>
          <p class="text-h6">
            We've sent a verification code to your email address to complete your registration securely.
          </p>
        </div>
      </v-col>

      <!-- RIGHT PANEL: VERIFICATION FORM -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 pa-md-10">
        <v-card class="w-100 mx-auto rounded-xl elevation-4 pa-8 pa-md-12" max-width="480">
          <!-- HEADER -->
          <div class="text-center mb-8">
            <h2 class="text-h4 font-weight-bold mb-3 text-on-surface">Verify Your Email</h2>
            <p class="text-body-1 text-medium-emphasis">
              Enter the 6-digit code sent to
              <br />
              <strong class="text-primary">{{ email }}</strong>
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

          <!-- VERIFICATION FORM -->
          <v-form @submit.prevent="handleVerify">
            <!-- OTP INPUT -->
            <div class="mb-6">
              <div class="d-flex justify-center gap-2">
                <v-text-field
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  v-model="otpDigits[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  variant="outlined"
                  density="comfortable"
                  class="otp-input text-center"
                  hide-details
                  :autofocus="index === 0"
                  @input="handleDigitInput(index, $event)"
                  @keydown="handleDigitKeydown(index, $event)"
                  @paste="handlePaste"
                />
              </div>
              <div v-if="otpError" class="text-caption text-error mt-2 text-center">
                {{ otpError }}
              </div>
            </div>

            <!-- VERIFY BUTTON -->
            <v-btn
              block
              size="large"
              color="primary"
              class="text-none font-weight-bold"
              type="submit"
              :loading="isLoading"
              :disabled="otpCode.length !== 6 || isLoading"
            >
              Verify Account
            </v-btn>

            <!-- RESEND CODE -->
            <div class="text-center mt-6">
              <span class="text-body-2 text-medium-emphasis">Didn't receive the code?</span>
              <v-btn
                variant="text"
                class="text-none px-1"
                color="primary"
                density="compact"
                :disabled="isLoading || resendCooldown > 0"
                @click="handleResendCode"
              >
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
              </v-btn>
            </div>

            <!-- BACK TO REGISTRATION -->
            <div class="text-center mt-4">
              <v-btn variant="text" density="compact" class="text-none" to="/register">
                Back to Registration
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { validateOTP } from '../../utils/validation'
import type { VerifySignupPayload } from '../../services/authService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const showAlert = ref(false)
const alertMessage = ref('')
const isLoading = ref(false)
const otpError = ref('')
const resendCooldown = ref(0)

const otpCode = computed(() => otpDigits.value.join(''))

// Get email from route query or redirect
onMounted(() => {
  if (route.query.email) {
    email.value = String(route.query.email)
  } else {
    router.push('/register')
  }

  // Start resend cooldown if needed
  startResendCooldown()
})

/**
 * Handle digit input with auto-focus to next field
 */
const handleDigitInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Allow only digits
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  // Move to next field if digit entered
  if (value && index < 5) {
    const nextInput = document.querySelectorAll('.otp-input input')[index + 1] as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }
}

/**
 * Handle keyboard events for OTP input
 */
const handleDigitKeydown = (index: number, event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement

  // Handle backspace to go to previous field
  if (event.key === 'Backspace' && !input.value && index > 0) {
    const prevInput = document.querySelectorAll('.otp-input input')[index - 1] as HTMLInputElement
    if (prevInput) {
      prevInput.focus()
    }
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    const prevInput = document.querySelectorAll('.otp-input input')[index - 1] as HTMLInputElement
    if (prevInput) {
      prevInput.focus()
    }
  } else if (event.key === 'ArrowRight' && index < 5) {
    const nextInput = document.querySelectorAll('.otp-input input')[index + 1] as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }
}

/**
 * Handle paste event for OTP
 */
const handlePaste = (event: ClipboardEvent) => {
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
    }
  })

  // Focus on the next empty field or last field
  const nextEmptyIndex = otpDigits.value.findIndex((d) => !d)
  const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
  const inputs = document.querySelectorAll('.otp-input input')
  const nextInput = inputs[focusIndex] as HTMLInputElement
  if (nextInput) {
    nextInput.focus()
  }

  event.preventDefault()
}

/**
 * Verify OTP code
 */
const handleVerify = async () => {
  otpError.value = ''

  // Validate OTP
  const validationResult = validateOTP(otpCode.value)
  if (!validationResult.valid) {
    otpError.value = validationResult.error || 'Invalid OTP'
    return
  }

  isLoading.value = true
  showAlert.value = false

  try {
    const payload: VerifySignupPayload = {
      verification_code: otpCode.value,
    }

    await authStore.verifySignup(payload)

    // Redirect to login on success
    router.push('/login')
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Verification failed. Please check your code.'

    alertMessage.value = message
    showAlert.value = true

    // Clear OTP on error
    otpDigits.value = ['', '', '', '', '', '']
  } finally {
    isLoading.value = false
  }
}

/**
 * Resend verification code
 */
const handleResendCode = async () => {
  isLoading.value = true
  showAlert.value = false

  try {
    alertMessage.value = 'Request a new verification code from registration if your code has expired.'
    showAlert.value = true
  } catch (error: any) {
    alertMessage.value = error.message || 'Failed to resend code. Please try again.'
    showAlert.value = true
  } finally {
    isLoading.value = false
  }
}

/**
 * Start resend cooldown timer
 */
const startResendCooldown = () => {
  resendCooldown.value = 60

  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}
</script>

<style scoped>
.otp-input {
  max-width: 50px;
}

.otp-input :deep(input) {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.1em;
}
</style>
