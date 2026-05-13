<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  rail: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:rail': [value: boolean]
}>()

const authStore = useAuthStore()
const router = useRouter()

const drawer = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isRail = computed({
  get: () => props.rail,
  set: (val) => emit('update:rail', val)
})

const toggleRail = () => {
  isRail.value = !isRail.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const navigationItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', path: '/dashboard' },
  { title: 'Assets', icon: 'mdi-archive-outline', path: '/assets' },
  { title: 'Assignments', icon: 'mdi-clipboard-account-outline', path: '/assignments' },
  { title: 'Categories', icon: 'mdi-shape-outline', path: '/categories' },
  { title: 'Departments', icon: 'mdi-domain', path: '/departments' },
  { title: 'Employee Directory', icon: 'mdi-card-account-details-outline', path: '/employees' },
  { title: 'History', icon: 'mdi-history', path: '/history' },
  { title: 'User Management', icon: 'mdi-account-multiple-outline', path: '/users' },
]
</script>

<template>
  <v-navigation-drawer 
    v-model="drawer" 
    :rail="isRail"
    permanent
    color="white" 
    width="220" 
    class="custom-drawer border-r"
  >
    <v-btn
      icon
      size="24"
      elevation="2"
      class="position-absolute bg-white border"
      style="top: 24px; right: -12px; z-index: 1000;"
      @click="toggleRail"
    >
      <v-icon size="16" color="black">{{ isRail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
    </v-btn>

    <div class="d-flex align-center pa-4" :class="isRail ? 'justify-center px-0' : ''" style="height: 64px;">
      <v-avatar color="black" rounded="lg" size="32" :class="isRail ? '' : 'mr-3'">
        <v-icon color="white" size="18">mdi-bookshelf</v-icon>
      </v-avatar>
      
      <div v-if="!isRail" class="text-black text-h6 font-weight-bold tracking-tight">
        Shelf
      </div>
    </div>

    <v-list nav density="compact" class="px-2 pt-2">
      <v-tooltip
        v-for="item in navigationItems"
        :key="item.path"
        :text="item.title"
        location="right"
        :disabled="!isRail"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-list-item
            v-bind="tooltipProps"
            :to="item.path"
            :prepend-icon="item.icon"
            :title="item.title"
            color="primary"
            active-class="bg-primary-light"
            base-color="grey-darken-4"
            rounded="md"
            class="mb-1 font-weight-medium text-body-2"
          ></v-list-item>
        </template>
      </v-tooltip>
    </v-list>

    <template v-slot:append>
      <div class="px-2 pb-3">
        <v-list nav density="compact" class="pa-0">
          
          <v-tooltip text="Settings" location="right" :disabled="!isRail">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-list-item
                v-bind="tooltipProps"
                to="/settings"
                color="primary"
                active-class="bg-primary-light"
                prepend-icon="mdi-cog-outline"
                title="Settings"
                base-color="grey-darken-4"
                rounded="md"
                class="mb-1 font-weight-medium text-body-2 cursor-pointer"
              ></v-list-item>
            </template>
          </v-tooltip>

          <v-divider class="my-1 mx-2"></v-divider>

          <v-tooltip text="Logout" location="right" :disabled="!isRail">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-list-item
                v-bind="tooltipProps"
                @click="handleLogout"
                prepend-icon="mdi-logout"
                title="Logout"
                base-color="error"
                class="font-weight-medium text-body-2 text-error rounded-md cursor-pointer mt-1 logout-item"
              ></v-list-item>
            </template>
          </v-tooltip>

        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.custom-drawer {
  overflow: visible !important;
}

.custom-drawer :deep(.v-navigation-drawer__content) {
  overflow: visible !important;
}

/* Force inactive icons to be darker and not washed out */
.custom-drawer :deep(.v-list-item:not(.v-list-item--active) .v-list-item__prepend > .v-icon) {
  opacity: 0.8 !important;
}

/* Custom hover state for the Logout button */
.logout-item:hover {
  background-color: rgba(var(--v-theme-error), 0.12) !important;
}

.logout-item:hover :deep(.v-list-item__prepend > .v-icon) {
  opacity: 1 !important;
}
</style>