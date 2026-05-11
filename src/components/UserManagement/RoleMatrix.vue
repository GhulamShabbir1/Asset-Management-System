<template>
  <v-row class="mb-3">
    <v-col cols="12">
      <v-card rounded="xl" elevation="0" border>
        <div class="d-flex justify-space-between align-center pa-4 pb-2 border-b bg-grey-lighten-4 flex-wrap gap-4">
          <div>
            <h3 class="text-body-1 font-weight-bold">Role Permissions Matrix</h3>
            <p class="text-caption text-medium-emphasis">Select a role from the left and update its permissions.</p>
          </div>
          <div class="d-flex gap-3 align-center flex-wrap">
            <v-btn variant="outlined" prepend-icon="mdi-pencil" rounded="lg" @click="openRoleDialog(selectedRoleForMatrix)" :disabled="selectedRoleIsSystem">
              Edit Role
            </v-btn>
            <v-btn v-if="!selectedRoleIsSystem" color="error" variant="text" prepend-icon="mdi-delete" @click="deleteCustomRole">
              Delete Role
            </v-btn>
          </div>
        </div>

        <v-row class="ma-0">
          <v-col cols="12" md="4" lg="3" class="pa-4 border-e role-panel">
            <div class="d-flex justify-space-between align-center mb-3">
              <div>
                <div class="dashboard-kicker text-medium-emphasis">Roles</div>
                <div class="text-caption text-medium-emphasis">Click any role to manage access</div>
              </div>
              <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-plus" rounded="lg" @click="openRoleDialog()">
                Add Role
              </v-btn>
            </div>

            <div class="d-flex flex-column gap-2">
              <button
                v-for="role in roleOptions" :key="role.id"
                type="button"
                class="role-list-item text-left"
                :class="{ active: selectedRoleForMatrix === role.id }"
                @click="selectRole(role.id)"
              >
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="font-weight-bold text-body-1">{{ role.name }}</div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      {{ getEnabledPermissionCount(role.id) }} / {{ basePermissionModules.length * crudActions.length }} enabled
                    </div>
                  </div>
                  <v-icon :icon="role.isSystem ? 'mdi-shield-account' : 'mdi-account-cog'" size="20"></v-icon>
                </div>
              </button>
            </div>
          </v-col>

          <v-col cols="12" md="8" lg="9" class="pa-0">
            <div class="pa-4 pb-2 d-flex justify-space-between align-center flex-wrap gap-3">
              <div>
                <h4 class="text-body-1 font-weight-bold mb-1">{{ selectedRoleName }}</h4>
                <p class="text-caption text-medium-emphasis">
                  {{ enabledPermissionsCount }} of {{ currentRolePermissions.length * crudActions.length }} permissions enabled
                </p>
              </div>
              <v-chip color="primary" variant="tonal" size="x-small">
                {{ selectedRoleIsSystem ? 'System Role' : 'Custom Role' }}
              </v-chip>
            </div>

            <v-table hover density="compact" class="bg-surface px-2 mt-1">
              <thead class="bg-grey-lighten-4">
                <tr>
                  <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">PERMISSION</th>
                  <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">DESCRIPTION</th>
                  <th class="text-center font-weight-bold text-medium-emphasis" style="width: 90px; font-size: 10px; text-transform: uppercase;">ALL</th>
                  <th v-for="action in crudActions" :key="action.key" class="text-center font-weight-bold text-medium-emphasis" style="width: 90px; font-size: 10px; text-transform: uppercase;">
                    {{ action.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="perm in currentRolePermissions" :key="perm.key">
                  <td class="font-weight-medium py-3">
                    <div class="d-flex align-center">
                      <v-icon :icon="perm.icon" size="20" class="mr-3 text-medium-emphasis"></v-icon>
                      <span class="text-caption font-weight-bold">{{ perm.module }}</span>
                    </div>
                  </td>
                  <td class="py-3 text-caption text-medium-emphasis">{{ perm.description }}</td>
                  <td class="text-center py-3">
                    <v-checkbox
                      :model-value="isAllChecked(perm.actions)"
                      @update:model-value="toggleAllActions(perm.actions, $event)"
                      color="primary" hide-details density="comfortable" class="permission-checkbox justify-center"
                    ></v-checkbox>
                  </td>
                  <td v-for="action in crudActions" :key="`${perm.key}-${action.key}`" class="text-center py-3">
                    <v-checkbox
                      v-model="perm.actions[action.key]"
                      color="primary" hide-details density="comfortable" class="permission-checkbox justify-center"
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div class="pa-4 d-flex justify-space-between align-center border-t bg-grey-lighten-4 flex-wrap gap-3">
              <div class="text-caption text-medium-emphasis">
                Checked permissions will be available to users assigned to this role.
              </div>
              <v-btn color="primary" variant="flat" prepend-icon="mdi-content-save" @click="saveRolePermissions">
                Save Permission Changes
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog v-model="roleDialog" max-width="500px" rounded="xl">
      <v-card rounded="xl" elevation="0" border>
        <v-card-title class="text-body-1 font-weight-bold pa-4 pb-2">
          {{ editingRoleId ? 'Edit Custom Role' : 'Create New Custom Role' }}
        </v-card-title>
        <v-card-text class="pa-4 pt-2">
          <v-text-field v-model="newRoleName" label="Role Name" variant="outlined" density="comfortable" placeholder="e.g., Security Analyst" :error-messages="roleNameError" @input="validateRoleName"></v-text-field>
          <v-textarea v-model="newRoleDescription" label="Role Description" variant="outlined" density="comfortable" rows="2"></v-textarea>
          <v-alert v-if="selectedRoleForMatrix === 'system-super-admin' || selectedRoleForMatrix === 'system-manager'" type="info" variant="tonal" class="mt-2">
            System roles cannot be modified. Create a custom role to define specific permissions.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 gap-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeRoleDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveCustomRole" :disabled="!newRoleName.trim()">
            {{ editingRoleId ? 'Update Role' : 'Create Role' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

const crudActions = inject('crudActions')
const basePermissionModules = inject('basePermissionModules')
const rolePermissionsStore = inject('rolePermissionsStore')
const customRoles = inject('customRoles')
const usersList = inject('usersList')

const selectedRoleForMatrix = ref('system-super-admin')
const roleDialog = ref(false)
const editingRoleId = ref(null)
const newRoleName = ref('')
const newRoleDescription = ref('')
const roleNameError = ref('')

const currentRolePermissions = ref([...rolePermissionsStore.value['system-super-admin']])

const roleOptions = computed(() => [
  { id: 'system-super-admin', name: 'Super Admin (System)', isSystem: true },
  { id: 'system-manager', name: 'Manager (System)', isSystem: true },
  ...customRoles.value.map(r => ({ id: r.id, name: `${r.name} (Custom)`, isSystem: false }))
])

const selectedRole = computed(() => roleOptions.value.find(role => role.id === selectedRoleForMatrix.value) || null)
const selectedRoleName = computed(() => selectedRole.value?.name || 'Select Role')
const selectedRoleIsSystem = computed(() => selectedRole.value?.isSystem ?? false)

const enabledPermissionsCount = computed(() => 
  currentRolePermissions.value.reduce((total, permission) => total + countEnabledActions(permission.actions), 0)
)

function countEnabledActions(actions) {
  return crudActions.reduce((total, action) => total + (actions[action.key] ? 1 : 0), 0)
}

function getEnabledPermissionCount(roleId) {
  const permissions = rolePermissionsStore.value[roleId] || []
  return permissions.reduce((total, permission) => total + countEnabledActions(permission.actions), 0)
}

function loadRolePermissions() {
  if (rolePermissionsStore.value[selectedRoleForMatrix.value]) {
    currentRolePermissions.value = JSON.parse(JSON.stringify(rolePermissionsStore.value[selectedRoleForMatrix.value]))
  }
}

function selectRole(roleId) {
  selectedRoleForMatrix.value = roleId
  loadRolePermissions()
}

function isAllChecked(actions) {
  return crudActions.every(action => !!actions[action.key])
}

function toggleAllActions(actions, value) {
  crudActions.forEach(action => { actions[action.key] = !!value })
}

function saveRolePermissions() {
  rolePermissionsStore.value[selectedRoleForMatrix.value] = JSON.parse(JSON.stringify(currentRolePermissions.value))
  
  usersList.value.forEach(user => {
    if (user.roleId === selectedRoleForMatrix.value) {
      const enabledCount = currentRolePermissions.value.reduce((total, permission) => total + countEnabledActions(permission.actions), 0)
      user.roleDesc = `${enabledCount} CRUD permissions enabled`
    }
  })
  alert(`Permissions saved for ${selectedRoleName.value}`)
}

function openRoleDialog(roleId = null) {
  editingRoleId.value = roleId
  if (roleId) {
    const role = customRoles.value.find(r => r.id === roleId)
    if (role) {
      newRoleName.value = role.name
      newRoleDescription.value = role.description
    }
  } else {
    newRoleName.value = ''
    newRoleDescription.value = ''
  }
  roleNameError.value = ''
  roleDialog.value = true
}

function validateRoleName() {
  if (!newRoleName.value.trim()) {
    roleNameError.value = 'Role name is required'
  } else if (customRoles.value.some(r => r.name.toLowerCase() === newRoleName.value.trim().toLowerCase() && r.id !== editingRoleId.value)) {
    roleNameError.value = 'A role with this name already exists'
  } else {
    roleNameError.value = ''
  }
}

function saveCustomRole() {
  if (roleNameError.value || !newRoleName.value.trim()) return
  const roleId = `custom-${newRoleName.value.trim().toLowerCase().replace(/\s+/g, '-')}`
  
  if (editingRoleId.value) {
    const roleIndex = customRoles.value.findIndex(r => r.id === editingRoleId.value)
    if (roleIndex !== -1) {
      customRoles.value[roleIndex].name = newRoleName.value.trim()
      customRoles.value[roleIndex].description = newRoleDescription.value.trim()
    }
  } else {
    customRoles.value.push({ id: roleId, name: newRoleName.value.trim(), description: newRoleDescription.value.trim() })
    rolePermissionsStore.value[roleId] = JSON.parse(JSON.stringify(rolePermissionsStore.value['system-manager']))
  }
  closeRoleDialog()
  selectedRoleForMatrix.value = editingRoleId.value || roleId
  loadRolePermissions()
}

function deleteCustomRole() {
  if (confirm('Are you sure you want to delete this custom role?')) {
    const roleId = selectedRoleForMatrix.value
    const roleIndex = customRoles.value.findIndex(r => r.id === roleId)
    if (roleIndex !== -1) {
      customRoles.value.splice(roleIndex, 1)
      delete rolePermissionsStore.value[roleId]
      
      usersList.value.forEach(user => {
        if (user.roleId === roleId) {
          user.roleId = 'system-manager'
          user.role = 'system-manager'
          user.roleColor = 'grey-darken-3'
          user.roleDesc = 'Restricted Access'
        }
      })
      selectedRoleForMatrix.value = 'system-super-admin'
      loadRolePermissions()
    }
  }
}

function closeRoleDialog() {
  roleDialog.value = false
  editingRoleId.value = null
  newRoleName.value = ''
  newRoleDescription.value = ''
}

onMounted(() => loadRolePermissions())
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.border-e { border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.dashboard-kicker { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.role-panel { background: rgba(var(--v-theme-surface-variant), 0.18); }
.role-list-item { width: 100%; border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 18px; padding: 16px; background: rgb(var(--v-theme-surface)); transition: all 0.2s ease; }
.role-list-item:hover { border-color: rgba(var(--v-theme-primary), 0.45); transform: translateY(-1px); }
.role-list-item.active { background: rgba(var(--v-theme-primary), 0.08); border-color: rgb(var(--v-theme-primary)); }
.permission-checkbox :deep(.v-selection-control) { justify-content: center; }
</style>