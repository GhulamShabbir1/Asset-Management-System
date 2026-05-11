<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="mb-4">
      <h1 class="text-h5 font-weight-bold mb-0">Asset Lifecycle & History</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Track the complete assignment history, maintenance logs, and lifecycle of your assets.
      </p>
    </div>

    <v-card rounded="xl" elevation="0" border class="mb-4 pa-4 bg-grey-lighten-4">
      <v-row align="center" dense class="mx-n2">
        <v-col cols="12" md="4" class="px-2">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by asset tag, name, or serial..."
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="lg"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            v-model="selectedStatus"
            :items="['All', 'Assigned', 'Available', 'Maintenance', 'Retired']"
            label="Filter by Status"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="lg"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            v-model="selectedCategory"
            :items="['All', 'Hardware', 'Software', 'Peripherals', 'Furniture']"
            label="Filter by Category"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="lg"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2" class="px-2 d-flex justify-end">
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" rounded="lg" height="40" @click="resetFilters">
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