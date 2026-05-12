<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

// Map route names to readable page titles
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'assets': 'Assets',
    'employees': 'Employee Directory',
    'departments': 'Departments',
    'history': 'History',
    'assignment-history': 'History',
    'reports': 'System Reports',
    'users': 'User Management',
    'settings': 'System Settings'
  }
  
  // Return the mapped title, or default to 'Shelf' if not found
  return route.name && titles[route.name as string] ? titles[route.name as string] : 'Shelf'
})
</script>

<template>
  <v-app-bar color="white" elevation="0" border="b" height="60">
    <div class="w-100 pr-2 pl-4 d-flex align-center">

      <div class="font-weight-bold text-black pl-2 pl-md-0" style="letter-spacing: -0.5px; font-size: 2rem !important; line-height: 1;">
        {{ pageTitle }}
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center pr-2">
        <div class="text-right mr-3 d-none d-md-block" style="white-space: nowrap;">
          <div class="text-body-2 font-weight-bold text-black" style="line-height: 1.2;">
            {{ authStore.user?.name || 'Admin User' }}
          </div>
          <div class="text-caption text-medium-emphasis" style="line-height: 1.2;">
            System Administrator
          </div>
        </div>
        
        <v-avatar size="36" class="cursor-pointer border">
          <v-img src="https://i.pravatar.cc/150?img=11" alt="User Avatar"></v-img>
        </v-avatar>
      </div>

    </div>
  </v-app-bar>
</template>