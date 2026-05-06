<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const search = ref('')

defineEmits<{
  'toggle-drawer': []
}>()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar color="white" elevation="0" border="b" height="72">
    <v-app-bar-nav-icon 
      color="black" 
      @click="$emit('toggle-drawer')" 
      class="d-lg-none ml-1"
    ></v-app-bar-nav-icon>
    
    <div class="w-100 px-4 d-flex align-center">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search assets, users, or serial numbers..."
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        bg-color="grey-lighten-4"
        class="max-w-md d-none d-sm-block"
        rounded="lg"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon color="black" class="mr-2">
        <v-badge dot color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon color="black" class="mr-4">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>

      <v-divider vertical class="my-3 mr-4 d-none d-sm-block"></v-divider>

      <v-menu offset-y>
        <template #activator="{ props }">
          <div v-bind="props" class="d-flex align-center cursor-pointer">
            <div class="text-right mr-3 d-none d-sm-block">
              <div class="text-body-2 font-weight-bold text-black">
                {{ authStore.user?.name || 'Admin User' }}
              </div>
              <div class="text-caption text-medium-emphasis">
                System Administrator
              </div>
            </div>
            <v-avatar size="40">
              <v-img src="https://i.pravatar.cc/150?img=11" alt="User Avatar"></v-img>
            </v-avatar>
          </div>
        </template>
        
        <v-list>
          <v-list-item @click="handleLogout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>