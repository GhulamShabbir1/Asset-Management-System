<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card rounded="lg" elevation="0" border class="fill-height d-flex flex-column">
        <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
          <div class="section-title font-weight-bold">Update Profile</div>
          <div class="section-copy text-medium-emphasis mt-1">Update your personal information and avatar.</div>
        </v-card-title>
        
        <v-card-text class="flex-grow-1 pa-3">
          <div class="d-flex align-center mb-4">
            <v-avatar size="56" color="grey-lighten-3" class="mr-3 border" rounded="md">
              <v-img src="https://i.pravatar.cc/150?img=11"></v-img>
            </v-avatar>
            <v-btn variant="outlined" color="primary" size="small" prepend-icon="mdi-camera" rounded="md" class="compact-action-btn">
              Change Photo
            </v-btn>
          </div>

          <v-text-field
            class="compact-setting-field mb-2"
            v-model="profile.fullName"
            label="Full Name"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-account"
            density="compact"
          ></v-text-field>

          <v-text-field
            class="compact-setting-field"
            v-model="profile.jobTitle"
            label="Job Title"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-briefcase"
            density="compact" hide-details
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-3 pt-0 justify-end">
          <v-btn color="primary" variant="flat" rounded="md" class="px-4 compact-action-btn font-weight-bold" :loading="isSavingProfile" @click="saveProfile">
            Save Profile
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" md="6" class="d-flex flex-column gap-4">
      
      <v-card rounded="lg" elevation="0" border>
        <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
          <div class="section-title font-weight-bold">Company Organization</div>
          <div class="section-copy text-medium-emphasis mt-1">Assign your primary reporting department.</div>
        </v-card-title>
        <v-card-text class="pa-3">
          <v-select
            class="compact-setting-field"
            v-model="appSettings.department"
            :items="['Information Technology', 'Human Resources', 'Operations', 'Finance', 'Executive']"
            :menu-props="{ contentClass: 'compact-settings-menu' }"
            label="Company Department"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-domain"
            density="compact" hide-details
          ></v-select>
        </v-card-text>
        <v-card-actions class="pa-3 pt-0 justify-end">
          <v-btn color="primary" variant="tonal" rounded="md" class="px-4 compact-action-btn font-weight-bold" :loading="isSavingOrg" @click="saveOrg">
            Update Department
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card rounded="lg" elevation="0" border class="flex-grow-1">
        <v-card-title class="pa-3 pb-2 border-b bg-grey-lighten-4">
          <div class="section-title font-weight-bold">App Preferences</div>
          <div class="section-copy text-medium-emphasis mt-1">Configure local system settings.</div>
        </v-card-title>
        <v-card-text class="pa-3">
          <v-select
            class="compact-setting-field mb-2"
            v-model="appSettings.timezone"
            :items="['UTC (Coordinated Universal Time)', 'EST (Eastern Standard Time)', 'PST (Pacific Standard Time)']"
            :menu-props="{ contentClass: 'compact-settings-menu' }"
            label="Default Timezone"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-earth"
            density="compact" hide-details
          ></v-select>
          
          <v-select
            class="compact-setting-field mt-3"
            v-model="appSettings.dateFormat"
            :items="['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']"
            :menu-props="{ contentClass: 'compact-settings-menu' }"
            label="Date Format"
            variant="outlined" color="primary"
            prepend-inner-icon="mdi-calendar"
            density="compact" hide-details
          ></v-select>
        </v-card-text>
        <v-card-actions class="pa-3 pt-0 justify-end">
          <v-btn color="primary" variant="tonal" rounded="md" class="px-4 compact-action-btn font-weight-bold" :loading="isSavingPrefs" @click="savePrefs">
            Save Preferences
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-col>
  </v-row>
</template>

<script setup>
import { ref, inject } from 'vue'

const notify = inject('notify')

// Mock State
const profile = ref({ fullName: 'Marcus Chen', jobTitle: 'Senior IT Administrator' })
const appSettings = ref({ department: 'Information Technology', timezone: 'EST (Eastern Standard Time)', dateFormat: 'YYYY-MM-DD' })

// Loading States
const isSavingProfile = ref(false)
const isSavingOrg = ref(false)
const isSavingPrefs = ref(false)

// Mock API Calls
const saveProfile = () => {
  isSavingProfile.value = true
  setTimeout(() => { isSavingProfile.value = false; notify('Profile updated successfully') }, 800)
}
const saveOrg = () => {
  isSavingOrg.value = true
  setTimeout(() => { isSavingOrg.value = false; notify('Department updated successfully') }, 800)
}
const savePrefs = () => {
  isSavingPrefs.value = true
  setTimeout(() => { isSavingPrefs.value = false; notify('Preferences saved successfully') }, 800)
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.section-title { font-size: 0.88rem; line-height: 1.2; }
.section-copy { font-size: 0.68rem; line-height: 1.25; }
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
