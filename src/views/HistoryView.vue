<script setup lang="ts">
import { ref } from 'vue'
import AssetHistory from '@/components/History/AssetHistory.vue'
import AssetSearch from '@/components/History/AssetSearch.vue'

const currentAsset = ref<string | null>('AST-2024-001')

const loadAssetData = (query: string) => {
  currentAsset.value = query
}

const resetAsset = () => {
  currentAsset.value = null
}
</script>

<template>
  <div class="history-view">
    <AssetSearch v-if="!currentAsset" @search="loadAssetData" />
    <AssetHistory v-else @reset="resetAsset" />
  </div>
</template>

<style scoped>
.history-view {
  min-height: calc(100vh - 120px);
}
</style>
