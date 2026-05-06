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
    width="260" 
    border="0"
  >
    <div class="pa-6">
      <div class="text-white text-h5 font-weight-bold tracking-tight">Shelf</div>
      <div class="text-grey-lighten-1 text-caption">Asset Management</div>
    </div>

    <v-list nav class="px-3">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
        color="success-button"
        base-color="grey-lighten-1"
        rounded="lg"
        class="mb-1 font-weight-medium"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn
          block
          color="success-button"
          prepend-icon="mdi-plus"
          class="text-black font-weight-bold text-none"
          size="large"
          rounded="lg"
          elevation="0"
        >
          New Assignment
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>