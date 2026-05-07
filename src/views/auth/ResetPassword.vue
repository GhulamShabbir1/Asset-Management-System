<template>
  <v-container fluid class="fill-height pa-0 bg-surface">
    <v-row no-gutters class="fill-height ma-0">
      <!-- LEFT PANEL: RESET PASSWORD FORM -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 pa-md-10 order-2 order-md-1">
        <v-card class="w-100 mx-auto rounded-xl elevation-4 pa-6 pa-sm-8" max-width="460">
          <!-- HEADER -->
          <div class="text-center mb-8">
            <v-img src="@/assets/logo.png" height="50" contain class="mx-auto" />
            <h1 class="text-h5 font-weight-bold mt-6 text-on-surface">
              {{ isSuccess ? 'Password Reset!' : 'Set New Password' }}
            </h1>
            <p class="text-body-2 text-medium-emphasis mt-2 px-4">
              <span v-if="isSuccess">
                Your password has been successfully updated. You can now sign in with your new password.
              </span>
              <span v-else>
                Create a strong new password for
                <strong class="text-primary">{{ displayEmail }}</strong>
              </span>
            </p>
          </div>

          <!-- ERROR ALERT -->
          <v-alert v-if="error" type="error" variant="tonal" closable class="mb-6" @click:close="error = null">
            {{ error }}
          </v-alert>

          <!-- RESET PASSWORD FORM -->
          <v-fade-transition mode="out-in">
            <v-form
              v-if="!isSuccess"
              key="reset-form"
              v-model="isFormValid"
              validate-on="input"
              @submit.prevent="handleResetPassword"
            >
              <!-- NEW PASSWORD -->
              <v-text-field
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                label="New Password"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                validate-on="input"
                class="mb-2"
                :rules="passwordRules"
              />

              <!-- PASSWORD STRENGTH INDICATOR -->
              <div v-if="form.newPassword.length > 0" class="mb-4 px-3">
                <v-progress-linear
                  :model-value="passwordStrength"
                  :color="passwordStrengthColor"
                  height="6"
                  rounded
                  class="mb-2"
                />
                <div class="d-flex align-center justify-space-between">
                  <span class="text-caption text-medium-emphasis">Password strength:</span>
                  <span :class="`text-caption font-weight-bold text-${passwordStrengthColor}`">
                    {{ passwordStrengthText }}
                  </span>
                </div>
                <div class="text-caption text-medium-emphasis mt-2">
                  <v-icon size="14" :color="/[A-Z]/.test(form.newPassword) ? 'success' : 'default'">
                    {{ /[A-Z]/.test(form.newPassword) ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                  Uppercase letter
                </div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="14" :color="/[0-9]/.test(form.newPassword) ? 'success' : 'default'">
                    {{ /[0-9]/.test(form.newPassword) ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                  Number
                </div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="14" :color="form.newPassword.length >= 8 ? 'success' : 'default'">
                    {{ form.newPassword.length >= 8 ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                  At least 8 characters
                </div>
              </div>

              <!-- CONFIRM PASSWORD -->
              <v-text-field
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirm Password"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                validate-on="input"
                class="mb-6"
                :rules="confirmPasswordRules"
              />

              <!-- UPDATE PASSWORD BUTTON -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!isFormValid || isLoading"
              >
                Update Password
              </v-btn>
            </v-form>

            <!-- SUCCESS MESSAGE -->
            <div v-else key="success-message" class="text-center">
              <v-icon color="success" size="80" class="mb-6">mdi-check-circle</v-icon>
              <p class="text-body-1 text-on-surface mb-6">
                Your password has been successfully reset. You're all set to sign in!
              </p>
              <v-btn to="/login" color="primary" size="large" block>
                Proceed to Login
              </v-btn>
            </div>
          </v-fade-transition>
        </v-card>
      </v-col>

      <!-- RIGHT PANEL: BRAND MESSAGE -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center bg-primary text-white pa-10 order-1 order-md-2">
        <div class="text-center px-6">
          <v-icon size="80" class="mb-6">mdi-lock-reset</v-icon>
          <h2 class="text-h4 font-weight-bold mb-3">Reset Securely</h2>
          <p class="text-body-1">
            Choose a strong password you can use to sign in again with confidence. Your security is our priority.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { validatePassword, validateConfirmPassword } from '../../utils/validation'
import type { ResetPasswordPayload } from '../../services/authService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const isSuccess = ref(false)
const isFormValid = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const displayEmail = computed(() => (route.query.email as string) || 'your account')
const verificationCode = computed(() => route.query.verification_code as string)

// Redirect back to forgot password if no verification code
onMounted(() => {
  if (!verificationCode.value) {
    router.push('/forget-password')
  }
})

const form = reactive({
  newPassword: '',
  confirmPassword: '',
})

// PASSWORD VALIDATION RULES
const passwordRules = [
  (v: string) => {
    const result = validatePassword(v)
    return result.valid ? true : result.error || 'Password does not meet requirements'
  },
]

// CONFIRM PASSWORD VALIDATION RULES
const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => {
    const result = validateConfirmPassword(form.newPassword, v)
    return result.valid ? true : result.error || 'Passwords do not match'
  },
]

// PASSWORD STRENGTH CALCULATION
const passwordStrength = computed(() => {
  let score = 0

  if (form.newPassword.length >= 8) score += 25
  if (/[A-Z]/.test(form.newPassword)) score += 25
  if (/[a-z]/.test(form.newPassword)) score += 25
  if (/[0-9]/.test(form.newPassword)) score += 25

  return score
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'Weak'
  if (passwordStrength.value <= 50) return 'Fair'
  if (passwordStrength.value <= 75) return 'Good'
  return 'Strong'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'error'
  if (passwordStrength.value <= 50) return 'warning'
  if (passwordStrength.value <= 75) return 'info'
  return 'success'
})

// RESET PASSWORD HANDLER
const handleResetPassword = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  try {
    const payload: ResetPasswordPayload = {
      verification_code: verificationCode.value,
      password: form.newPassword,
      confirm_password: form.confirmPassword,
    }

    await authStore.resetPassword(payload)

    isSuccess.value = true
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Failed to reset password. Please try again or request a new reset code.'
  } finally {
    isLoading.value = false
  }
}
</script>
