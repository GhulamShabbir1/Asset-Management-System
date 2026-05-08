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
  asset_id: null,
  employee_id: null,
  assignment_date: '',
  return_date: ''
})

const availableAssets = [
  { title: 'AST-99201 - MacBook Pro 16"', value: 1 },
  { title: 'AST-88124 - Dell UltraSharp 32"', value: 2 },
  { title: 'AST-77103 - iPhone 15 Pro Max', value: 3 }
]

const employees = [
  { title: 'Sarah Henderson', value: 1 },
  { title: 'Marcus Knight', value: 2 },
  { title: 'Elena Zhao', value: 3 }
]

const close = () => { dialog.value = false }
const save = () => {
  emit('submit', form.value)
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card class="rounded-lg">
      
      <v-card-title class="pa-4 d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold text-black">New Asset Assignment</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6 pt-2">
        <v-form @submit.prevent="save">
          <v-row dense>
            <v-col cols="12" sm="6" class="pb-4">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Select Asset</div>
              <v-autocomplete 
                v-model="form.asset_id" 
                :items="availableAssets" 
                placeholder="Select by ID or Name" 
                variant="outlined" 
                density="compact" 
                hide-details
                append-inner-icon="mdi-magnify"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6" class="pb-4">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Assign To Employee</div>
              <v-autocomplete 
                v-model="form.employee_id" 
                :items="employees" 
                placeholder="Search employee direct" 
                variant="outlined" 
                density="compact" 
                hide-details
                append-inner-icon="mdi-account-search-outline"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Assignment Date</div>
              <v-text-field 
                v-model="form.assignment_date" 
                type="date" 
                variant="outlined" 
                density="compact" 
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Expected Return Date</div>
              <v-text-field 
                v-model="form.return_date" 
                type="date" 
                variant="outlined" 
                density="compact" 
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-medium mr-2" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" @click="save">Confirm Assignment</v-btn>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>