<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: any]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = ref({
  asset_name: '',
  asset_code: '',
  category_id: null,
  brand: '',
  total_quantity: 1,
  purchase_date: '',
  status: 'Available',
  department_id: null
})

// Mock data for your foreign keys/selects (replace with API calls later)
const statuses = ['Available', 'In Use', 'Maintenance', 'Retired']
const categories = [{ title: 'Laptops', value: 1 }, { title: 'Monitors', value: 2 }]
const departments = [{ title: 'Engineering', value: 1 }, { title: 'HR', value: 2 }]

const close = () => { dialog.value = false }
const save = () => {
  emit('submit', form.value)
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">Add New Asset</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form @submit.prevent="save">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.asset_name" label="Asset Name" variant="outlined" density="compact" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.asset_code" label="Asset Code (Tag)" variant="outlined" density="compact" required></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-select v-model="form.category_id" :items="categories" label="Category" variant="outlined" density="compact"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.brand" label="Brand" variant="outlined" density="compact"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.total_quantity" type="number" label="Total Quantity" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.purchase_date" type="date" label="Purchase Date" variant="outlined" density="compact"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select v-model="form.status" :items="statuses" label="Status" variant="outlined" density="compact"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.department_id" :items="departments" label="Department" variant="outlined" density="compact"></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none px-6" @click="save">Save Asset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>