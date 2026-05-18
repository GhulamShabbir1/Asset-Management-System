<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import CreateAssetModal from '@/components/modals/CreateAssetModal.vue'
import ServerPagination from '@/components/common/ServerPagination.vue'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue'
import assetService, { type Asset, type CreateAssetPayload } from '@/services/assetService'

const showDeleteModal = ref(false)
const isDeleting = ref(false)
const itemToDelete = ref<{ id: number | string, name: string } | null>(null)

const showAssetModal = ref(false)
const selectedAsset = ref<Asset | null>(null)

const filters = ['All', 'Available', 'Assigned', 'Maintenance', 'Inactive']
const activeFilter = ref('All')
const assets = ref<Asset[]>([])
const isLoading = ref(false)

const currentPage = ref(1)
const totalPages = ref(1)
const totalAssetsCount = ref(0)
const itemsPerPage = ref(15)

const fetchAssetsList = async () => {
  isLoading.value = true
  try {
    const params: Record<string, any> = { 
      page: currentPage.value, 
      per_page: itemsPerPage.value 
    }
    
    if (activeFilter.value !== 'All') {
      params.status = activeFilter.value.toLowerCase()
    }

    const response = await assetService.getAssets(params)
    
    if (response && response.success && response.data) {
      const responseData = response.data as any
      
      assets.value = Array.isArray(responseData) 
        ? responseData 
        : (responseData.data || responseData.list || [])
        
      const meta = responseData.meta || responseData
      totalAssetsCount.value = meta.total || assets.value.length
      totalPages.value = meta.last_page || meta.lastPage || 1
    }
  } catch (error: any) {
    console.error('Failed to fetch assets:', error)
  } finally {
    isLoading.value = false
  }
}

watch(activeFilter, () => {
  currentPage.value = 1
  fetchAssetsList()
})

onMounted(() => {
  fetchAssetsList()
})

const openCreateModal = () => {
  selectedAsset.value = null
  showAssetModal.value = true
}

const openEditModal = (asset: Asset) => {
  selectedAsset.value = { ...asset }
  showAssetModal.value = true
}

const handleAssetSave = async (data: CreateAssetPayload) => {
  try {
    if (selectedAsset.value?.id) {
      await assetService.updateAsset(selectedAsset.value.id, data)
    } else {
      await assetService.createAsset(data)
    }
    showAssetModal.value = false
    fetchAssetsList() 
  } catch (error) {
    console.error('Failed to save asset:', error)
  }
}

const openDeleteModal = (id: number | string, name: string) => {
  itemToDelete.value = { id, name }
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await assetService.deleteAsset(itemToDelete.value.id)
    fetchAssetsList()
    showDeleteModal.value = false 
  } catch (error: any) {
    alert(`Delete Failed: ${error.message}`)
  } finally {
    isDeleting.value = false
    itemToDelete.value = null
  }
}

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
      <div class="d-flex align-center mb-2 mt-3 w-100 justify-end gap-3">
        <v-btn
          variant="outlined" size="small" prepend-icon="mdi-download" class="text-none font-weight-bold rounded-md" elevation="0"
        >
          Export CSV
        </v-btn>

        <v-btn
          color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none font-weight-bold rounded-md" elevation="0"
          @click="openCreateModal"
        >
          Add Asset
        </v-btn>
      </div>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-8">
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
        <thead class="bg-grey-lighten-4">
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
            <td class="font-weight-bold text-caption px-4">{{ item.assetCode || item.asset_code }}</td>
            <td class="text-body-2 font-weight-medium">{{ item.assetName || item.asset_name }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.category?.name || 'N/A' }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.department?.name || item.department?.department_name || 'N/A' }}</td>
            <td>
              <v-chip size="small" variant="flat" :color="getStatusColor(item.status).bg" :class="[`text-${getStatusColor(item.status).text}`, 'font-weight-bold text-uppercase']">
                {{ item.status }}
              </v-chip>
            </td>

            <td class="text-right" style="min-width: 100px;">
              <v-tooltip text="Edit Asset" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="primary" class="mr-1" @click="openEditModal(item)" />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Asset" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openDeleteModal(item.id, item.assetName || item.asset_name)" />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <ServerPagination
        v-if="totalPages > 1 || assets.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-pages="totalPages"
        :total-items="totalAssetsCount"
        @change="fetchAssetsList"
      />
    </v-card>

  </v-container>
  
  <CreateAssetModal 
    v-model="showAssetModal" 
    :edit-data="selectedAsset"
    @submit="handleAssetSave" 
  />
  
  <ConfirmDeleteModal
    v-model="showDeleteModal"
    title="Delete Asset"
    :item-name="itemToDelete?.name"
    :is-loading="isDeleting"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
