<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CreateDepartmentModal from '@/components/modals/CreateDepartmentModal.vue'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue' 
import ServerPagination from '@/components/common/ServerPagination.vue'
import departmentService, { type Department } from '@/services/departmentService'

const departments = ref<Department[]>([])
const isLoading = ref(false)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(15)
const totalPages = ref(1)
const totalDepartmentsCount = ref(0)

// Create/Edit Modal State
const showModal = ref(false)
const selectedDepartment = ref<Department | null>(null)

// Delete Modal State
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const itemToDelete = ref<{ id: number | string, name: string } | null>(null)

const fetchDepartments = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value
    }
    const response = await departmentService.getAllDepartments(params)
    
    if (response && response.success) {
      const resData = response.data as any
      departments.value = Array.isArray(resData) ? resData : (resData?.data || [])
      
      const meta = resData.meta || resData
      totalDepartmentsCount.value = meta.total || departments.value.length
      totalPages.value = meta.last_page || meta.lastPage || 1
    }
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoading.value = false
  }
}

const escapeCsvValue = (value: unknown) => {
  const normalized = value == null ? '' : String(value)
  return `"${normalized.replace(/"/g, '""')}"`
}

const exportDepartmentsToCsv = () => {
  const csvRows = [
    ['Department Name'],
    ...departments.value.map(dept => [
      dept.department_name || dept.name
    ]),
  ]

  const csvContent = csvRows.map(row => row.map(escapeCsvValue).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = `departments-${new Date().toISOString().slice(0, 10)}.csv`
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
}

onMounted(() => {
  fetchDepartments()
})

const openCreateModal = () => {
  selectedDepartment.value = null
  showModal.value = true
}

const openEditModal = (department: Department) => {
  selectedDepartment.value = { ...department }
  showModal.value = true
}

const handleSaveDepartment = async (data: any) => {
  try {
    if (selectedDepartment.value?.id) {
      await departmentService.updateDepartment(selectedDepartment.value.id, data)
    } else {
      await departmentService.createDepartment(data)
    }
    showModal.value = false
    fetchDepartments()
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'Validation failed from backend'
    alert(`Backend Error: ${errorMsg}`)
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
    await departmentService.deleteDepartment(itemToDelete.value.id)
    fetchDepartments()
    showDeleteModal.value = false 
  } catch (error: any) {
    alert(`Delete Failed: ${error.message}`)
  } finally {
    isDeleting.value = false
    itemToDelete.value = null
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-start align-center mb-6 mt-6">
      <v-btn
        variant="outlined" size="small" prepend-icon="mdi-download" class="text-none font-weight-bold mr-3 rounded-md" elevation="0"
        @click="exportDepartmentsToCsv"
      >
        Export CSV
      </v-btn>
      <v-btn
        color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none font-weight-bold rounded-md" elevation="0"
        @click="openCreateModal"
      >
        Add Department
      </v-btn>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Department Name</th>
            <th class="font-weight-bold text-medium-emphasis text-caption text-right" style="text-transform: uppercase;">Actions</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="2" class="text-center py-10">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="departments.length === 0">
          <tr>
            <td colspan="2" class="text-center py-8 text-medium-emphasis text-body-2">
              No departments found.
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="item in departments" :key="item.id">
            <td class="font-weight-bold text-body-2 pa-2">{{ item.department_name || item.name }}</td>
            <td class="text-right pa-2" style="min-width: 100px;">
              <v-tooltip text="Edit Department" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="primary" class="mr-1" @click="openEditModal(item)" />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Department" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openDeleteModal(item.id, item.department_name || item.name)" />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <ServerPagination
        v-if="totalPages > 1 || departments.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-pages="totalPages"
        :total-items="totalDepartmentsCount"
        @change="fetchDepartments"
      />
    </v-card>
  </v-container>

  <CreateDepartmentModal 
    v-model="showModal" 
    :edit-data="selectedDepartment"
    @submit="handleSaveDepartment" 
  />

  <ConfirmDeleteModal
    v-model="showDeleteModal"
    title="Delete Department"
    :item-name="itemToDelete?.name"
    :is-loading="isDeleting"
    @confirm="confirmDelete"
  />
</template>