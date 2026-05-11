<template>
  <v-card rounded="xl" elevation="0" border>
    <v-data-table 
      :headers="headers" 
      :items="assets" 
      :search="search"
      hover
      items-per-page="10"
      @click:row="handleRowClick"
    >
      <template v-slot:item.asset="{ item }">
        <div class="d-flex align-center py-2">
          <v-avatar color="grey-lighten-4" size="36" class="mr-3 border">
            <v-icon icon="mdi-devices" color="grey-darken-1" size="20"></v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-bold text-body-2">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.id }} • {{ item.tag }}</div>
          </div>
        </div>
      </template>

      <template v-slot:item.category="{ item }">
        <span class="text-body-2 text-medium-emphasis">{{ item.category }}</span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="item.statusColor" size="small" class="font-weight-bold text-uppercase" variant="tonal">
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.assignedTo="{ item }">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-account-outline" size="16" color="grey-darken-1"></v-icon>
          <span class="text-body-2">{{ item.assignedTo }}</span>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-btn 
            color="primary" 
            variant="text" 
            size="small" 
            prepend-icon="mdi-history"
            @click.stop="$emit('view-history', item)"
          >
            History
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  assets: any[]
  search: string
}>()

const emit = defineEmits(['view-history'])

const headers = [
  { title: 'ASSET DETAILS', key: 'asset', align: 'start' },
  { title: 'CATEGORY', key: 'category', align: 'start' },
  { title: 'CURRENT STATUS', key: 'status', align: 'start' },
  { title: 'LOCATION / ASSIGNMENT', key: 'assignedTo', align: 'start' },
  { title: 'ACTIONS', key: 'actions', align: 'end', sortable: false }
]

// Allows clicking anywhere on the row to open the history
function handleRowClick(event: Event, { item }: { item: any }) {
  emit('view-history', item)
}
</script>

<style scoped>
.gap-2 { gap: 8px; }
.v-data-table :deep(tbody tr) { cursor: pointer; }
.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>