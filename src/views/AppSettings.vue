<template>
  <v-container max-width="1200" class="py-3 bg-background settings-view" fluid>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="page-title font-weight-bold text-high-emphasis mb-1">System Settings</h1>
        <p class="page-subtitle text-medium-emphasis mb-0">
          Manage your personal profile and account security settings.
        </p>
      </v-col>
    </v-row>

    <v-form ref="settingsForm" v-model="isFormValid" @submit.prevent="saveAllChanges">
      <v-row>
        <!-- Profile Section -->
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="0" border class="fill-height">
            <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
              <div class="section-title font-weight-bold">Profile Information</div>
              <div class="section-copy text-medium-emphasis mt-1">Update your personal identification.</div>
            </v-card-title>
            
            <v-card-text class="pa-3">

              <v-text-field
                class="compact-setting-field mb-3"
                v-model="profile.fullName"
                label="Full Name"
                variant="outlined" color="primary"
                prepend-inner-icon="mdi-account"
                density="compact"
                hide-details
              ></v-text-field>

              <v-text-field
                class="compact-setting-field"
                v-model="profile.jobTitle"
                label="Job Title"
                variant="outlined" color="primary"
                prepend-inner-icon="mdi-briefcase"
                density="compact"
                hide-details
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Security Section -->
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="0" border class="fill-height">
            <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
              <div class="section-title font-weight-bold">Security & Password</div>
              <div class="section-copy text-medium-emphasis mt-1">Update your password to keep your account secure.</div>
            </v-card-title>
            
            <v-card-text class="pa-3">
              <v-text-field
                class="compact-setting-field mb-3"
                v-model="auth.currentPassword"
                label="Current Password"
                type="password"
                variant="outlined" color="primary"
                prepend-inner-icon="mdi-lock"
                density="compact"
              ></v-text-field>

              <v-text-field
                class="compact-setting-field mb-3"
                v-model="auth.newPassword"
                label="New Password"
                type="password"
                variant="outlined" color="primary"
                prepend-inner-icon="mdi-key-plus"
                density="compact"
                :rules="passwordRules"
              ></v-text-field>

              <v-text-field
                class="compact-setting-field"
                v-model="auth.confirmPassword"
                label="Confirm New Password"
                type="password"
                variant="outlined" color="primary"
                prepend-inner-icon="mdi-check-circle"
                density="compact"
                :rules="confirmRules"
                hide-details="auto"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Unified Save Button -->
      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            rounded="md"
            class="px-8 font-weight-bold"
            :loading="isSaving"
            :disabled="!isFormValid && (auth.newPassword || auth.confirmPassword)"
            @click="saveAllChanges"
          >
            Save All Changes
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right" rounded="lg">
      <div class="d-flex align-center font-weight-medium">
        <v-icon :icon="snackbar.icon" class="mr-2"></v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import authService from '@/services/authService'

const settingsForm = ref(null)
const isFormValid = ref(false)
const isSaving = ref(false)

// State
const profile = ref({ 
  fullName: 'Marcus Chen', 
  jobTitle: 'Senior IT Administrator'
})

const auth = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Rules
const passwordRules = [
  v => !v || v.length >= 8 || 'Password must be at least 8 characters'
]

const confirmRules = [
  v => v === auth.value.newPassword || 'Passwords do not match'
]

// Global notification state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'mdi-check-circle'
})

const notify = (text, type = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color: type === 'success' ? 'success' : 'error',
    icon: type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
  }
}

const saveAllChanges = async () => {
  // If user touched password fields, validate and call API
  if (auth.value.newPassword || auth.value.currentPassword) {
    const { valid } = await settingsForm.value.validate()
    if (!valid) return

    isSaving.value = true
    try {
      await authService.updatePassword({
        old_password: auth.value.currentPassword,
        new_password: auth.value.newPassword,
        confirm_password: auth.value.confirmPassword
      })
      
      notify('Password updated successfully')
      
      // Clear password fields after success
      auth.value.currentPassword = ''
      auth.value.newPassword = ''
      auth.value.confirmPassword = ''
      
      if (settingsForm.value) {
        settingsForm.value.resetValidation()
      }
    } catch (error) {
      notify(error.message || 'Failed to update password', 'error')
    } finally {
      isSaving.value = false
    }
  } else {
    // Only profile changes (still mock for now as per previous instruction)
    isSaving.value = true
    setTimeout(() => {
      isSaving.value = false
      notify('Profile settings updated')
    }, 800)
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
.compact-action-btn { font-size: 0.72rem; min-height: 34px; }

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
