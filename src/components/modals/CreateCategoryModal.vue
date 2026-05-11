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
  name: '',
  description: '',
  status: true // Matches the API boolean requirement
})

const close = () => { dialog.value = false }
const save = () => {
  emit('submit', form.value)
  // Reset form after submit
  form.value = { name: '', description: '', status: true }
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">Add New Category</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="save">
          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Category Name</div>
            <v-text-field 
              v-model="form.name" 
              placeholder="e.g. Mobile Devices" 
              variant="outlined" 
              density="compact" 
              hide-details="auto"
              required
            ></v-text-field>
          </div>

          <div class="mb-4">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Description</div>
            <v-textarea 
              v-model="form.description" 
              placeholder="Optional description of the category..." 
              variant="outlined" 
              density="compact" 
              rows="3" 
              hide-details
            ></v-textarea>
          </div>

          <div class="mb-2">
            <div class="text-uppercase text-grey-darken-1 font-weight-bold mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Status</div>
            <v-select
              v-model="form.status"
              :items="[
                { title: 'Active', value: true },
                { title: 'Inactive', value: false }
              ]"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t pt-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-medium mr-2" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6 rounded-md" :disabled="!form.name.trim()" @click="save">Save Category</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>