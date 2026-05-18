<template>
  <v-container max-width="900" class="py-3 bg-background settings-view" fluid>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="page-title font-weight-bold text-high-emphasis mb-1">Account Settings</h1>
        <p class="page-subtitle text-medium-emphasis mb-0">
          Update only your username and password.
        </p>
      </v-col>
    </v-row>

    <v-form ref="settingsForm" v-model="isFormValid" @submit.prevent="saveAllChanges">
      <v-row>
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="0" border class="fill-height">
            <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
              <div class="section-title font-weight-bold">Username</div>
              <div class="section-copy text-medium-emphasis mt-1">Change the name shown for your account.</div>
            </v-card-title>

            <v-card-text class="pa-3">
              <v-text-field
                v-model="profile.username"
                class="compact-setting-field"
                label="Username"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-account"
                density="compact"
                hide-details="auto"
                :rules="usernameRules"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="0" border class="fill-height">
            <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
              <div class="section-title font-weight-bold">Password</div>
              <div class="section-copy text-medium-emphasis mt-1">Set a new password for your account.</div>
            </v-card-title>

            <v-card-text class="pa-3">
              <v-text-field
                v-model="auth.currentPassword"
                class="compact-setting-field mb-3"
                label="Current Password"
                type="password"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-lock"
                density="compact"
                hide-details="auto"
              />

              <v-text-field
                v-model="auth.newPassword"
                class="compact-setting-field mb-3"
                label="New Password"
                type="password"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-key-plus"
                density="compact"
                hide-details="auto"
                :rules="passwordRules"
              />

              <v-text-field
                v-model="auth.confirmPassword"
                class="compact-setting-field"
                label="Confirm New Password"
                type="password"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-check-circle"
                density="compact"
                hide-details="auto"
                :rules="confirmRules"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            rounded="md"
            class="px-8 font-weight-bold"
            :loading="isSaving"
            @click="saveAllChanges"
          >
            Save Changes
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right" rounded="lg">
      <div class="d-flex align-center font-weight-medium">
        <v-icon :icon="snackbar.icon" class="mr-2" />
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watch } from 'vue'

const authStore = useAuthStore()

const settingsForm = ref(null)
const isFormValid = ref(false)
const isSaving = ref(false)

const profile = ref({
  username: authStore.user?.name || ''
})

const auth = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

watch(
  () => authStore.user?.name,
  (nextName) => {
    profile.value.username = nextName || ''
  },
  { immediate: true }
)

const usernameRules = [
  v => !!String(v || '').trim() || 'Username is required'
]

const passwordRules = [
  v => !v || v.length >= 8 || 'Password must be at least 8 characters'
]

const confirmRules = [
  v => !auth.value.newPassword || v === auth.value.newPassword || 'Passwords do not match'
]

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'mdi-check-circle'
})

const hasPasswordChange = computed(() =>
  Boolean(auth.value.currentPassword || auth.value.newPassword || auth.value.confirmPassword)
)

const notify = (text, type = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color: type === 'success' ? 'success' : 'error',
    icon: type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
  }
}

const resetPasswordFields = () => {
  auth.value.currentPassword = ''
  auth.value.newPassword = ''
  auth.value.confirmPassword = ''
}

const saveAllChanges = async () => {
  const trimmedUsername = profile.value.username.trim()
  if (!trimmedUsername) {
    notify('Username is required', 'error')
    return
  }

  if (hasPasswordChange.value) {
    const { valid } = await settingsForm.value.validate()
    if (!valid) return

    if (!auth.value.currentPassword || !auth.value.newPassword || !auth.value.confirmPassword) {
      notify('Fill all password fields to change your password', 'error')
      return
    }
  }

  isSaving.value = true

  try {
    if (hasPasswordChange.value) {
      await authService.updatePassword({
        old_password: auth.value.currentPassword,
        new_password: auth.value.newPassword,
        confirm_password: auth.value.confirmPassword
      })
      resetPasswordFields()
    }

    await authService.updateProfile({
      name: trimmedUsername,
      profile_picture: null
    })

    if (authStore.user) {
      authStore.setSession(
        {
          ...authStore.user,
          name: trimmedUsername
        },
        authStore.token
      )
    }

    if (settingsForm.value) {
      settingsForm.value.resetValidation()
    }

    notify('Account settings updated successfully')
  } catch (error) {
    notify(error.message || 'Failed to update account settings', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<script>
export default {
  name: 'AppSettings'
}
</script>

<style scoped>
.settings-view { padding-block: 8px 16px; }
.page-title { font-size: 1.25rem; line-height: 1.2; }
.page-subtitle { font-size: 0.8rem; line-height: 1.4; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 0.9rem; line-height: 1.2; }
.section-copy { font-size: 0.72rem; line-height: 1.3; }

.compact-setting-field :deep(.v-field__input) {
  font-size: 0.75rem;
  line-height: 1.4;
}
.compact-setting-field :deep(.v-label.v-field-label) {
  font-size: 0.72rem;
}
.compact-setting-field :deep(.v-field) {
  --v-input-control-height: 36px;
}
</style>
