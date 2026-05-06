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
  { title: 'Assignment History', icon: 'mdi-history', path: '/history' },
  { title: 'User Management', icon: 'mdi-account-multiple-outline', path: '/users' },
]
</script>

<template>
  <v-navigation-drawer 
    v-model="drawer" 
    color="#171b29" 
    width="220" 
    border="0"
  >
    <div class="pa-4">
      <div class="text-white text-h6 font-weight-bold tracking-tight">Shelf</div>
      <div class="text-grey-lighten-1" style="font-size: 11px;">Asset Management</div>
    </div>

    <v-list nav density="compact" class="px-2">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
        color="success-button"
        base-color="grey-lighten-1"
        rounded="md"
        class="mb-1 font-weight-medium text-body-2"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-3">
        <v-btn
          block
          color="success-button"
          prepend-icon="mdi-plus"
          class="text-black font-weight-bold text-none"
          rounded="md"
          elevation="0"
        >
          New Assignment
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>