<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import CreateAssetModal from '@/components/modals/CreateAssetModal.vue'
import CreateEmployeeModal from '@/components/modals/CreateEmployeeModal.vue'
import CreateUserModal from '@/components/modals/CreateUserModal.vue'

const authStore = useAuthStore()

// --- Global Search State ---
const globalSearchQuery = ref('')

const showAssetModal = ref(false)
const showEmployeeModal = ref(false)
const showUserModal = ref(false)

const createMenuOptions = [
  { title: 'Asset', icon: 'mdi-archive-outline', action: () => showAssetModal.value = true },
  { title: 'Employee', icon: 'mdi-card-account-details-outline', action: () => showEmployeeModal.value = true },
  { title: 'User', icon: 'mdi-account-plus-outline', action: () => showUserModal.value = true },
]

// --- Handlers ---
const handleGlobalSearch = () => {
  if (!globalSearchQuery.value.trim()) return
  
  // TODO: Hook this up to your global search API or routing logic
  console.log('Executing universal search for:', globalSearchQuery.value)
}

const handleAssetSave = (data: any) => { console.log('Saving Asset:', data) }
const handleEmployeeSave = (data: any) => { console.log('Saving Employee:', data) }
const handleUserSave = (data: any) => { console.log('Saving User:', data) }
</script>

<template>
  <v-app-bar color="white" elevation="0" border="b" height="56">
    <div class="w-100 px-4 d-flex align-center">
      
      <v-spacer class="d-none d-md-block"></v-spacer>

      <v-text-field
        v-model="globalSearchQuery"
        placeholder="Search assets, users, or serial numbers..."
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        single-line
        clearable
        bg-color="grey-lighten-4"
        rounded="md"
        class="custom-search mx-4 d-none d-sm-block text-caption"
        style="max-width: 450px; width: 100%;"
        @keyup.enter="handleGlobalSearch"
      >
        <template v-slot:prepend-inner>
          <v-icon size="small" class="opacity-60">mdi-magnify</v-icon>
        </template>
        <template v-slot:clear="{ props }">
          <v-icon v-bind="props" size="small" class="opacity-60">mdi-close-circle</v-icon>
        </template>
      </v-text-field>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn 
            v-bind="props"
            color="primary" 
            variant="flat" 
            rounded="lg" 
            prepend-icon="mdi-plus"
            class="text-none font-weight-bold px-4"
            elevation="0"
          >
            New
          </v-btn>
        </template>
        
        <v-list density="compact" class="mt-1 pa-1" rounded="lg" elevation="3" min-width="140">
          <v-list-item
            v-for="(item, index) in createMenuOptions"
            :key="index"
            @click="item.action()"
            color="primary"
            class="rounded-md cursor-pointer px-2 py-1"
          >
            <div class="d-flex align-center">
              <v-icon size="small" :icon="item.icon" class="mr-2 text-medium-emphasis"></v-icon>
              <span class="text-body-2 font-weight-medium">{{ item.title }}</span>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider vertical class="my-2 mx-4 d-none d-sm-block"></v-divider>

      <div class="d-flex align-center">
        <div class="text-right mr-3 d-none d-sm-block">
          <div class="text-caption font-weight-bold text-black" style="line-height: 1.2;">
            {{ authStore.user?.name || 'Admin User' }}
          </div>
          <div class="text-medium-emphasis" style="font-size: 10px;">
            System Administrator
          </div>
        </div>
        <v-avatar size="32">
          <v-img src="https://i.pravatar.cc/150?img=11" alt="User Avatar"></v-img>
        </v-avatar>
      </div>

    </div>
  </v-app-bar>

  <CreateAssetModal v-model="showAssetModal" @submit="handleAssetSave" />
  <CreateEmployeeModal v-model="showEmployeeModal" @submit="handleEmployeeSave" />
  <CreateUserModal v-model="showUserModal" @submit="handleUserSave" />
</template>

<style scoped>
/* Vuetify's default compact height is 40px. 
  Reducing it by exactly 10% brings it down to 36px.
*/
.custom-search :deep(.v-field) {
  min-height: 36px !important;
}

.custom-search :deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
</style>