<script setup lang="ts"></script>

<template>
  <router-view />
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