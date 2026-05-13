<template>
    <div class="d-flex flex-column flex-sm-row justify-space-between align-center pa-3 border-t bg-grey-lighten-4 gap-3">
      
      <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
        <div class="d-flex align-center gap-2">
          <span class="font-weight-medium">Rows per page:</span>
          <v-select
            :model-value="itemsPerPage"
            @update:model-value="onItemsPerPageChange"
            :items="itemsPerPageOptions"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            class="compact-select"
          ></v-select>
        </div>
  
        <v-divider vertical class="mx-1" style="height: 16px; align-self: center;"></v-divider>
  
        <span v-if="totalItems !== undefined" class="font-weight-medium">
          Total: <strong class="text-high-emphasis">{{ totalItems }}</strong> items
        </span>
      </div>
  
      <div class="d-flex align-center gap-3">
        <span class="text-caption text-medium-emphasis font-weight-medium">
          Page {{ currentPage }} of {{ totalPages || 1 }}
        </span>
        <v-pagination
          :model-value="currentPage"
          @update:model-value="onPageChange"
          :length="totalPages"
          :total-visible="5"
          density="compact"
          color="primary"
          class="my-0"
        ></v-pagination>
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  const props = withDefaults(defineProps<{
    currentPage: number
    totalPages: number
    totalItems?: number
    itemsPerPage: number
    itemsPerPageOptions?: number[]
  }>(), {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 15,
    itemsPerPageOptions: () => [10, 15, 20, 50, 100]
  })
  
  const emit = defineEmits<{
    'update:currentPage': [page: number]
    'update:itemsPerPage': [items: number]
    'change': [] // Emitted when either the page or items per page changes so the parent can fetch data
  }>()
  
  const onPageChange = (page: number) => {
    if (page === props.currentPage) return
    emit('update:currentPage', page)
    emit('change')
  }
  
  const onItemsPerPageChange = (items: number) => {
    if (items === props.itemsPerPage) return
    emit('update:itemsPerPage', items)
    // Always reset to page 1 when changing how many items are displayed
    emit('update:currentPage', 1) 
    emit('change')
  }
  </script>
  
  <style scoped>
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  
  .compact-select {
    width: 75px;
  }
  .compact-select :deep(.v-field__input) {
    font-size: 0.75rem;
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    min-height: 28px !important;
  }
  .compact-select :deep(.v-field) {
    --v-input-control-height: 28px;
  }
  .compact-select :deep(.v-field__append-inner) {
    padding-top: 4px;
  }
  </style>