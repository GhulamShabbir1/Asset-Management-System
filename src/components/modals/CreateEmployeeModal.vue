<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getAllDepartments } from '@/services/departmentService'
import type { CreateEmployeePayload } from '@/services/employeeService'
import type { Department } from '@/services/departmentService'

const props = defineProps<{ 
  modelValue: boolean
  editingEmployee?: CreateEmployeePayload & { id?: number | string }
}>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: CreateEmployeePayload]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Form state
const form = ref<CreateEmployeePayload>({
  name: '',
  father_name: '',
  contact_info: '',
  email: '',
  address: '',
  designation: '',
  joining_date: '',
  salary: undefined,
  status: 'active',
  department_id: 0
})

// UI state
const departments = ref<Department[]>([])
const isLoading = ref(false)
const departmentsLoading = ref(false)
const errorMessage = ref('')

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.name.trim().length > 0 &&
    form.value.contact_info.trim().length > 0 &&
    form.value.email?.trim().length > 0 &&
    form.value.department_id > 0
  )
})

// Get title based on mode (create or edit)
const dialogTitle = computed(() => {
  return props.editingEmployee?.id ? 'Edit Employee' : 'Add New Employee'
})

// Fetch departments on component mount
onMounted(async () => {
  await fetchDepartments()
})

// Watch for editing employee changes
watch(() => props.editingEmployee, (newEmployee) => {
  if (newEmployee) {
    form.value = {
      name: newEmployee.name || '',
      father_name: newEmployee.father_name || '',
      contact_info: newEmployee.contact_info || '',
      email: newEmployee.email || '',
      address: newEmployee.address || '',
      designation: newEmployee.designation || '',
      joining_date: newEmployee.joining_date || '',
      salary: newEmployee.salary,
      status: newEmployee.status || 'active',
      department_id: newEmployee.department_id || 0
    }
  } else {
    resetForm()
  }
})

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    departmentsLoading.value = true
    const response = await getAllDepartments()
    if (response?.data) {
      departments.value = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch departments:', error)
    errorMessage.value = 'Failed to load departments'
  } finally {
    departmentsLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    father_name: '',
    contact_info: '',
    email: '',
    address: '',
    designation: '',
    joining_date: '',
    salary: undefined,
    status: 'active',
    department_id: 0
  }
  errorMessage.value = ''
}

const close = () => {
  resetForm()
  dialog.value = false
}

const save = async () => {
  if (!isFormValid.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email || '')) {
      errorMessage.value = 'Please enter a valid email address'
      return
    }

    // Validate joining date if provided
    if (form.value.joining_date && new Date(form.value.joining_date) > new Date()) {
      errorMessage.value = 'Joining date cannot be in the future'
      return
    }

    emit('submit', form.value)
    close()
  } catch (error) {
    console.error('Error saving employee:', error)
    errorMessage.value = 'Failed to save employee'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent @keydown.esc="close">
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">{{ dialogTitle }}</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <!-- Error message -->
        <v-alert 
          v-if="errorMessage" 
          type="error" 
          variant="tonal" 
          class="mb-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Form -->
        <v-form @submit.prevent="save">
          <!-- Row 1: Name and Father Name -->
          <div class="d-flex ga-2 mb-2">
            <v-text-field 
              v-model="form.name" 
              label="Full Name *" 
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
              required
            />
            <v-text-field 
              v-model="form.father_name" 
              label="Father Name" 
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
            />
          </div>

          <!-- Row 2: Email and Contact -->
          <div class="d-flex ga-2 mb-2">
            <v-text-field 
              v-model="form.email" 
              label="Email *" 
              type="email"
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
              required
            />
            <v-text-field 
              v-model="form.contact_info" 
              label="Contact Info (Phone/Mobile) *" 
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
              required
            />
          </div>

          <!-- Row 3: Address -->
          <v-text-field 
            v-model="form.address" 
            label="Address" 
            variant="outlined" 
            density="compact"
            class="mb-2"
          />

          <!-- Row 4: Designation and Salary -->
          <div class="d-flex ga-2 mb-2">
            <v-text-field 
              v-model="form.designation" 
              label="Designation" 
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
            />
            <v-text-field 
              v-model.number="form.salary" 
              label="Salary" 
              type="number"
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
            />
          </div>

          <!-- Row 5: Joining Date and Status -->
          <div class="d-flex ga-2 mb-2">
            <v-text-field 
              v-model="form.joining_date" 
              label="Joining Date" 
              type="date"
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
            />
            <v-select 
              v-model="form.status" 
              :items="['active', 'inactive', 'on_leave']"
              label="Status" 
              variant="outlined" 
              density="compact"
              class="flex-grow-1"
            />
          </div>

          <!-- Row 6: Department -->
          <v-select 
            v-model="form.department_id" 
            :items="departments"
            item-title="department_name"
            item-value="id"
            label="Department *" 
            variant="outlined" 
            density="compact"
            :loading="departmentsLoading"
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-none px-6"
          :disabled="!isFormValid || isLoading"
          :loading="isLoading"
          @click="save"
        >
          {{ isLoading ? 'Saving...' : (editingEmployee?.id ? 'Update Employee' : 'Save Employee') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>