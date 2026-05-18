<template>
  <v-container fluid class="pa-0 mx-auto history-view" style="max-width: 1400px;">
    <v-card rounded="lg" elevation="0" border class="mb-3 pa-3 bg-grey-lighten-4">
      <v-row align="center" density="compact" class="mx-n1">
        <v-col cols="12" md="4" class="px-2">
          <v-text-field
            v-model="searchQuery"
            class="compact-filter-field"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by asset tag, name, or serial..."
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            v-model="selectedStatus"
            class="compact-filter-field"
            :items="statusOptions"
            :menu-props="{ contentClass: 'compact-select-menu' }"
            label="Filter by Status"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="px-2">
          <v-select
            v-model="selectedCategory"
            class="compact-filter-field"
            :items="availableCategories"
            :menu-props="{ contentClass: 'compact-select-menu' }"
            label="Filter by Category"
            variant="outlined"
            density="compact"
            hide-details
            bg-color="white"
            rounded="md"
          />
        </v-col>
        <v-col cols="12" md="2" class="px-2 d-flex justify-end">
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-refresh"
            rounded="md"
            height="36"
            @click="resetFilters"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div v-if="assetsLoading" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <AssetListTable
      v-else
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
import AssetListTable from '@/components/History/AssetListTable.vue'
import AssetHistoryModal from '@/components/modals/AssetHistoryModal.vue'
import assetService, { type Asset } from '@/services/assetService'
import { getAssignmentHistory, type AssignmentRecord } from '@/services/assignmentService'
import type { ApiError } from '@/utils/errorHandler'
import { computed, onMounted, ref } from 'vue'

type HistoryAssetRow = {
  id: string | number
  tag: string
  name: string
  category: string
  status: string
  statusColor: string
  assignedTo: string
}

type TimelineEvent = {
  key?: string | number
  title: string
  date: string
  employee?: string
  notes: string
  status?: string
  returnedAt?: string
}

const statusOptions = ['All', 'Assigned', 'Available', 'Maintenance', 'Retired']

const searchQuery = ref('')
const selectedStatus = ref('All')
const selectedCategory = ref('All')
const availableCategories = ref<string[]>(['All'])
const assetsLoading = ref(false)

const allAssets = ref<HistoryAssetRow[]>([])

const isModalOpen = ref(false)
const selectedAsset = ref<HistoryAssetRow | null>(null)
const modalLoading = ref(false)
const modalErrorMessage = ref<string | null>(null)
const modalTimelineEvents = ref<TimelineEvent[]>([])

let activeAbortController: AbortController | null = null

const filteredAssets = computed(() => {
  return allAssets.value.filter((asset) => {
    const matchStatus = selectedStatus.value === 'All' || asset.status === selectedStatus.value
    const matchCategory = selectedCategory.value === 'All' || asset.category === selectedCategory.value
    return matchStatus && matchCategory
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'All'
  selectedCategory.value = 'All'
}

function getStatusColor(status: string) {
  switch (String(status).toLowerCase()) {
    case 'assigned':
      return 'blue'
    case 'available':
      return 'success'
    case 'maintenance':
      return 'error'
    case 'retired':
    case 'inactive':
      return 'grey-darken-2'
    default:
      return 'primary'
  }
}

function normalizeDate(value: unknown) {
  if (!value) return '-'

  const parsed = new Date(value as string | number | Date)
  if (Number.isNaN(parsed.getTime())) {
    return String(value)
  }

  return parsed.toLocaleString()
}

function extractArrayPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    const source = payload as Record<string, unknown>
    if (Array.isArray(source.data)) return source.data as T[]
    if (Array.isArray(source.list)) return source.list as T[]
  }
  return []
}

function toTimelineEvent(record: AssignmentRecord): TimelineEvent {
  const status = String(record.status ?? '').trim()
  const notesParts: string[] = []

  if (typeof record.quantity === 'number') {
    notesParts.push(`Qty: ${record.quantity}`)
  }

  if (record.return_date) {
    notesParts.push(`Returned: ${normalizeDate(record.return_date)}`)
  }

  notesParts.push(record.is_active ? 'Currently active' : 'Returned / inactive')

  return {
    key: record.assignment_id ?? `${record.asset_id}-${record.assign_date}`,
    title: status || (record.is_active ? 'Assigned' : 'Returned'),
    date: normalizeDate(record.assign_date),
    employee: record.employee_id ? `Employee ID: ${record.employee_id}` : 'Unknown',
    notes: notesParts.join(' | ') || 'No details',
    status,
    returnedAt: record.return_date ? normalizeDate(record.return_date) : undefined,
  }
}

function toAssetRow(asset: Asset & Record<string, any>): HistoryAssetRow {
  const status = String(asset.status || 'Unknown')
  const assignedTo =
    asset.assigned_to?.name ||
    asset.employee?.name ||
    asset.current_assignment?.employee?.name ||
    asset.location ||
    (status.toLowerCase() === 'available' ? 'Unassigned' : 'N/A')

  return {
    id: asset.id,
    tag: asset.assetCode || asset.asset_code || `AST-${asset.id}`,
    name: asset.assetName || asset.asset_name || 'Unnamed Asset',
    category:
      asset.category?.name ||
      asset.category?.category_name ||
      asset.category_name ||
      'Uncategorized',
    status,
    statusColor: getStatusColor(status),
    assignedTo,
  }
}

async function fetchAssets() {
  assetsLoading.value = true
  try {
    const response = await assetService.getAssets({ per_page: 500 })
    const assetList = extractArrayPayload<Asset & Record<string, any>>((response as any)?.data)

    allAssets.value = assetList.map(toAssetRow)

    const categories = Array.from(
      new Set(allAssets.value.map((asset) => asset.category).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b))

    availableCategories.value = ['All', ...categories]
  } catch (error) {
    console.error('Failed to fetch assets for history:', error)
    allAssets.value = []
    availableCategories.value = ['All']
  } finally {
    assetsLoading.value = false
  }
}

function getFriendlyErrorMessage(err: unknown) {
  const e = err as Partial<ApiError> & { message?: string; status?: number | null }

  if (e.status === 401) return 'Session expired. Please sign in again.'
  if (e.isNetworkError) return 'Unable to connect. Please check your internet connection.'
  if (e.isTimeout) return 'The request took too long. Please try again.'
  if (e.message && String(e.message).trim()) return String(e.message)

  return 'Failed to load assignment history. Please try again.'
}

async function openHistoryModal(asset: HistoryAssetRow) {
  selectedAsset.value = asset
  modalErrorMessage.value = null
  modalTimelineEvents.value = []

  activeAbortController?.abort()
  activeAbortController = new AbortController()

  modalLoading.value = true
  isModalOpen.value = true

  try {
    const rawAssetId = asset?.id
    if (rawAssetId === undefined || rawAssetId === null || rawAssetId === '') {
      modalErrorMessage.value = 'Invalid asset id.'
      return
    }

    const result = await getAssignmentHistory(rawAssetId, {
      signal: activeAbortController.signal,
      timeout: 30000,
    })

    const records = extractArrayPayload<AssignmentRecord>((result as any)?.data)
    modalTimelineEvents.value = records.map(toTimelineEvent)
  } catch (err) {
    const message = String((err as any)?.message ?? '').toLowerCase()
    if (message.includes('cancel')) return

    modalErrorMessage.value = getFriendlyErrorMessage(err)
  } finally {
    modalLoading.value = false
  }
}

onMounted(() => {
  fetchAssets()
})
</script>

<style scoped>
.history-view { padding-block: 2px 6px; }
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
