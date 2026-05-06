<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const drawer = ref(false)

const isLoginPage = computed(() => route.name === 'login')

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const navigationItems = [
  { title: 'Home', icon: 'mdi-home', path: '/' },
  { title: 'Assets', icon: 'mdi-folder-open', path: '/assets' },
]
</script>

<template>
  <v-app v-if="!isLoginPage">
    <!-- App Bar -->
    <v-app-bar color="primary" dark prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Asset Management System</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="authStore.user">
            <v-list-item-title>{{ authStore.user.name }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item v-for="item in navigationItems" :key="item.path" :to="item.path">
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>
  </v-app>

  <!-- Login Page (No Navigation) -->
  <div v-else>
    <router-view />
  </div>
</template>

<style scoped>
:deep(.v-app) {
  background-color: var(--v-theme-background);
}

:deep(.v-container) {
  max-width: 1200px;
}
</style>
