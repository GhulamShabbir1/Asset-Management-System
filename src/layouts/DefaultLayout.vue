<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'

const drawer = ref(true)
const rail = ref(false)
</script>

<template>
  <v-app class="bg-background">
    <AppSidebar v-model="drawer" v-model:rail="rail" />
    <AppNavbar />

    <v-main>
      <div class="px-4 pt-1 pb-0 h-100">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>