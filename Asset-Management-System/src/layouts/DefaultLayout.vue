<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'

// Keep drawer open by default on desktop
const drawer = ref(true)
</script>

<template>
  <v-app class="bg-background">
    <AppSidebar v-model="drawer" />
    <AppNavbar @toggle-drawer="drawer = !drawer" />

    <v-main>
      <div class="pa-8 h-100">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>