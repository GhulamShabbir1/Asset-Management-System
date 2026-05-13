<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateDepartmentModal from '@/components/modals/CreateDepartmentModal.vue'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue' // <-- IMPORT ADDED
import departmentService, { type Department } from '@/services/departmentService'

const departments = ref<Department[]>([])
const isLoading = ref(false)

// Create/Edit Modal State
const showModal = ref(false)
const selectedDepartment = ref<Department | null>(null)

// --- DELETE MODAL STATE & FUNCTIONS ---
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const itemToDelete = ref<{ id: number | string, name: string } | null>(null)

const fetchDepartments = async () => {
  isLoading.value = true
  try {
    const response = await departmentService.getAllDepartments()
    if (response && response.success) {
      departments.value = Array.isArray(response.data) ? response.data : (response.data?.data || [])
    }
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoading.value = false
  }
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

// Opens the red modal
const openDeleteModal = (id: number | string, name: string) => {
  itemToDelete.value = { id, name }
  showDeleteModal.value = true
}

// Runs when user confirms deletion
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
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Status</th>
            <th class="font-weight-bold text-medium-emphasis text-caption text-right" style="text-transform: uppercase;">Actions</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="3" class="text-center py-10">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="departments.length === 0">
          <tr>
            <td colspan="3" class="text-center py-8 text-medium-emphasis text-body-2">
              No departments found.
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="item in departments" :key="item.id">
            <td class="font-weight-bold text-body-2">{{ item.department_name || item.name }}</td>
            <td>
              <v-chip size="small" variant="tonal" :color="item.status ? 'success' : 'grey-darken-1'" class="font-weight-bold text-uppercase">
                {{ item.status ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
            <td class="text-right" style="min-width: 100px;">
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