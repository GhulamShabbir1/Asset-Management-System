<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <v-app-bar color="white" elevation="0" border="b" height="64">
    <div class="w-100 pr-2 pl-4 d-flex align-center">

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