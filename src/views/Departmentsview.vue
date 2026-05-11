<script setup lang="ts">
import { ref, computed } from 'vue'

// --- Types ---
type Department = {
  id: string
  name: string
  manager: string
  employeeCount: number
  status: 'Active' | 'Inactive'
}

// --- Mock Data (Replace with API later) ---
const departments = ref<Department[]>([
  { id: 'DEPT-001', name: 'Information Technology', manager: 'Marcus Chen', employeeCount: 45, status: 'Active' },
  { id: 'DEPT-002', name: 'Human Resources', manager: 'Elena Rodriguez', employeeCount: 12, status: 'Active' },
  { id: 'DEPT-003', name: 'Sales & Marketing', manager: 'David Kim', employeeCount: 86, status: 'Active' },
  { id: 'DEPT-004', name: 'Operations', manager: 'Sarah Jenkins', employeeCount: 112, status: 'Active' },
  { id: 'DEPT-005', name: 'Legacy Systems', manager: 'Unassigned', employeeCount: 0, status: 'Inactive' },
])

const managers = ['Marcus Chen', 'Elena Rodriguez', 'David Kim', 'Sarah Jenkins', 'Unassigned']

// --- State ---
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  name: '',
  manager: 'Unassigned',
  status: 'Active' as 'Active' | 'Inactive'
})

// --- Computed ---
const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value
  const query = searchQuery.value.toLowerCase()
  return departments.value.filter(dept => 
    dept.name.toLowerCase().includes(query) || 
    dept.manager.toLowerCase().includes(query) ||
    dept.id.toLowerCase().includes(query)
  )
})

// --- Methods ---
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', manager: 'Unassigned', status: 'Active' }
  showModal.value = true
}

const openEditModal = (dept: Department) => {
  isEditing.value = true
  editingId.value = dept.id
  form.value = { 
    name: dept.name, 
    manager: dept.manager, 
    status: dept.status 
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveDepartment = () => {
  if (!form.value.name) return

  if (isEditing.value && editingId.value) {
    // Update existing
    const index = departments.value.findIndex(d => d.id === editingId.value)
    if (index !== -1) {
      departments.value[index] = {
        ...departments.value[index],
        name: form.value.name,
        manager: form.value.manager,
        status: form.value.status
      }
    }
  } else {
    // Create new
    departments.value.push({
      id: `DEPT-00${departments.value.length + 1}`,
      name: form.value.name,
      manager: form.value.manager,
      employeeCount: 0,
      status: form.value.status
    })
  }
  closeModal()
}

const deleteDepartment = (id: string) => {
  if (confirm('Are you sure you want to delete this department?')) {
    departments.value = departments.value.filter(d => d.id !== id)
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold mb-0" style="line-height: 1.1;">Departments</h1>
      </div>

      <div class="d-flex align-center">
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          class="text-none font-weight-bold rounded-md"
          elevation="0"
          @click="openCreateModal"
        >
          Add Department
        </v-btn>
      </div>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <div class="pa-4 border-b bg-grey-lighten-4 d-flex justify-space-between align-center">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search departments or managers..."
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          bg-color="white"
          style="max-width: 350px;"
          class="rounded-md"
        ></v-text-field>

        <div class="text-caption text-medium-emphasis font-weight-bold">
          {{ filteredDepartments.length }} Total Records
        </div>
      </div>

      <v-table hover>
        <thead>
          <tr>
            <th class="font-weight-bold text-medium-emphasis text-caption px-4" style="text-transform: uppercase;">
              ID
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Department Name
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Manager
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Employees
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Status
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption text-right" style="text-transform: uppercase;">
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="filteredDepartments.length === 0">
          <tr>
            <td colspan="6" class="text-center py-6 text-medium-emphasis text-caption">
              No departments found matching your criteria.
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="dept in filteredDepartments" :key="dept.id">
            <td class="font-weight-bold text-caption px-4 text-medium-emphasis">{{ dept.id }}</td>
            <td class="text-body-2 font-weight-bold">{{ dept.name }}</td>
            <td class="text-body-2 text-medium-emphasis">
              <div class="d-flex align-center">
                <v-avatar size="24" color="grey-lighten-3" class="mr-2">
                  <v-icon size="14" color="grey-darken-1">mdi-account</v-icon>
                </v-avatar>
                {{ dept.manager }}
              </div>
            </td>
            <td class="text-body-2">
              <v-chip size="small" variant="tonal" color="grey-darken-2" class="font-weight-bold">
                {{ dept.employeeCount }}
              </v-chip>
            </td>
            <td>
              <v-chip
                size="small"
                variant="flat"
                :color="dept.status === 'Active' ? 'success-light' : 'grey-lighten-3'"
                :class="dept.status === 'Active' ? 'text-success font-weight-bold' : 'text-grey-darken-1 font-weight-bold'"
              >
                {{ dept.status }}
              </v-chip>
            </td>

            <td class="text-right" style="min-width: 100px;">
              <v-tooltip text="Edit Department" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-pencil-outline"
                    variant="text"
                    size="small"
                    color="primary"
                    class="mr-1"
                    @click="openEditModal(dept)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Department" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-trash-can-outline"
                    variant="text"
                    size="small"
                    color="error"
                    @click="deleteDepartment(dept.id)"
                  />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="showModal" max-width="500px" persistent>
      <v-card class="rounded-lg">
        <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
          <span class="text-h6 font-weight-bold">{{ isEditing ? 'Edit Department' : 'Add Department' }}</span>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="closeModal"></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveDepartment">
            <div class="mb-4">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Department Name</div>
              <v-text-field 
                v-model="form.name" 
                placeholder="e.g. Research & Development" 
                variant="outlined" 
                density="compact" 
                hide-details="auto"
                required
              ></v-text-field>
            </div>

            <div class="mb-4">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Department Manager</div>
              <v-select 
                v-model="form.manager" 
                :items="managers"
                placeholder="Select Manager" 
                variant="outlined" 
                density="compact" 
                hide-details
              ></v-select>
            </div>

            <div class="mb-2">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Status</div>
              <v-select 
                v-model="form.status" 
                :items="['Active', 'Inactive']"
                variant="outlined" 
                density="compact" 
                hide-details
              ></v-select>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t pt-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-medium mr-2" @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" :disabled="!form.name.trim()" @click="saveDepartment">
            {{ isEditing ? 'Save Changes' : 'Create Department' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>