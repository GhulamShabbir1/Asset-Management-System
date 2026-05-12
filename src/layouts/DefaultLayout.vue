<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/AppSidebar.vue'
import AppNavbar from '@/components/AppNavbar.vue'

const { smAndDown } = useDisplay()

const drawer = ref(true)
const rail = ref(smAndDown.value) // Default to collapsed on mobile

// Auto-collapse when window is resized to mobile sizes
watch(smAndDown, (isMobile) => {
  rail.value = isMobile
})
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