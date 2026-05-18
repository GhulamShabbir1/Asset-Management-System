<template>
  <v-dialog v-model="showDialog" max-width="500px" rounded="lg">
    <v-card rounded="lg" elevation="0" border>
      <v-card-title class="pa-4 pb-2 d-flex justify-space-between align-center">
        <div class="text-body-1 font-weight-bold">Add User to Directory</div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="showDialog = false"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4 pt-0">
        <p class="text-caption text-medium-emphasis mb-4">
          Search for a registered user and assign them a system role.
        </p>

        <!-- User Search -->
        <v-autocomplete
          v-model="selectedUser"
          :items="allUsers"
          :loading="loadingUsers"
          item-title="displayName"
          item-value="id"
          label="Select User"
          placeholder="Start typing to search..."
          prepend-inner-icon="mdi-account-search"
          variant="outlined"
          density="compact"
          color="primary"
          class="mb-4 compact-autocomplete"
          return-object
        >
        </v-autocomplete>

        <!-- Role Selection -->
        <v-select
          v-model="selectedRoleId"
          :items="roleOptions"
          label="Assign Role"
          prepend-inner-icon="mdi-shield-account"
          variant="outlined"
          density="compact"
          color="primary"
          class="mb-2"
        ></v-select>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2 text-caption">
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="showDialog = false" class="text-none">Cancel</v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          :loading="isSubmitting" 
          :disabled="!selectedUser || !selectedRoleId"
          @click="handleAssign"
          class="text-none px-6"
        >
          Assign Role
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import authService from '@/services/authService'
import userRoleService from '@/services/userRoleService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  roles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'user-added'])

const allUsers = ref([])
const showDialog = ref(false)
const loadingUsers = ref(false)
const selectedUser = ref(null)
const selectedRoleId = ref(null)
const isSubmitting = ref(false)
const error = ref(null)

// Sync local state with prop
watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal
}, { immediate: true })

async function fetchUsersLocal() {
  loadingUsers.value = true
  error.value = null
  try {
    const res = await authService.readUsers()
    console.log('Modal Local Fetch Response:', res)
    let data = []
    if (res?.data?.users) data = res.data.users
    else if (res?.users) data = res.users
    else if (Array.isArray(res?.data)) data = res.data
    else if (Array.isArray(res)) data = res
    
    allUsers.value = data.map(u => ({
      id: u.id,
      name: u.name || u.email,
      email: u.email,
      displayName: u.name ? `${u.name} (${u.email})` : u.email,
      avatar: u.profile_picture || u.avatar || null
    }))
    console.log('Modal local users loaded:', allUsers.value.length)
  } catch (err) {
    error.value = 'Failed to load users'
  } finally {
    loadingUsers.value = false
  }
}

// Sync prop with local state
watch(showDialog, async (newVal) => {
  emit('update:modelValue', newVal)
  if (newVal) {
    await fetchUsersLocal()
  }
})

const roleOptions = computed(() => {
  const systemRoles = [
    { title: 'Super Admin', value: 'system-super-admin' },
    { title: 'Manager', value: 'system-manager' }
  ]
  const custom = props.roles.map(r => ({ title: r.name, value: r.id }))
  return [...systemRoles, ...custom]
})

async function handleAssign() {
  if (!selectedUser.value || !selectedRoleId.value) return

  isSubmitting.value = true
  error.value = null
  try {
    await userRoleService.assignRole({
      user_id: selectedUser.value.id,
      role_id: selectedRoleId.value
    })
    
    // Refresh the list in the parent
    emit('user-added')
    
    showDialog.value = false
    resetForm()
  } catch (err) {
    error.value = err.message || 'Failed to assign role'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  selectedUser.value = null
  selectedRoleId.value = null
  error.value = null
}
</script>

<style scoped>
.compact-autocomplete :deep(.v-field__input) {
  font-size: 0.8rem;
}
</style>
