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
  email: '',
  password: '',
  role: 'Viewer'
})

const roles = ['System Administrator', 'IT Manager', 'Viewer']

const close = () => { dialog.value = false }
const save = () => {
  emit('submit', form.value)
  close()
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="450px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b">
        <span class="text-h6 font-weight-bold">Create System User</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form @submit.prevent="save">
          <v-text-field v-model="form.name" label="Display Name" variant="outlined" density="compact" class="mb-2"></v-text-field>
          <v-text-field v-model="form.email" type="email" label="Email Address" variant="outlined" density="compact" class="mb-2"></v-text-field>
          <v-text-field v-model="form.password" type="password" label="Temporary Password" variant="outlined" density="compact" class="mb-2"></v-text-field>
          <v-select v-model="form.role" :items="roles" label="System Role" variant="outlined" density="compact" hide-details></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4 border-t">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" class="text-none" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none px-6" @click="save">Create User</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>