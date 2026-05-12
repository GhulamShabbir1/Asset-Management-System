<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card rounded="lg" elevation="0" border class="fill-height d-flex flex-column">
        <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
          <div class="section-title font-weight-bold">Account Identities</div>
          <div class="section-copy text-medium-emphasis mt-1">Update your system username and access role.</div>
        </v-card-title>
        
        <v-card-text class="flex-grow-1 pa-3">
          <v-alert
            type="info" variant="tonal" icon="mdi-information"
            class="mb-4 compact-alert-copy" density="compact"
          >
            Email modifications are restricted by the enterprise administrator.
          </v-alert>

          <v-text-field
            class="compact-setting-field mb-2"
            v-model="auth.username"
            label="System Username"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-badge-account"
            density="compact"
          ></v-text-field>

          <v-select
            class="compact-setting-field"
            v-model="auth.role"
            :items="['System Admin', 'Asset Manager', 'Auditor', 'Standard User']"
            :menu-props="{ contentClass: 'compact-settings-menu' }"
            label="System Role"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-security"
            density="compact" hide-details
          ></v-select>
        </v-card-text>

        <v-card-actions class="pa-3 pt-0 justify-end">
          <v-btn color="primary" variant="tonal" rounded="md" class="px-4 compact-action-btn font-weight-bold" :loading="isSavingIdentity" @click="saveIdentity">
            Update Identity
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card rounded="lg" elevation="0" border class="fill-height d-flex flex-column">
        <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
          <div class="section-title font-weight-bold">Change Password</div>
          <div class="section-copy text-medium-emphasis mt-1">Ensure your account uses a strong, secure password.</div>
        </v-card-title>
        
        <v-card-text class="flex-grow-1 pa-3">
          <v-form ref="passwordForm" v-model="isFormValid" @submit.prevent="updatePassword">
            <v-text-field
              class="compact-setting-field mb-2"
              v-model="auth.currentPassword"
              label="Current Password" type="password"
              variant="outlined" color="primary"
              prepend-inner-icon="mdi-lock"
              density="compact"
              :rules="[v => !!v || 'Current password is required']"
            ></v-text-field>

            <v-text-field
              class="compact-setting-field mb-2"
              v-model="auth.newPassword"
              label="New Password" type="password"
              variant="outlined" color="primary"
              prepend-inner-icon="mdi-key-plus"
              density="compact"
              :rules="passwordRules"
            ></v-text-field>

            <v-text-field
              class="compact-setting-field"
              v-model="auth.confirmPassword"
              label="Confirm New Password" type="password"
              variant="outlined" color="primary"
              prepend-inner-icon="mdi-check-circle"
              density="compact"
              :rules="confirmRules"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-3 pt-0 justify-end">
          <v-btn 
            color="primary" variant="flat" rounded="md" 
            class="px-4 compact-action-btn font-weight-bold"
            :disabled="!isFormValid"
            :loading="isSavingPassword"
            @click="updatePassword"
          >
            Update Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, inject } from 'vue'

const notify = inject('notify')
const passwordForm = ref(null)
const isFormValid = ref(false)

const auth = ref({
  username: 'marcus.chen_admin',
  role: 'System Admin',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSavingIdentity = ref(false)
const isSavingPassword = ref(false)

// Form Validation Rules
const passwordRules = [
  v => !!v || 'New password is required',
  v => (v && v.length >= 8) || 'Password must be at least 8 characters'
]

const confirmRules = [
  v => !!v || 'Please confirm your password',
  v => v === auth.value.newPassword || 'Passwords do not match'
]

// Mock API Calls
const saveIdentity = () => {
  isSavingIdentity.value = true
  setTimeout(() => { isSavingIdentity.value = false; notify('Account identity updated') }, 800)
}

const updatePassword = async () => {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return

  isSavingPassword.value = true
  setTimeout(() => { 
    isSavingPassword.value = false
    notify('Password successfully updated')
    // Reset fields after save
    auth.value.currentPassword = ''
    auth.value.newPassword = ''
    auth.value.confirmPassword = ''
    passwordForm.value.resetValidation()
  }, 1000)
}
</script>

<style scoped>
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 0.88rem; line-height: 1.2; }
.section-copy { font-size: 0.68rem; line-height: 1.25; }
.compact-alert-copy :deep(.v-alert__content) {
  font-size: 0.68rem;
  line-height: 1.25;
}
.compact-action-btn { font-size: 0.72rem; min-height: 34px; }
.compact-setting-field :deep(.v-field__input) {
  font-size: 0.7rem;
  line-height: 1.2;
}
.compact-setting-field :deep(.v-label.v-field-label) {
  font-size: 0.68rem;
}
.compact-setting-field :deep(.v-field__input::placeholder) {
  font-size: 0.68rem;
  opacity: 0.72;
}
.compact-setting-field :deep(.v-field__prepend-inner .v-icon),
.compact-setting-field :deep(.v-field__append-inner .v-icon) {
  font-size: 0.95rem;
}
.compact-setting-field :deep(.v-field) {
  --v-input-control-height: 34px;
}
.compact-settings-menu :deep(.v-list-item) { min-height: 30px; }
.compact-settings-menu :deep(.v-list-item-title),
.compact-settings-menu :deep(.v-list-item__content) {
  font-size: 0.68rem;
  line-height: 1.2;
}
</style>
