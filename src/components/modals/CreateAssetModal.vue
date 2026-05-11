<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import categoryService from '@/services/categoryService'

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
  asset_name: '',
  asset_code: '',
  category_id: null as number | null,
  brand: '',
  total_quantity: 1, // Fixed to 1
  purchase_date: '',
  status: 'available',
  department_id: null as number | null,
  asset_image: null as File | null,
  invoice_image: null as File | null
})

const form = ref(getInitialFormState())

// Dynamic Categories
const categories = ref<{ title: string, value: string | number }[]>([])
const isLoadingCategories = ref(false)

// API Statuses mapping
const statuses = [
  { title: 'Available', value: 'available' },
  { title: 'Assigned', value: 'assigned' },
  { title: 'Maintenance', value: 'maintenance' },
  { title: 'Inactive', value: 'inactive' }
]
// Mock departments for now (update to API later)
const departments = [{ title: 'IT', value: 1 }, { title: 'HR', value: 2 }]

const fetchCategories = async () => {
  isLoadingCategories.value = true
  try {
    const response = await categoryService.getAllCategories()
    if (response.success && response.data && response.data.data) {
      categories.value = response.data.data.map(cat => ({
        title: cat.name,
        value: cat.id
      }))
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoadingCategories.value = false
  }
}

watch(dialog, (isOpen) => {
  if (isOpen) {
    fetchCategories()
  }
})

const resetForm = () => {
  form.value = getInitialFormState()
}

const close = () => {
  dialog.value = false
  // Wait for the modal closing animation to finish before clearing the data
  setTimeout(() => {
    resetForm()
  }, 300)
}

const save = () => {
  // Vuetify v-file-input stores files in an array, so we extract the first file
  const payload = {
    ...form.value,
    asset_image: Array.isArray(form.value.asset_image) ? form.value.asset_image[0] : form.value.asset_image,
    invoice_image: Array.isArray(form.value.invoice_image) ? form.value.invoice_image[0] : form.value.invoice_image,
  }
  emit('submit', payload)
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="650px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">Add New Asset</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          
          <div class="mb-6">
            <div class="text-subtitle-2 font-weight-bold text-black mb-3">Media & Documentation</div>
            <v-row dense>
              <v-col cols="12" sm="6" class="pb-2">
                <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Asset Picture</div>
                <v-file-input
                  v-model="form.asset_image"
                  placeholder="Upload image"
                  variant="outlined"
                  density="compact"
                  accept="image/*"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera-plus-outline"
                  show-size
                  hide-details
                  class="bg-grey-lighten-4 rounded-md"
                ></v-file-input>
              </v-col>
              
              <v-col cols="12" sm="6" class="pb-2">
                <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Purchase Receipt / Invoice</div>
                <v-file-input
                  v-model="form.invoice_image"
                  placeholder="Upload receipt (PDF/Img)"
                  variant="outlined"
                  density="compact"
                  accept="image/*,.pdf"
                  prepend-icon=""
                  prepend-inner-icon="mdi-receipt-text-outline"
                  show-size
                  hide-details
                  class="bg-grey-lighten-4 rounded-md"
                ></v-file-input>
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-6"></v-divider>

          <div class="text-subtitle-2 font-weight-bold text-black mb-3">Asset Details</div>
          <v-row dense>
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Asset Name</div>
              <v-text-field v-model="form.asset_name" placeholder="e.g. MacBook Pro 16" variant="outlined" density="compact" hide-details required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Asset Code (Tag)</div>
              <v-text-field v-model="form.asset_code" placeholder="e.g. AST-001" variant="outlined" density="compact" hide-details required></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Category</div>
              <v-select 
                v-model="form.category_id" 
                :items="categories" 
                placeholder="Select category" 
                variant="outlined" 
                density="compact" 
                hide-details
              >
                <template v-slot:append-inner>
                  <v-progress-circular 
                    v-if="isLoadingCategories" 
                    indeterminate 
                    color="primary" 
                    size="20" 
                    width="2"
                    class="ml-2"
                  ></v-progress-circular>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Brand</div>
              <v-text-field v-model="form.brand" placeholder="e.g. Apple, Dell" variant="outlined" density="compact" hide-details></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Total Quantity</div>
              <v-text-field v-model.number="form.total_quantity" type="number" variant="outlined" density="compact" hide-details="auto" readonly bg-color="grey-lighten-4"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Purchase Date</div>
              <v-text-field v-model="form.purchase_date" type="date" variant="outlined" density="compact" hide-details></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Status</div>
              <v-select v-model="form.status" :items="statuses" placeholder="Current status" variant="outlined" density="compact" hide-details></v-select>
            </v-col>
            <v-col cols="12" sm="6" class="pb-3">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Department</div>
              <v-select v-model="form.department_id" :items="departments" placeholder="Assign to department" variant="outlined" density="compact" hide-details></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t pt-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-medium mr-2" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" :disabled="!form.asset_name || !form.category_id || !form.department_id" @click="save">Save Asset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>