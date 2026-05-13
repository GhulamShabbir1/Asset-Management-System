<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import assetService from '@/services/assetService'
import employeeService from '@/services/employeeService'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const getInitialFormState = () => ({
  asset_id: null as number | null,
  employee_id: null as number | null,
  quantity: 1, // Quantity is fixed to 1
  description: ''
})

const form = ref(getInitialFormState())

// Data for dropdowns
const availableAssets = ref<{ title: string, value: number }[]>([])
const isLoadingAssets = ref(false)

const employees = ref<{ title: string, value: number | string }[]>([])
const isLoadingEmployees = ref(false)

// Fetch Assets
const fetchAvailableAssets = async () => {
  isLoadingAssets.value = true
  try {
    // Fetch 'available' status assets. Adjust per_page to ensure you get a full list for the dropdown.
    const response = await assetService.getAssets({ status: 'available', per_page: 500 })
    if (response && response.data) {
      const resData = response.data as any
      const assetList = Array.isArray(resData) ? resData : (resData.data || resData.list || [])
      
      availableAssets.value = assetList.map((asset: any) => ({
        title: `${asset.assetCode || asset.asset_code} - ${asset.assetName || asset.asset_name}`,
        value: asset.id
      }))
    }
  } catch (error) {
    console.error('Failed to fetch assets for assignment:', error)
  } finally {
    isLoadingAssets.value = false
  }
}

// Fetch Employees
const fetchEmployeesList = async () => {
  isLoadingEmployees.value = true
  try {
    const response = await employeeService.getEmployees({ per_page: 500 })
    if (response && response.data) {
      const resData = response.data as any
      const empList = Array.isArray(resData) ? resData : (resData.data || resData.list || [])
      
      employees.value = empList.map((emp: any) => {
        const empId = emp.employee_id || emp.id || emp.emp_id
        const deptName = emp.department?.department_name || emp.department?.name || emp.department || 'N/A'
        
        return {
          title: `${emp.name} (${deptName})`,
          value: empId
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch employees for assignment:', error)
  } finally {
    isLoadingEmployees.value = false
  }
}

// Fetch both lists every time modal opens
watch(dialog, (isOpen) => {
  if (isOpen) {
    fetchAvailableAssets()
    fetchEmployeesList()
  }
})

const resetForm = () => {
  form.value = getInitialFormState()
}

const close = () => {
  dialog.value = false
  setTimeout(() => { resetForm() }, 300)
}

const save = () => {
  emit('submit', form.value)
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">Assign Asset</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          
          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Select Asset</div>
            <v-autocomplete 
              v-model="form.asset_id" 
              :items="availableAssets" 
              item-title="title"
              item-value="value"
              :loading="isLoadingAssets"
              placeholder="Search available assets" 
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              required
            >
              <template v-slot:append-inner>
                <v-progress-circular v-if="isLoadingAssets" indeterminate color="primary" size="20" width="2" class="ml-2"></v-progress-circular>
                <v-icon v-else>mdi-magnify</v-icon>
              </template>
            </v-autocomplete>
          </div>

          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Assign To Employee</div>
            <v-autocomplete 
              v-model="form.employee_id" 
              :items="employees" 
              item-title="title"
              item-value="value"
              :loading="isLoadingEmployees"
              placeholder="Select employee" 
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              required
            >
              <template v-slot:append-inner>
                <v-progress-circular v-if="isLoadingEmployees" indeterminate color="primary" size="20" width="2" class="ml-2"></v-progress-circular>
                <v-icon v-else>mdi-account-search-outline</v-icon>
              </template>
            </v-autocomplete>
          </div>

          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Quantity</div>
            <v-text-field 
              v-model.number="form.quantity" 
              type="number" 
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              readonly
              bg-color="grey-lighten-4"
              required
            ></v-text-field>
          </div>

          <div class="mt-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Description / Notes</div>
            <v-textarea 
              v-model="form.description" 
              placeholder="e.g. Brand new laptop assigned for development..." 
              variant="outlined" 
              density="compact" 
              rows="3" 
              hide-details="auto"
              required
            ></v-textarea>
          </div>

        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t pt-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-medium mr-2" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" :disabled="!form.asset_id || !form.employee_id || !form.description" @click="save">Checkout Asset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>