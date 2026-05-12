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
      :loading="modalLoading" 
      :error-message="modalErrorMessage" 
      :timeline-events="modalTimelineEvents" 
    />
  </v-container>
</template>

<script setup lang="ts">
import { getAssignmentHistory, type AssignmentRecord } from '@/services/assignmentService'
import type { ApiError } from '@/utils/errorHandler'
import { computed, ref } from 'vue'
import AssetListTable from '../components/History/AssetListTable.vue'
import AssetHistoryModal from '../components/modals/AssetHistoryModal.vue'

// --- State ---
const searchQuery = ref('')
const selectedStatus = ref('All')
const selectedCategory = ref('All')

const isModalOpen = ref(false)
const selectedAsset = ref<any>(null)

const modalLoading = ref(false)
const modalErrorMessage = ref<string | null>(null)
const modalTimelineEvents = ref<Array<{ key?: string | number; title: string; date: string; employee?: string; notes: string; status?: string; returnedAt?: string }>>([])

// Used to prevent race conditions when user opens different assets quickly.
let activeAbortController: AbortController | null = null

// --- Mock Data ---
// NOTE: History is now loaded from API, so the modal no longer depends on `asset.history`.
const allAssets = ref([
  {
    id: 'AST-2024-001',
    tag: 'TAG-8821',
    name: 'MacBook Pro M3 - 14"',
    category: 'Hardware',
    status: 'Assigned',
    statusColor: 'blue',
    assignedTo: 'Sarah Jenkins',
  },
  {
    id: 'AST-2024-002',
    tag: 'TAG-9910',
    name: 'Dell UltraSharp 32" Monitor',
    category: 'Peripherals',
    status: 'Available',
    statusColor: 'success',
    assignedTo: 'IT Stockroom',
  },
  {
    id: 'AST-2024-003',
    tag: 'TAG-4432',
    name: 'Server Rack B-12',
    category: 'Hardware',
    status: 'Maintenance',
    statusColor: 'error',
    assignedTo: 'Datacenter',
  },
])

// --- Filter Logic ---
const filteredAssets = computed(() => {
  return allAssets.value.filter((asset) => {
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

function normalizeDate(value: unknown) {
  if (!value) return '—'
  if (typeof value === 'string') return value
  try {
    return new Date(value as any).toISOString()
  } catch {
    return '—'
  }
}

function toTimelineEvent(record: AssignmentRecord) {
  const status = String(record.status ?? '').trim()

  const titleBase = status || 'Assignment'
  const qtyPart = typeof record.quantity === 'number' ? `Qty: ${record.quantity}` : ''

  const notesParts: string[] = []
  if (qtyPart) notesParts.push(qtyPart)

  if (record.return_date) {
    notesParts.push(`Returned: ${normalizeDate(record.return_date)}`)
  }

  notesParts.push(record.is_active ? 'Currently active' : 'Inactive')

  return {
    key: record.assignment_id ?? `${record.asset_id}-${record.assign_date}`,
    title: titleBase,
    date: normalizeDate(record.assign_date),
    employee: typeof record.assigned_by === 'number' ? `Employee ID: ${record.assigned_by}` : 'Unknown',
    notes: notesParts.join(' • ') || 'No details',
    status: status,
    returnedAt: record.return_date ? normalizeDate(record.return_date) : undefined,
  }
}

function getFriendlyErrorMessage(err: unknown) {
  // `handleApiError` throws ApiError instances.
  const e = err as Partial<ApiError> & { message?: string; status?: number | null }

  const status = e.status ?? null
  if (status === 401) return 'Session expired. Please sign in again.'
  if (e?.isNetworkError) return 'Unable to connect. Please check your internet connection.'
  if (e?.isTimeout) return 'The request took too long. Please try again.'

  // Backend might return a custom message.
  if (e?.message && String(e.message).trim()) return String(e.message)

  return 'Failed to load assignment history. Please try again.'
}

async function openHistoryModal(asset: any) {
  selectedAsset.value = asset
  modalErrorMessage.value = null
  modalTimelineEvents.value = []

  // Close-to-open race: cancel previous request immediately.
  activeAbortController?.abort()
  activeAbortController = new AbortController()

  modalLoading.value = true
  isModalOpen.value = true

  try {
    // Stop if modal was closed while request in-flight.
    if (!isModalOpen.value) return

    const rawAssetId = asset?.id
    if (rawAssetId === undefined || rawAssetId === null || rawAssetId === '') {
      modalTimelineEvents.value = []
      modalErrorMessage.value = 'Invalid asset id.'
      return
    }

    // API expects asset_id in path. If the app uses non-numeric ids, backend should still accept them.
    const assetId = rawAssetId

    const result = await getAssignmentHistory(assetId, {
      signal: activeAbortController.signal,
      timeout: 30000,
    })

    const records: AssignmentRecord[] = Array.isArray((result as any)?.data) ? (result as any).data : []

    // Edge: success but empty array
    modalTimelineEvents.value = records.map(toTimelineEvent)

    // If backend returns newest first, timeline might look better reversed; do NOT assume.
  } catch (err) {
    // Ignore cancellation.
    const msg = String((err as any)?.message ?? '')
    if (msg.toLowerCase().includes('cancel')) return

    modalErrorMessage.value = getFriendlyErrorMessage(err)
  } finally {
    // Only stop loading if this request is still the active one.
    modalLoading.value = false
  }
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
