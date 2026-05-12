<template>
  <v-container max-width="1200" class="py-3 bg-background settings-view" fluid>
    <v-row class="mb-1">
      <v-col cols="12">
        <h1 class="page-title font-weight-bold text-high-emphasis mb-1">System Settings</h1>
        <p class="page-subtitle text-medium-emphasis mb-0">
          Manage your personal profile, app preferences, and authentication credentials.
        </p>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" color="primary" class="mb-3 border-b compact-tabs">
      <v-tab value="general" prepend-icon="mdi-tune" class="font-weight-bold text-none">
        General & Profile
      </v-tab>
      <v-tab value="auth" prepend-icon="mdi-shield-account" class="font-weight-bold text-none">
        Authentication
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" :touch="false">
      <v-window-item value="general">
        <GeneralSettings />
      </v-window-item>
      
      <v-window-item value="auth">
        <AuthSettings />
      </v-window-item>
    </v-window>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      <div class="d-flex align-center font-weight-medium">
        <v-icon :icon="snackbar.icon" class="mr-2"></v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, provide } from 'vue'
import GeneralSettings from '../components/Setting/GeneralSettings.vue'
import AuthSettings from '../components/Setting/AuthSettings.vue'

const activeTab = ref('general')

// Global notification state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'mdi-check-circle'
})

// Provide a notification function to child components
const notify = (text, type = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color: type === 'success' ? 'success' : 'error',
    icon: type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
  }
}

provide('notify', notify)
</script>

<style scoped>
.settings-view { padding-block: 2px 6px; }
.page-title { font-size: 1.2rem; line-height: 1.1; }
.page-subtitle { font-size: 0.74rem; line-height: 1.3; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.compact-tabs :deep(.v-tab) {
  min-height: 38px;
  padding-inline: 12px;
  font-size: 0.78rem;
  letter-spacing: 0;
}
</style>
