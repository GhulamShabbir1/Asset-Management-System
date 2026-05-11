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
  <v-container fluid class="pa-0 mx-auto fill-height d-flex align-center justify-center history-search" style="max-width: 1400px;">
    <v-card
      class="rounded-md pa-3 text-center mx-auto"
      max-width="540"
      width="100%"
      elevation="0"
      border
    >
      <v-icon icon="mdi-laptop-account" size="52" color="primary" class="mb-3" />

      <div class="text-medium-emphasis mb-1 history-kicker">History</div>
      <v-card-title class="lookup-title font-weight-bold mb-1 pa-0">Asset Lookup</v-card-title>

      <v-card-text class="lookup-copy text-medium-emphasis px-0 pt-0 mb-3">
        Enter an asset name, tag number, or serial number to view its complete lifecycle
        history and details.
      </v-card-text>

      <v-form @submit.prevent="handleSearch">
        <v-text-field
          class="compact-search-field"
          v-model="searchQuery"
          variant="outlined"
          placeholder="e.g., AST-2024-001 or MacBook Pro..."
          prepend-inner-icon="mdi-magnify"
          clearable
          color="primary"
          rounded="md"
          hide-details
          class="mb-3"
        />

        <v-btn
          type="submit"
          color="primary"
          size="default"
          block
          rounded="md"
          :disabled="!searchQuery.trim()"
        >
          Search Asset
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
.history-search {
  min-height: calc(100vh - 96px);
}

.history-kicker {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.lookup-title {
  font-size: 1.15rem;
  line-height: 1.1;
}

.lookup-copy {
  font-size: 0.74rem;
  line-height: 1.35;
}

.compact-search-field :deep(.v-field__input) {
  font-size: 0.72rem;
  line-height: 1.2;
}

.compact-search-field :deep(.v-field__input::placeholder) {
  font-size: 0.7rem;
  opacity: 0.72;
}

.compact-search-field :deep(.v-field__prepend-inner .v-icon),
.compact-search-field :deep(.v-field__append-inner .v-icon) {
  font-size: 0.95rem;
}

.compact-search-field :deep(.v-field) {
  --v-input-control-height: 36px;
}
</style>
