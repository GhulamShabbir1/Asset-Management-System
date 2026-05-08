<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const emit = defineEmits<{
  search: [query: string]
}>()

const handleSearch = () => {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  emit('search', query)
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center pa-0">
    <v-card
      class="pa-6 pa-sm-8 text-center mx-auto"
      max-width="600"
      width="100%"
      elevation="0"
      border
      rounded="xl"
    >
      <v-icon icon="mdi-laptop-account" size="64" color="primary" class="mb-4" />

      <v-card-title class="text-h5 font-weight-bold mb-2" style="line-height: 1.1;">
        Asset Lookup
      </v-card-title>

      <v-card-text class="text-caption text-medium-emphasis mb-6">
        Enter an asset name, tag number, or serial number to view its complete lifecycle
        history and details.
      </v-card-text>

      <v-form @submit.prevent="handleSearch">
        <v-text-field
          v-model="searchQuery"
          variant="outlined"
          placeholder="e.g., AST-2024-001 or MacBook Pro..."
          prepend-inner-icon="mdi-magnify"
          clearable
          color="primary"
          rounded="lg"
          hide-details
          class="mb-4"
        />

        <v-btn
          type="submit"
          color="primary"
          size="x-large"
          block
          rounded="lg"
          elevation="2"
          :disabled="!searchQuery.trim()"
        >
          Search Asset
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
