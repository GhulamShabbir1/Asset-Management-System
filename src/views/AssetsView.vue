<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import CreateAssignmentModal from '@/components/modals/CreateAssignModal.vue'
import CreateAssetModal from '@/components/modals/CreateAssetModal.vue'
import CreateCategoryModal from '@/components/modals/CreateCategoryModal.vue'

// Services
import categoryService, { type CreateCategoryPayload } from '@/services/categoryService'
import assetService, { type Asset, type CreateAssetPayload } from '@/services/assetService'
import assignmentService, { type CheckoutPayload } from '@/services/assignmentService'

// Modal States
const showAssignmentModal = ref(false)
const showAssetModal = ref(false)
const showCategoryModal = ref(false)

// Table & Filter States
const filters = ['All', 'Available', 'Assigned', 'Maintenance', 'Inactive']
const activeFilter = ref('All')
const assets = ref<Asset[]>([])
const isLoading = ref(false)

// Pagination States
const currentPage = ref(1)
const totalPages = ref(1)
const totalAssetsCount = ref(0)

// --- API Calls ---

const fetchAssetsList = async () => {
  isLoading.value = true
  try {
    const params: Record<string, any> = { 
      page: currentPage.value, 
      per_page: 15 
    }
    
    if (activeFilter.value !== 'All') {
      params.status = activeFilter.value.toLowerCase()
    }

    const response = await assetService.getAssets(params)
    if (response.success && response.data) {
      assets.value = response.data.list
      totalAssetsCount.value = response.data.meta.total
      totalPages.value = response.data.meta.lastPage || 1
    }
  } catch (error) {
    console.error('Failed to fetch assets:', error)
  } finally {
    isLoading.value = false
  }
}

// Reset page to 1 when changing filters
watch(activeFilter, () => {
  currentPage.value = 1
  fetchAssetsList()
})

// Fetch new page when pagination changes
watch(currentPage, () => {
  fetchAssetsList()
})

onMounted(() => {
  fetchAssetsList()
})

// --- Form Submissions ---

const handleAssetSave = async (data: CreateAssetPayload) => {
  try {
    await assetService.createAsset(data)
    showAssetModal.value = false
    fetchAssetsList() // Refresh table
  } catch (error) {
    console.error('Failed to create asset:', error)
  }
}

const handleCategorySave = async (data: CreateCategoryPayload) => {
  try {
    await categoryService.createCategory(data)
    showCategoryModal.value = false
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}

const handleAssignmentSave = async (data: CheckoutPayload) => {
  try {
    await assignmentService.checkoutAsset(data)
    showAssignmentModal.value = false
    fetchAssetsList() // Refresh table to update stock/status
  } catch (error) {
    console.error('Failed to assign asset:', error)
  }
}

const deleteAsset = async (id: number | string) => {
  if (confirm('Are you sure you want to delete this asset?')) {
    try {
      await assetService.deleteAsset(id)
      fetchAssetsList()
    } catch (error) {
      console.error('Failed to delete asset:', error)
    }
  }
}

// --- UI Helpers ---

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return { text: 'primary', bg: 'primary-light' }
    case 'assigned': return { text: 'blue-darken-2', bg: 'blue-lighten-5' }
    case 'maintenance': return { text: 'error', bg: 'red-lighten-5' }
    case 'inactive': return { text: 'grey-darken-2', bg: 'grey-lighten-3' }
    default: return { text: 'grey-darken-2', bg: 'grey-lighten-3' }
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5 font-weight-bold mb-0" style="line-height: 1.1;">Assets</h1>

      <div class="d-flex align-center">
        <v-btn
          color="primary" variant="tonal" size="small" prepend-icon="mdi-clipboard-account-outline" class="text-none font-weight-bold mr-3 rounded-md" elevation="0"
          @click="showAssignmentModal = true"
        >
          Assign Assets
        </v-btn>
        
        <v-btn
          color="primary" variant="outlined" size="small" prepend-icon="mdi-shape-plus" class="text-none font-weight-bold mr-3 rounded-md" elevation="0"
          @click="showCategoryModal = true"
        >
          Add Category
        </v-btn>

        <v-btn
          color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none font-weight-bold rounded-md" elevation="0"
          @click="showAssetModal = true"
        >
          Add Asset
        </v-btn>
      </div>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <div class="d-flex align-center justify-space-between pa-4 border-b flex-wrap gap-3">
        <div class="d-flex align-center flex-wrap gap-2">
          <v-chip
            v-for="filter in filters"
            :key="filter"
            :color="activeFilter === filter ? 'primary' : 'grey-lighten-4'"
            :class="[
              'cursor-pointer',
              activeFilter === filter ? 'text-white font-weight-bold' : 'text-medium-emphasis font-weight-medium',
            ]"
            variant="flat"
            size="small"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </v-chip>
        </div>

        <div class="d-flex text-right align-center">
          <div>
            <div class="text-medium-emphasis font-weight-bold mb-1" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
              Total Assets
            </div>
            <div class="text-h6 font-weight-bold" style="line-height: 1;">{{ totalAssetsCount }}</div>
          </div>
        </div>
      </div>

      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-bold text-medium-emphasis text-caption px-4" style="text-transform: uppercase;">Asset ID</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Asset Name</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Category</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Department</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Status</th>
            <th class="font-weight-bold text-medium-emphasis text-caption text-right" style="text-transform: uppercase;">Actions</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="6" class="text-center py-10">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="assets.length === 0">
          <tr>
            <td colspan="6" class="text-center py-8 text-medium-emphasis text-body-2">
              No assets found for this filter.
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="item in assets" :key="item.id">
            <td class="font-weight-bold text-caption px-4">{{ item.assetCode }}</td>
            <td class="text-body-2 font-weight-medium">{{ item.assetName }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.category?.name || 'N/A' }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.department?.name || 'N/A' }}</td>
            <td>
              <v-chip size="small" variant="flat" :color="getStatusColor(item.status).bg" :class="[`text-${getStatusColor(item.status).text}`, 'font-weight-bold text-uppercase']">
                {{ item.status }}
              </v-chip>
            </td>

            <td class="text-right" style="min-width: 100px;">
              <v-tooltip text="Edit Asset" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="primary" class="mr-1" />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Asset" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="deleteAsset(item.id)" />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="totalPages > 1" class="d-flex justify-space-between align-center pa-3 border-t bg-grey-lighten-4">
        <span class="text-caption text-medium-emphasis font-weight-medium pl-2">
          Showing page {{ currentPage }} of {{ totalPages }}
        </span>
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          density="compact"
          color="primary"
          class="my-0"
        ></v-pagination>
      </div>
    </v-card>
  </v-container>

  <CreateAssignmentModal v-model="showAssignmentModal" @submit="handleAssignmentSave" />
  <CreateAssetModal v-model="showAssetModal" @submit="handleAssetSave" />
  <CreateCategoryModal v-model="showCategoryModal" @submit="handleCategorySave" />
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>