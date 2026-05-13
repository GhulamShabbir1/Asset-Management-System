<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  itemName?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const close = () => {
  // Prevent closing if an API call is currently running
  if (!props.isLoading) {
    dialog.value = false
  }
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card class="rounded-lg text-center pa-4">
      <v-card-text class="pt-4">
        <v-icon icon="mdi-alert-circle-outline" color="error" size="64" class="mb-4"></v-icon>
        
        <div class="text-h6 font-weight-bold mb-2">{{ title || 'Confirm Deletion' }}</div>
        
        <div class="text-body-2 text-medium-emphasis">
          Are you sure you want to delete 
          <strong v-if="itemName" class="text-black">"{{ itemName }}"</strong>
          <span v-else>this item</span>? 
          <br>This action cannot be undone.
        </div>
      </v-card-text>

      <v-card-actions class="justify-center pb-4">
        <v-btn 
          color="grey-darken-1" 
          variant="text" 
          class="text-none font-weight-medium px-4" 
          :disabled="isLoading" 
          @click="close"
        >
          Cancel
        </v-btn>
        
        <v-btn 
          color="error" 
          variant="flat" 
          class="text-none font-weight-medium px-6 rounded-md" 
          :loading="isLoading" 
          @click="confirm"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>