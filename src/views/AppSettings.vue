<template>
  <v-container max-width="1200" class="py-5 bg-background settings-view" fluid>
    
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="settings-page-title font-weight-bold text-high-emphasis mb-1">System Settings</h2>
        <p class="settings-copy text-medium-emphasis">
          Manage your personal profile, app preferences, and authentication credentials.
        </p>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" color="primary" class="mb-4 border-b compact-tabs" density="comfortable">
      <v-tab value="general" prepend-icon="mdi-tune" class="settings-tab">General & Profile</v-tab>
      <v-tab value="auth" prepend-icon="mdi-shield-account" class="settings-tab">Authentication</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      
      <v-window-item value="general">
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column compact-settings-card">
              <v-card-title class="pa-4 pb-2">
                <div class="settings-card-title font-weight-bold">Update Profile</div>
                <div class="settings-copy text-medium-emphasis">Update your personal information and avatar.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-4">
                <div class="d-flex align-center mb-4 mt-1">
                  <v-avatar size="56" color="grey-lighten-3" class="mr-3 border">
                    <v-img src="https://i.pravatar.cc/150?img=11"></v-img>
                  </v-avatar>
                  <v-btn variant="outlined" color="primary" size="x-small" prepend-icon="mdi-camera" class="compact-action-btn">
                    Change Photo
                  </v-btn>
                </div>

                <v-text-field
                  v-model="profile.fullName"
                  label="Full Name"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-account"
                  class="mb-3 compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="profile.jobTitle"
                  label="Job Title"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-briefcase"
                  class="compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-4 compact-action-btn">Save Profile</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="mb-4 compact-settings-card">
              <v-card-title class="pa-4 pb-2">
                <div class="settings-card-title font-weight-bold">Company Organization</div>
                <div class="settings-copy text-medium-emphasis">Assign your primary reporting department.</div>
              </v-card-title>
              <v-card-text class="px-4">
                <v-select
                  v-model="appSettings.department"
                  :items="['Information Technology', 'Human Resources', 'Operations', 'Finance', 'Executive']"
                  label="Company Department"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-domain"
                  class="compact-field"
                  density="compact"
                  hide-details
                ></v-select>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-4 compact-action-btn">Update Department</v-btn>
              </v-card-actions>
            </v-card>

            <v-card rounded="xl" elevation="2" border class="compact-settings-card">
              <v-card-title class="pa-4 pb-2">
                <div class="settings-card-title font-weight-bold">App Settings</div>
                <div class="settings-copy text-medium-emphasis">Configure local system preferences.</div>
              </v-card-title>
              <v-card-text class="px-4">
                <v-select
                  v-model="appSettings.timezone"
                  :items="['UTC (Coordinated Universal Time)', 'EST (Eastern Standard Time)', 'PST (Pacific Standard Time)']"
                  label="Default Timezone"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-earth"
                  class="mb-3 compact-field"
                  density="compact"
                  hide-details
                ></v-select>
                
                <v-select
                  v-model="appSettings.dateFormat"
                  :items="['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']"
                  label="Date Format"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-calendar"
                  class="compact-field"
                  density="compact"
                  hide-details
                ></v-select>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-4 compact-action-btn">Save Preferences</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="auth">
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column compact-settings-card">
              <v-card-title class="pa-4 pb-2">
                <div class="settings-card-title font-weight-bold">Account Identities</div>
                <div class="settings-copy text-medium-emphasis">Update your system username and access role.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-4">
                <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-4 settings-alert"
                  icon="mdi-information"
                  density="compact"
                >
                  Email modifications are restricted by the enterprise administrator.
                </v-alert>

                <v-text-field
                  v-model="auth.username"
                  label="System Username"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-badge-account"
                  class="mb-3 compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>

                <v-select
                  v-model="auth.role"
                  :items="['System Admin', 'Asset Manager', 'Auditor', 'Standard User']"
                  label="System Role"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-security"
                  class="compact-field"
                  density="compact"
                  hide-details
                ></v-select>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-4 compact-action-btn">Update Identity</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column compact-settings-card">
              <v-card-title class="pa-4 pb-2">
                <div class="settings-card-title font-weight-bold">Change Password</div>
                <div class="settings-copy text-medium-emphasis">Ensure your account uses a strong, secure password.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-4">
                <v-text-field
                  v-model="auth.currentPassword"
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-lock"
                  class="mb-3 compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="auth.newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-key-plus"
                  class="mb-3 compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="auth.confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-check-circle"
                  class="compact-field"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0 justify-end">
                <v-btn 
                  color="primary" 
                  variant="flat" 
                  rounded="lg" 
                  class="px-4 compact-action-btn"
                  :disabled="!isPasswordValid"
                >
                  Update Password
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

    </v-window>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// Tab control
const activeTab = ref('general')

// General Profile Data
const profile = ref({
  fullName: 'Marcus Chen',
  jobTitle: 'Senior IT Administrator'
})

// App Settings & Department Data
const appSettings = ref({
  department: 'Information Technology',
  timezone: 'EST (Eastern Standard Time)',
  dateFormat: 'YYYY-MM-DD'
})

// Authentication Data
const auth = ref({
  username: 'marcus.chen_admin',
  role: 'System Admin',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Basic validation check for password button
const isPasswordValid = computed(() => {
  return auth.value.currentPassword && 
         auth.value.newPassword && 
         auth.value.newPassword === auth.value.confirmPassword
})
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.settings-page-title {
  font-size: 1.45rem;
  line-height: 1.15;
}

.settings-card-title {
  font-size: 0.92rem;
  line-height: 1.2;
}

.settings-copy {
  font-size: 0.75rem;
  line-height: 1.4;
}

.compact-settings-card {
  border-color: rgba(0, 0, 0, 0.06) !important;
}

.settings-tab {
  min-height: 38px;
  font-size: 0.76rem;
  font-weight: 600;
  text-transform: none;
}

.compact-action-btn {
  font-size: 0.72rem;
  min-height: 32px;
}

.compact-field :deep(.v-field) {
  --v-field-input-padding-top: 8px;
  --v-field-input-padding-bottom: 8px;
}

.compact-field :deep(.v-label),
.compact-field :deep(input),
.compact-field :deep(.v-field__input),
.compact-field :deep(.v-select__selection-text) {
  font-size: 0.76rem;
}

.settings-alert {
  font-size: 0.74rem;
  line-height: 1.35;
}

.settings-alert :deep(.v-alert__content) {
  font-size: 0.74rem;
  line-height: 1.35;
}
</style>
