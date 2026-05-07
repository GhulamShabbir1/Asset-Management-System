<template>
  <v-container max-width="1200" class="py-8 bg-background" fluid>
    
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-high-emphasis mb-2">System Settings</h2>
        <p class="text-body-1 text-medium-emphasis">
          Manage your personal profile, app preferences, and authentication credentials.
        </p>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" color="primary" class="mb-6 border-b">
      <v-tab value="general" prepend-icon="mdi-tune">General & Profile</v-tab>
      <v-tab value="auth" prepend-icon="mdi-shield-account">Authentication</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      
      <v-window-item value="general">
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column">
              <v-card-title class="pa-6 pb-2">
                <div class="text-h6 font-weight-bold">Update Profile</div>
                <div class="text-body-2 text-medium-emphasis">Update your personal information and avatar.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-6">
                <div class="d-flex align-center mb-6 mt-2">
                  <v-avatar size="72" color="grey-lighten-3" class="mr-4 border">
                    <v-img src="https://i.pravatar.cc/150?img=11"></v-img>
                  </v-avatar>
                  <v-btn variant="outlined" color="primary" size="small" prepend-icon="mdi-camera">
                    Change Photo
                  </v-btn>
                </div>

                <v-text-field
                  v-model="profile.fullName"
                  label="Full Name"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-account"
                  class="mb-4"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="profile.jobTitle"
                  label="Job Title"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-briefcase"
                  hide-details
                ></v-text-field>
              </v-card-text>

              <v-card-actions class="pa-6 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-6">Save Profile</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="mb-6">
              <v-card-title class="pa-6 pb-2">
                <div class="text-h6 font-weight-bold">Company Organization</div>
                <div class="text-body-2 text-medium-emphasis">Assign your primary reporting department.</div>
              </v-card-title>
              <v-card-text class="px-6">
                <v-select
                  v-model="appSettings.department"
                  :items="['Information Technology', 'Human Resources', 'Operations', 'Finance', 'Executive']"
                  label="Company Department"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-domain"
                  hide-details
                ></v-select>
              </v-card-text>
              <v-card-actions class="pa-6 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-6">Update Department</v-btn>
              </v-card-actions>
            </v-card>

            <v-card rounded="xl" elevation="2" border>
              <v-card-title class="pa-6 pb-2">
                <div class="text-h6 font-weight-bold">App Settings</div>
                <div class="text-body-2 text-medium-emphasis">Configure local system preferences.</div>
              </v-card-title>
              <v-card-text class="px-6">
                <v-select
                  v-model="appSettings.timezone"
                  :items="['UTC (Coordinated Universal Time)', 'EST (Eastern Standard Time)', 'PST (Pacific Standard Time)']"
                  label="Default Timezone"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-earth"
                  class="mb-4"
                  hide-details
                ></v-select>
                
                <v-select
                  v-model="appSettings.dateFormat"
                  :items="['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']"
                  label="Date Format"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-calendar"
                  hide-details
                ></v-select>
              </v-card-text>
              <v-card-actions class="pa-6 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-6">Save Preferences</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="auth">
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column">
              <v-card-title class="pa-6 pb-2">
                <div class="text-h6 font-weight-bold">Account Identities</div>
                <div class="text-body-2 text-medium-emphasis">Update your system username and access role.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-6">
                <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-6 text-body-2"
                  icon="mdi-information"
                >
                  Email modifications are restricted by the enterprise administrator.
                </v-alert>

                <v-text-field
                  v-model="auth.username"
                  label="System Username"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-badge-account"
                  class="mb-4"
                  hide-details
                ></v-text-field>

                <v-select
                  v-model="auth.role"
                  :items="['System Admin', 'Asset Manager', 'Auditor', 'Standard User']"
                  label="System Role"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-security"
                  hide-details
                ></v-select>
              </v-card-text>

              <v-card-actions class="pa-6 pt-0 justify-end">
                <v-btn color="primary" variant="flat" rounded="lg" class="px-6">Update Identity</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="2" border class="fill-height d-flex flex-column">
              <v-card-title class="pa-6 pb-2">
                <div class="text-h6 font-weight-bold">Change Password</div>
                <div class="text-body-2 text-medium-emphasis">Ensure your account uses a strong, secure password.</div>
              </v-card-title>
              
              <v-card-text class="flex-grow-1 px-6">
                <v-text-field
                  v-model="auth.currentPassword"
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-lock"
                  class="mb-4"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="auth.newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-key-plus"
                  class="mb-4"
                  hide-details
                ></v-text-field>

                <v-text-field
                  v-model="auth.confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-check-circle"
                  hide-details
                ></v-text-field>
              </v-card-text>

              <v-card-actions class="pa-6 pt-0 justify-end">
                <v-btn 
                  color="primary" 
                  variant="flat" 
                  rounded="lg" 
                  class="px-6"
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
/* Vuetify handles most styling, keeping scoped CSS clean */
.border {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>