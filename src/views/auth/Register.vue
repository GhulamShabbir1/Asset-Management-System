<template>
  <v-container fluid class="fill-height pa-0 bg-surface">
    <v-row no-gutters class="fill-height ma-0">
      <!-- LEFT PANEL: SIGNUP FORM -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 pa-md-10 order-2 order-md-1">
        <v-card class="w-100 mx-auto rounded-xl elevation-4 pa-6 pa-sm-8" max-width="500">
          <!-- HEADER -->
          <div class="text-center mb-8">
            <v-img src="@/assets/logo.png" height="50" contain class="mx-auto" />
            <h1 class="text-h5 font-weight-bold mt-4 text-on-surface">Create Your Account</h1>
            <p class="text-body-2 text-medium-emphasis">
              Start managing your assets securely
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

          <!-- REGISTRATION FORM -->
          <v-form ref="formRef" v-model="isFormValid" validate-on="input" @submit.prevent="validateAndRegister">
            <!-- FULL NAME -->
            <v-text-field
              v-model="fullName"
              label="Full Name"
              type="text"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              prepend-inner-icon="mdi-account-outline"
              validate-on="input"
              class="mb-4"
              :rules="[rules.required, rules.fullName]"
            />

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

            <!-- ORGANIZATION -->
            <v-text-field
              v-model="organization"
              label="Organization"
              type="text"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              prepend-inner-icon="mdi-domain"
              validate-on="input"
              class="mb-4"
              :rules="[rules.required, rules.organization]"
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
              class="mb-2"
              :rules="[rules.required, rules.password]"
            />

            <!-- PASSWORD STRENGTH INDICATOR -->
            <div v-if="password.length > 0" class="mb-4 px-3">
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
                <v-icon size="14" :color="/[A-Z]/.test(password) ? 'success' : 'default'">
                  {{ /[A-Z]/.test(password) ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                Uppercase letter
              </div>
              <div class="text-caption text-medium-emphasis">
                <v-icon size="14" :color="/[0-9]/.test(password) ? 'success' : 'default'">
                  {{ /[0-9]/.test(password) ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                Number
              </div>
              <div class="text-caption text-medium-emphasis">
                <v-icon size="14" :color="password.length >= 8 ? 'success' : 'default'">
                  {{ password.length >= 8 ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
                At least 8 characters
              </div>
            </div>

            <!-- CONFIRM PASSWORD -->
            <v-text-field
              v-model="confirmPassword"
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
              :rules="[
                rules.required,
                (v: string) => password === v || 'Passwords do not match'
              ]"
            />

            <!-- SIGNUP BUTTON -->
            <v-btn
              color="primary"
              size="large"
              block
              type="submit"
              :loading="loading"
              :disabled="!canSubmit || loading"
            >
              Create Account
            </v-btn>
          </v-form>

          <!-- LOGIN LINK -->
          <div class="text-center mt-6">
            <span class="text-body-2 text-medium-emphasis">Already have an account?</span>
            <v-btn variant="text" to="/login" class="text-none font-weight-medium px-1">
              Sign In
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT PANEL: BRAND MESSAGE -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center bg-primary text-white pa-10 order-1 order-md-2">
        <div class="text-center px-6">
          <v-icon size="80" class="mb-6">mdi-account-plus-outline</v-icon>
          <h2 class="text-h4 font-weight-bold mb-3">Get Started</h2>
          <p class="text-body-1 mb-4">
            Create your account to organize and manage your assets securely in one place.
          </p>
          <v-divider class="my-4 opacity-50" />
          <div class="text-left">
            <div class="d-flex align-center mb-3">
              <v-icon size="20" class="mr-3">mdi-shield-check</v-icon>
              <span>Enterprise-grade security</span>
            </div>
            <div class="d-flex align-center mb-3">
              <v-icon size="20" class="mr-3">mdi-cloud-sync</v-icon>
              <span>Cloud-based storage</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="20" class="mr-3">mdi-account-multiple</v-icon>
              <span>Team collaboration</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
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

// FORM STATE
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

// ALERT STATE
const showAlert = ref(false)
const alertMessage = ref('')

// VALIDATION RULES
const rules = {
  required: (v: string) => {
    const result = validateRequired(v, 'This field')
    return result.valid ? true : result.error || 'This field is required'
  },
  fullName: (v: string) => {
    const result = validateFullName(v)
    return result.valid ? true : result.error || 'Invalid full name'
  },
  organization: (v: string) => {
    const result = validateOrganization(v)
    return result.valid ? true : result.error || 'Invalid organization'
  },
  email: (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email address'
  },
  password: (v: string) => {
    const result = validatePassword(v)
    return result.valid ? true : result.error || 'Password does not meet requirements'
  },
}

const canSubmit = computed(() => {
  const isFullNameValid = validateFullName(fullName.value).valid
  const isOrganizationValid = validateOrganization(organization.value).valid
  const isEmailValid = validateEmail(email.value).valid
  const isPasswordValid = validatePassword(password.value).valid
  const isConfirmPasswordValid =
    confirmPassword.value.trim().length > 0 && password.value === confirmPassword.value

  return (
    isFormValid.value &&
    isFullNameValid &&
    isOrganizationValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    !loading.value
  )
})

// PASSWORD STRENGTH CALCULATION
const passwordStrength = computed(() => {
  let score = 0

  if (password.value.length >= 8) score += 25
  if (/[A-Z]/.test(password.value)) score += 25
  if (/[a-z]/.test(password.value)) score += 25
  if (/[0-9]/.test(password.value)) score += 25

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

// REGISTER HANDLER
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

    // Redirect to verification page
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

