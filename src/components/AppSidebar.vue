<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const drawer = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const navigationItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', path: '/dashboard' },
  { title: 'Asset Inventory', icon: 'mdi-archive-outline', path: '/assets' },
  { title: 'Employee Directory', icon: 'mdi-card-account-details-outline', path: '/employees' },
  { title: 'Assignment History', icon: 'mdi-history', path: '/assignment-history' },
  { title: 'Reports', icon: 'mdi-file-chart-outline', path: '/reports' },
  { title: 'User Management', icon: 'mdi-account-multiple-outline', path: '/users' },
]
</script>

<template>
  <v-navigation-drawer 
    v-model="drawer" 
    color="white" 
    width="220" 
    border="r"
  >
    <div class="pa-4">
      <div class="text-black text-h6 font-weight-bold tracking-tight">Shelf</div>
      <div class="text-medium-emphasis" style="font-size: 11px;">Asset Management</div>
    </div>

    <v-list nav density="compact" class="px-2">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        base-color="grey-darken-2"
        rounded="md"
        class="mb-1 font-weight-medium text-body-2"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-3">
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-plus"
          class="text-white font-weight-bold text-none"
          rounded="md"
          elevation="0"
        >
          New Assignment
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
