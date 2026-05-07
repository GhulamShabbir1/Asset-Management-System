<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout === 'AuthLayout' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <component :is="layout" />
</template>
<style>
/* Hide scrollbar globally but keep functionality */
html {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

html::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>