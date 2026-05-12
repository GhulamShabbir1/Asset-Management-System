<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateDepartmentModal from '@/components/modals/CreateDepartmentModal.vue'
import departmentService, { type Department } from '@/services/departmentService'

const departments = ref<Department[]>([])
const isLoading = ref(false)

const showModal = ref(false)
const selectedDepartment = ref<Department | null>(null)

const fetchDepartments = async () => {
  isLoading.value = true
  try {
    const response = await departmentService.getAllDepartments()
    if (response && response.success) {
      // Bulletproof check: handles both paginated objects AND flat arrays from the backend
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
    // Only close if the API call succeeds!
    showModal.value = false
    fetchDepartments()
  } catch (error: any) {
    // If the backend rejects it, show the error so we know what's wrong!
    const errorMsg = error.response?.data?.message || error.message || 'Validation failed from backend'
    alert(`Backend Error: ${errorMsg}\n\nCheck the browser console (F12) for full details.`)
    console.error('Full Error Details:', error)
  }
}

const deleteDepartment = async (id: number | string) => {
  if (confirm('Are you sure you want to delete this department?')) {
    try {
      await departmentService.deleteDepartment(id)
      fetchDepartments()
    } catch (error: any) {
      alert(`Delete Failed: ${error.message}`)
    }
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-start align-center mb-4 mt-4">
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
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="deleteDepartment(item.id)" />
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
</template>