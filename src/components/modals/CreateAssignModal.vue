<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import assetService from '@/services/assetService'

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
  quantity: 1,
  description: ''
})

const form = ref(getInitialFormState())

// Data for dropdowns
const availableAssets = ref<{ title: string, value: number }[]>([])
const isLoadingAssets = ref(false)

// Mock employees (replace with actual employee fetch when ready)
const employees = [
  { title: 'Sarah Henderson (Engineering)', value: 1 },
  { title: 'Marcus Knight (Design)', value: 2 }
]

const fetchAvailableAssets = async () => {
  isLoadingAssets.value = true
  try {
    // Fetch only 'available' status assets
    const response = await assetService.getAssets({ status: 'available', per_page: 100 })
    if (response.success && response.data && response.data.list) {
      availableAssets.value = response.data.list.map((asset: any) => ({
        title: `${asset.assetCode} - ${asset.assetName} (Stock: ${asset.remainingQuantity})`,
        value: asset.id
      }))
    }
  } catch (error) {
    console.error('Failed to fetch assets for assignment:', error)
  } finally {
    isLoadingAssets.value = false
  }
}

// Fetch assets every time modal opens
watch(dialog, (isOpen) => {
  if (isOpen) {
    fetchAvailableAssets()
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

// Prevent invalid chars in quantity field
const preventInvalidChars = (e: KeyboardEvent) => {
  if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
    e.preventDefault()
  }
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
              placeholder="Select employee" 
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              append-inner-icon="mdi-account-search-outline"
              required
            ></v-autocomplete>
          </div>

          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Quantity</div>
            <v-text-field 
              v-model.number="form.quantity" 
              type="number" 
              min="1"
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              :rules="[v => v >= 1 || 'Must assign at least 1']"
              @keydown="preventInvalidChars"
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
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" :disabled="!form.asset_id || !form.employee_id || !form.description || form.quantity < 1" @click="save">Checkout Asset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>