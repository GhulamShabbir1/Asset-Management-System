<template>
  <v-container fluid class="pa-0 mx-auto history-view" style="max-width: 1400px;">
  
    <v-card rounded="lg" elevation="0" border class="mb-3 pa-3 bg-grey-lighten-4">
      <v-row align="center" dense class="mx-n1">
        <v-col cols="12" md="4" class="px-2">
          <v-text-field
            class="compact-filter-field"
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by asset tag, name, or serial..."
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            class="compact-filter-field"
            v-model="selectedStatus"
            :items="['All', 'Assigned', 'Available', 'Maintenance', 'Retired']"
            :menu-props="{ contentClass: 'compact-select-menu' }"
            label="Filter by Status"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            class="compact-filter-field"
            v-model="selectedCategory"
            :items="['All', 'Hardware', 'Software', 'Peripherals', 'Furniture']"
            :menu-props="{ contentClass: 'compact-select-menu' }"
            label="Filter by Category"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2" class="px-2 d-flex justify-end">
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" rounded="md" height="36" @click="resetFilters">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <AssetListTable 
      :assets="filteredAssets" 
      :search="searchQuery"
      @view-history="openHistoryModal" 
    />

    <AssetHistoryModal 
      v-model="isModalOpen" 
      :asset="selectedAsset" 
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AssetListTable from '../components/History/AssetListTable.vue'
import AssetHistoryModal from '../components/modals/AssetHistoryModal.vue'

// --- State ---
const searchQuery = ref('')
const selectedStatus = ref('All')
const selectedCategory = ref('All')

const isModalOpen = ref(false)
const selectedAsset = ref<any>(null)

// --- Mock Data ---
const allAssets = ref([
  {
    id: 'AST-2024-001',
    tag: 'TAG-8821',
    name: 'MacBook Pro M3 - 14"',
    category: 'Hardware',
    status: 'Assigned',
    statusColor: 'blue',
    assignedTo: 'Sarah Jenkins',
    history: [
      { date: 'Oct 12, 2024', action: 'Assigned to User', user: 'Admin', notes: 'Assigned to Sarah Jenkins in Engineering.' },
      { date: 'Sep 01, 2024', action: 'Maintenance Check', user: 'IT Support', notes: 'Routine diagnostic. Battery health at 100%.' },
      { date: 'Aug 15, 2024', action: 'Purchased', user: 'Procurement', notes: 'Received from Apple Store.' }
    ]
  },
  {
    id: 'AST-2024-002',
    tag: 'TAG-9910',
    name: 'Dell UltraSharp 32" Monitor',
    category: 'Peripherals',
    status: 'Available',
    statusColor: 'success',
    assignedTo: 'IT Stockroom',
    history: [
      { date: 'Oct 10, 2024', action: 'Returned', user: 'Marcus Rivera', notes: 'Employee departed. Monitor returned to stock.' },
      { date: 'Feb 20, 2023', action: 'Assigned to User', user: 'Admin', notes: 'Assigned to Marcus Rivera.' },
      { date: 'Jan 15, 2023', action: 'Purchased', user: 'Procurement', notes: 'Bulk order receipt.' }
    ]
  },
  {
    id: 'AST-2024-003',
    tag: 'TAG-4432',
    name: 'Server Rack B-12',
    category: 'Hardware',
    status: 'Maintenance',
    statusColor: 'error',
    assignedTo: 'Datacenter',
    history: [
      { date: 'Oct 15, 2024', action: 'Flagged for Repair', user: 'System', notes: 'Cooling fan failure detected.' },
      { date: 'May 05, 2021', action: 'Deployed', user: 'Tech Ops', notes: 'Installed in Rack B.' }
    ]
  }
])

// --- Filter Logic ---
const filteredAssets = computed(() => {
  return allAssets.value.filter(asset => {
    const matchStatus = selectedStatus.value === 'All' || asset.status === selectedStatus.value
    const matchCategory = selectedCategory.value === 'All' || asset.category === selectedCategory.value
    // Search query is handled by the v-data-table component itself, so we only filter dropdowns here
    return matchStatus && matchCategory
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'All'
  selectedCategory.value = 'All'
}

// --- Modal Handlers ---
function openHistoryModal(asset: any) {
  selectedAsset.value = asset
  isModalOpen.value = true
}
</script>

<style scoped>
.history-view { padding-block: 2px 6px; }
.page-title { font-size: 1.2rem; line-height: 1.1; }
.page-subtitle { font-size: 0.76rem; line-height: 1.35; }
.compact-filter-field :deep(.v-field__input) {
  font-size: 0.7rem;
  line-height: 1.2;
}
.compact-filter-field :deep(.v-field__input::placeholder) {
  font-size: 0.68rem;
  opacity: 0.72;
}
.compact-filter-field :deep(.v-label.v-field-label) {
  font-size: 0.68rem;
}
.compact-filter-field :deep(.v-field__prepend-inner .v-icon),
.compact-filter-field :deep(.v-field__append-inner .v-icon) {
  font-size: 0.95rem;
}
.compact-filter-field :deep(.v-field) {
  --v-input-control-height: 34px;
}
.compact-select-menu :deep(.v-list-item) {
  min-height: 30px;
}
.compact-select-menu :deep(.v-list-item-title),
.compact-select-menu :deep(.v-list-item__content) {
  font-size: 0.68rem;
  line-height: 1.2;
}
</style>
