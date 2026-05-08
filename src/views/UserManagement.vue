<template>
  <v-container fluid class="bg-background py-4" max-width="1600">
    <!-- Header -->
    <v-row class="mb-6 align-center justify-space-between">
      <v-col cols="12" md="6">
        <h1 class="text-h5 font-weight-bold text-high-emphasis mb-0" style="line-height: 1.1;">Role Management</h1>
        <p class="text-caption text-medium-emphasis mt-1">
          Define custom roles and granular access permissions across your organization.
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-md-end gap-4">
        <v-btn variant="outlined" prepend-icon="mdi-lock-account" size="large" rounded="lg" @click="openRoleDialog()">
          Create Custom Role
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-account-plus" size="large" rounded="lg">
          Add New User
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in summaryStats" :key="index">
        <v-card rounded="xl" elevation="0" border class="pa-5 fill-height d-flex flex-column justify-center">
          <div class="text-overline text-medium-emphasis mb-1">{{ stat.title }}</div>
          <div class="d-flex align-end justify-space-between">
            <span class="text-h3 font-weight-bold" :class="stat.valueClass || 'text-high-emphasis'">
              {{ stat.value }}
            </span>
            <div v-if="stat.trend" class="text-body-2 font-weight-bold text-success">
              {{ stat.trend }}
            </div>
            <div v-else-if="stat.subtitle" class="text-caption font-weight-bold" :class="stat.subtitleClass">
              {{ stat.subtitle }}
            </div>
            <v-icon v-else-if="stat.icon" :icon="stat.icon" :color="stat.iconColor" size="32"></v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Roles & Permissions Matrix Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" border>
          <!-- Header -->
          <div class="d-flex justify-space-between align-center pa-6 pb-4 border-b bg-grey-lighten-4 flex-wrap gap-4">
            <div>
              <h3 class="text-body-1 font-weight-bold">Role Permissions Matrix</h3>
              <p class="text-caption text-medium-emphasis">Select a role from the left and update its permissions using checkboxes.</p>
            </div>
            <div class="d-flex gap-3 align-center flex-wrap">
              <v-btn variant="outlined" prepend-icon="mdi-pencil" rounded="lg" @click="openRoleDialog(selectedRoleForMatrix)" :disabled="selectedRoleIsSystem">
                Edit Role
              </v-btn>
              <v-btn
                v-if="!selectedRoleIsSystem"
                color="error"
                variant="text"
                prepend-icon="mdi-delete"
                @click="deleteCustomRole"
              >
                Delete Role
              </v-btn>
            </div>
          </div>

          <v-row class="ma-0">
            <!-- Roles List -->
            <v-col cols="12" md="4" lg="3" class="pa-4 border-e role-panel">
              <div class="d-flex justify-space-between align-center mb-3">
                <div>
                  <div class="text-overline text-medium-emphasis">Roles</div>
                  <div class="text-body-2 text-medium-emphasis">Click any role to manage access</div>
                </div>
                <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-plus" rounded="lg" @click="openRoleDialog()">
                  Add Role
                </v-btn>
              </div>

              <div class="d-flex flex-column gap-2">
                <button
                  v-for="role in roleOptions"
                  :key="role.id"
                  type="button"
                  class="role-list-item text-left"
                  :class="{ active: selectedRoleForMatrix === role.id }"
                  @click="selectRole(role.id)"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="font-weight-bold text-body-1">{{ role.name }}</div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        {{ getEnabledPermissionCount(role.id) }} / {{ basePermissionModules.length * crudActions.length }} permissions enabled
                      </div>
                    </div>
                    <v-icon :icon="role.isSystem ? 'mdi-shield-account' : 'mdi-account-cog'" size="20"></v-icon>
                  </div>
                </button>
              </div>
            </v-col>

            <!-- Permissions Table -->
            <v-col cols="12" md="8" lg="9" class="pa-0">
              <div class="pa-6 pb-2 d-flex justify-space-between align-center flex-wrap gap-3">
                <div>
                  <h4 class="text-body-1 font-weight-bold mb-1">{{ selectedRoleName }}</h4>
                  <p class="text-caption text-medium-emphasis">
                    {{ enabledPermissionsCount }} of {{ currentRolePermissions.length * crudActions.length }} permissions enabled
                  </p>
                </div>
                <v-chip color="primary" variant="tonal" size="small">
                  {{ selectedRoleIsSystem ? 'System Role' : 'Custom Role' }}
                </v-chip>
              </div>

              <v-table hover class="bg-surface">
                <thead class="bg-grey-lighten-4">
                  <tr>
                    <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">PERMISSION</th>
                    <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">DESCRIPTION</th>
                    <th class="text-center font-weight-bold text-medium-emphasis" style="width: 90px; font-size: 10px; text-transform: uppercase;">ALL</th>
                    <th
                      v-for="action in crudActions"
                      :key="action.key"
                      class="text-center font-weight-bold text-medium-emphasis"
                      style="width: 90px; font-size: 10px; text-transform: uppercase;"
                    >
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
                        color="primary"
                        hide-details
                        density="comfortable"
                        class="permission-checkbox justify-center"
                      ></v-checkbox>
                    </td>
                    <td v-for="action in crudActions" :key="`${perm.key}-${action.key}`" class="text-center py-3">
                      <v-checkbox
                        v-model="perm.actions[action.key]"
                        color="primary"
                        hide-details
                        density="comfortable"
                        class="permission-checkbox justify-center"
                      ></v-checkbox>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <div class="pa-4 d-flex justify-space-between align-center border-t bg-grey-lighten-4 flex-wrap gap-3">
                <div class="text-body-2 text-medium-emphasis">
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
    </v-row>

    <!-- Users List Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" border>
          <div class="pa-4 bg-grey-lighten-4 border-b d-flex justify-space-between align-center flex-wrap gap-4">
            <div class="d-flex gap-2">
              <v-btn variant="outlined" prepend-icon="mdi-filter-variant" size="small" rounded="lg">Filter</v-btn>
              <v-btn variant="outlined" prepend-icon="mdi-sort" size="small" rounded="lg">Sort</v-btn>
            </div>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search users..."
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 300px;"
              rounded="lg"
              bg-color="white"
            ></v-text-field>
          </div>

          <v-data-table
            :headers="tableHeaders"
            :items="usersList"
            :search="searchQuery"
            items-per-page="5"
            hover
          >
            <template v-slot:item.user="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar size="36" class="mr-3 border">
                  <v-img :src="item.avatar"></v-img>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-caption">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                </div>
              </div>
            </template>

            <template v-slot:item.role="{ item }">
              <div class="d-flex flex-column align-start py-2">
                <v-chip :color="item.roleColor" size="small" class="font-weight-bold text-uppercase mb-1" variant="tonal">
                  {{ getRoleDisplayName(item.role) }}
                </v-chip>
                <span class="text-caption text-medium-emphasis font-italic">{{ item.roleDesc }}</span>
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <div class="d-flex align-center">
                <v-icon 
                  :icon="item.isActive ? 'mdi-circle' : 'mdi-circle-outline'" 
                  :color="item.isActive ? 'success' : 'grey'" 
                  size="12" 
                  class="mr-2"
                ></v-icon>
                <span :class="item.isActive ? 'text-high-emphasis' : 'text-medium-emphasis font-italic'">
                  {{ item.isActive ? 'Active' : 'Deactivated' }}
                </span>
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-end flex-wrap gap-2 py-2">
                <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-tune" @click="openUserPermissionsDialog(item)">
                  Permissions
                </v-btn>
                <v-btn
                  variant="text"
                  :color="item.isActive ? 'warning' : 'success'"
                  size="small"
                  :prepend-icon="item.isActive ? 'mdi-account-off-outline' : 'mdi-account-check-outline'"
                  @click="toggleUserStatus(item)"
                >
                  {{ item.isActive ? 'Deactivate' : 'Activate' }}
                </v-btn>
                <v-btn
                  variant="text"
                  color="error"
                  size="small"
                  prepend-icon="mdi-delete-outline"
                  @click="deleteUser(item)"
                >
                  Delete
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Governance Footer -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card rounded="xl" elevation="0" border color="primary" variant="tonal" class="pa-6 fill-height d-flex align-center">
          <div class="flex-grow-1 mr-4">
            <h3 class="text-body-1 font-weight-bold text-primary mb-2">RBAC Governance Policy</h3>
            <p class="text-caption text-medium-emphasis mb-6">
              You are managing the core access control matrix. Any changes to "Super Admin" or "Custom" roles that include 'Financial Audit' privileges will trigger a mandatory secondary approval flow for ISO 27001 compliance.
            </p>
            <div class="d-flex gap-6">
              <div>
                <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">MFA Status</div>
                <div class="text-caption font-weight-bold">Enforced for Admin Roles</div>
              </div>
              <div>
                <div class="text-caption text-grey-darken-2 font-weight-bold text-uppercase mb-1">Audit Interval</div>
                <div class="text-caption font-weight-bold">Every 90 Days</div>
              </div>
            </div>
          </div>
          <v-icon icon="mdi-shield-check" size="80" class="opacity-20 d-none d-sm-block"></v-icon>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="0" border class="pa-6 fill-height d-flex flex-column justify-center text-center bg-grey-lighten-4">
          <div class="text-overline text-medium-emphasis mb-2">Security Audit</div>
          <div class="text-h5 font-weight-black mb-2">100% Compliant</div>
          <div class="text-caption text-medium-emphasis mb-4">Access control logs are synchronized with enterprise SIEM.</div>
          <v-btn variant="text" color="primary" class="font-weight-bold align-self-center">View Policy Logs</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Role Dialog -->
    <v-dialog v-model="roleDialog" max-width="500px" rounded="xl">
      <v-card rounded="xl" elevation="0" border>
        <v-card-title class="text-h6 font-weight-bold pa-5 pb-2">
          {{ editingRoleId ? 'Edit Custom Role' : 'Create New Custom Role' }}
        </v-card-title>
        <v-card-text class="pa-5 pt-2">
          <v-text-field
            v-model="newRoleName"
            label="Role Name"
            variant="outlined"
            density="comfortable"
            placeholder="e.g., Security Analyst, Compliance Officer"
            :error-messages="roleNameError"
            @input="validateRoleName"
          ></v-text-field>
          <v-textarea
            v-model="newRoleDescription"
            label="Role Description"
            variant="outlined"
            density="comfortable"
            rows="2"
            placeholder="Describe the responsibilities and access level of this role"
          ></v-textarea>
          <v-alert v-if="selectedRoleForMatrix === 'system-super-admin' || selectedRoleForMatrix === 'system-manager'" type="info" variant="tonal" class="mt-2">
            System roles cannot be modified. Create a custom role to define specific permissions.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0 gap-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeRoleDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveCustomRole" :disabled="!newRoleName.trim()">
            {{ editingRoleId ? 'Update Role' : 'Create Role' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- User Permissions Override Dialog -->
    <v-dialog v-model="userPermissionsDialog" max-width="600px" rounded="xl">
      <v-card rounded="xl" elevation="0" border>
        <v-card-title class="text-h6 font-weight-bold pa-5 pb-2">
          Override Permissions for {{ selectedUser?.name }}
        </v-card-title>
        <v-card-text class="pa-5 pt-2">
          <v-alert type="warning" variant="tonal" class="mb-4" density="compact">
            User normally inherits permissions from <strong>{{ getRoleDisplayName(selectedUser?.roleId) }}</strong> role.
            These overrides will take precedence.
          </v-alert>
          <div v-for="perm in userOverridePermissions" :key="perm.module" class="mb-3">
            <div class="pa-3 rounded-lg" :class="perm.hasOverride ? 'bg-grey-lighten-4' : 'border'">
              <div class="d-flex align-center justify-space-between gap-3 flex-wrap">
                <div class="d-flex align-center">
                  <v-icon :icon="perm.icon" size="20" class="mr-3 text-medium-emphasis"></v-icon>
                  <span class="font-weight-medium">{{ perm.module }}</span>
                </div>
                <v-checkbox
                  v-model="perm.hasOverride"
                  label="Override"
                  hide-details
                  density="compact"
                  class="mt-0 pt-0"
                ></v-checkbox>
              </div>
              <div class="d-flex align-center justify-space-between gap-3 flex-wrap mt-3">
                <div class="text-caption text-medium-emphasis">Permission actions</div>
                <div class="d-flex align-center flex-wrap gap-3">
                  <v-checkbox
                    :model-value="isAllChecked(perm.overrideActions)"
                    @update:model-value="toggleAllActions(perm.overrideActions, $event)"
                    label="All"
                    hide-details
                    density="compact"
                    :disabled="!perm.hasOverride"
                    class="mt-0 pt-0"
                  ></v-checkbox>
                  <v-checkbox
                    v-for="action in crudActions"
                    :key="`${perm.key}-override-${action.key}`"
                    v-model="perm.overrideActions[action.key]"
                    :label="action.label"
                    hide-details
                    density="compact"
                    :disabled="!perm.hasOverride"
                    class="mt-0 pt-0"
                  ></v-checkbox>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0 gap-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="userPermissionsDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveUserOverrides">Save Overrides</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// --- State ---
const searchQuery = ref('')
const selectedRoleForMatrix = ref('system-super-admin')
const roleDialog = ref(false)
const editingRoleId = ref(null)
const newRoleName = ref('')
const newRoleDescription = ref('')
const roleNameError = ref('')
const userPermissionsDialog = ref(false)
const selectedUser = ref(null)
const userOverridePermissions = ref([])
const crudActions = [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'Read' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' }
]

function createCrudState(overrides = {}) {
  return {
    create: false,
    read: false,
    edit: false,
    delete: false,
    ...overrides
  }
}

// --- Base Permission Modules ---
const basePermissionModules = [
  { key: 'user-management', module: 'User Management', icon: 'mdi-account-group', description: 'Create, edit, delete users and assign roles' },
  { key: 'role-management', module: 'Role Management', icon: 'mdi-shield-account', description: 'Create and modify custom roles' },
  { key: 'financial-reports', module: 'Financial Reports', icon: 'mdi-chart-line', description: 'Access financial data and analytics' },
  { key: 'system-logs-audits', module: 'System Logs & Audits', icon: 'mdi-file-document-outline', description: 'View audit trails and system logs' },
  { key: 'security-settings', module: 'Security Settings', icon: 'mdi-lock', description: 'Configure MFA and password policies' },
  { key: 'asset-management', module: 'Asset Management', icon: 'mdi-database', description: 'Manage organizational assets' },
  { key: 'compliance-controls', module: 'Compliance Controls', icon: 'mdi-gavel', description: 'Configure compliance policies' },
  { key: 'api-access', module: 'API Access', icon: 'mdi-api', description: 'Manage API keys and integrations' }
]

// --- Role Permissions Store ---
const rolePermissionsStore = ref({
  'system-super-admin': basePermissionModules.map(p => ({ ...p, actions: createCrudState({
    create: true,
    read: true,
    edit: true,
    delete: true
  }) })),
  'system-manager': basePermissionModules.map(p => ({
    ...p,
    actions: createCrudState({
      create: ['User Management', 'Asset Management'].includes(p.module),
      read: ['User Management', 'Asset Management', 'Financial Reports'].includes(p.module),
      edit: ['User Management', 'Asset Management'].includes(p.module),
      delete: ['User Management'].includes(p.module)
    })
  })),
  // Custom roles will be added here
})

// --- Custom Roles List ---
const customRoles = ref([
  { id: 'custom-tech-ops', name: 'Tech Ops', description: 'Technical operations with asset management access' },
  { id: 'custom-compliance', name: 'Compliance Officer', description: 'Focus on compliance and audit controls' }
])

// Initialize custom role permissions
customRoles.value.forEach(role => {
  if (!rolePermissionsStore.value[role.id]) {
    rolePermissionsStore.value[role.id] = basePermissionModules.map(p => ({
      ...p,
      actions: createCrudState({
        read: p.module === 'Asset Management' || p.module === 'Compliance Controls'
      })
    }))
  }
})

// --- Role Options for Selector ---
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

// --- Current Role Permissions ---
const currentRolePermissions = ref([...rolePermissionsStore.value['system-super-admin']])

function loadRolePermissions() {
  if (rolePermissionsStore.value[selectedRoleForMatrix.value]) {
    currentRolePermissions.value = JSON.parse(JSON.stringify(rolePermissionsStore.value[selectedRoleForMatrix.value]))
  }
}

function selectRole(roleId) {
  selectedRoleForMatrix.value = roleId
  loadRolePermissions()
}

function saveRolePermissions() {
  rolePermissionsStore.value[selectedRoleForMatrix.value] = JSON.parse(JSON.stringify(currentRolePermissions.value))

  // Update users that have this role
  const roleId = selectedRoleForMatrix.value
  usersList.value.forEach(user => {
    if (user.roleId === roleId) {
      const enabledCount = currentRolePermissions.value.reduce((total, permission) => total + countEnabledActions(permission.actions), 0)
      user.roleDesc = `${enabledCount} CRUD permissions enabled`
    }
  })

  alert(`Permissions saved for ${roleOptions.value.find(r => r.id === selectedRoleForMatrix.value)?.name}`)
}

// --- Create/Edit Role Functions ---
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
  } else if (
    customRoles.value.some(r =>
      r.name.toLowerCase() === newRoleName.value.trim().toLowerCase() &&
      r.id !== editingRoleId.value
    )
  ) {
    roleNameError.value = 'A role with this name already exists'
  } else {
    roleNameError.value = ''
  }
}

function saveCustomRole() {
  if (roleNameError.value || !newRoleName.value.trim()) return
  
  const roleId = `custom-${newRoleName.value.trim().toLowerCase().replace(/\s+/g, '-')}`
  
  if (editingRoleId.value) {
    // Update existing role
    const roleIndex = customRoles.value.findIndex(r => r.id === editingRoleId.value)
    if (roleIndex !== -1) {
      customRoles.value[roleIndex].name = newRoleName.value.trim()
      customRoles.value[roleIndex].description = newRoleDescription.value.trim()
    }
  } else {
    // Create new role
    customRoles.value.push({
      id: roleId,
      name: newRoleName.value.trim(),
      description: newRoleDescription.value.trim()
    })
    
    // Initialize permissions for new role (copy from manager as base)
    rolePermissionsStore.value[roleId] = JSON.parse(JSON.stringify(rolePermissionsStore.value['system-manager']))
  }
  
  closeRoleDialog()
  
  // Auto-select the new/edited role
  selectedRoleForMatrix.value = editingRoleId.value || roleId
  loadRolePermissions()
}

function deleteCustomRole() {
  if (confirm('Are you sure you want to delete this custom role? Users with this role will need to be reassigned.')) {
    const roleId = selectedRoleForMatrix.value
    const roleIndex = customRoles.value.findIndex(r => r.id === roleId)
    if (roleIndex !== -1) {
      customRoles.value.splice(roleIndex, 1)
      delete rolePermissionsStore.value[roleId]
      
      // Reassign any users with this role to manager
      usersList.value.forEach(user => {
        if (user.roleId === roleId) {
          user.roleId = 'system-manager'
          user.role = 'system-manager'
          user.roleColor = 'grey-darken-3'
          user.roleDesc = 'Restricted Access'
        }
      })
      
      // Switch to super admin
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

// --- User Permission Overrides ---
function openUserPermissionsDialog(user) {
  selectedUser.value = user

  // Load base permissions from user's role
  const basePermissions = rolePermissionsStore.value[user.roleId] || rolePermissionsStore.value['system-manager']

  // Load existing overrides for this user
  const userOverrides = userOverridesStore.value[user.id] || {}

  userOverridePermissions.value = basePermissions.map(perm => ({
    ...perm,
    hasOverride: Object.prototype.hasOwnProperty.call(userOverrides, perm.key),
    overrideActions: Object.prototype.hasOwnProperty.call(userOverrides, perm.key)
      ? createCrudState(userOverrides[perm.key])
      : createCrudState(perm.actions)
  }))

  userPermissionsDialog.value = true
}

const userOverridesStore = ref({})

function saveUserOverrides() {
  const overrides = {}
  userOverridePermissions.value.forEach(perm => {
    if (perm.hasOverride) {
      overrides[perm.key] = createCrudState(perm.overrideActions)
    }
  })

  userOverridesStore.value[selectedUser.value.id] = overrides

  // Update user's display description
  const overrideCount = Object.keys(overrides).length
  selectedUser.value.roleDesc = overrideCount > 0 ? `${overrideCount} permission overrides active` : 'Inherits role permissions'

  userPermissionsDialog.value = false
}

function toggleUserStatus(user) {
  user.isActive = !user.isActive
}

function deleteUser(user) {
  const confirmed = confirm(`Are you sure you want to delete ${user.name}?`)
  if (!confirmed) return

  usersList.value = usersList.value.filter(existingUser => existingUser.id !== user.id)
}

// --- Helper Functions ---
function getRoleDisplayName(roleId) {
  if (roleId === 'system-super-admin') return 'Super Admin'
  if (roleId === 'system-manager') return 'Manager'
  const customRole = customRoles.value.find(r => r.id === roleId)
  return customRole ? customRole.name : roleId
}

function getEnabledPermissionCount(roleId) {
  const permissions = rolePermissionsStore.value[roleId] || []
  return permissions.reduce((total, permission) => total + countEnabledActions(permission.actions), 0)
}

function countEnabledActions(actions) {
  return crudActions.reduce((total, action) => total + (actions[action.key] ? 1 : 0), 0)
}

function isAllChecked(actions) {
  return crudActions.every(action => !!actions[action.key])
}

function toggleAllActions(actions, value) {
  crudActions.forEach(action => {
    actions[action.key] = !!value
  })
}

// --- Summary Stats ---
const summaryStats = ref([
  { title: 'Total Users', value: '1,284', trend: '+12%' },
  { title: 'Active Roles', value: computed(() => 2 + customRoles.value.length), subtitle: '2 System / ' + customRoles.value.length + ' Custom', subtitleClass: 'text-medium-emphasis' },
  { title: 'Elevated Access', value: '42', subtitle: 'Audit Req', subtitleClass: 'text-primary' },
  { title: 'Access Requests', value: '8', icon: 'mdi-alert-circle', iconColor: 'error', valueClass: 'text-error' }
])

// --- User Table Data ---
const tableHeaders = [
  { title: 'USER INFO', key: 'user', align: 'start', sortable: false },
  { title: 'USERNAME', key: 'username', align: 'start' },
  { title: 'ROLE & ACCESS', key: 'role', align: 'start' },
  { title: 'STATUS', key: 'status', align: 'start' },
  { title: 'ACTIONS', key: 'actions', align: 'end', sortable: false }
]

const usersList = ref([
  {
    id: 'user-1',
    name: 'Sarah Connor',
    email: 'sarah.connor@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    username: 's.connor',
    roleId: 'system-super-admin',
    role: 'system-super-admin',
    roleDesc: 'Full Access across all modules',
    roleColor: 'primary',
    isActive: true
  },
  {
    id: 'user-2',
    name: 'Marcus Wright',
    email: 'marcus.w@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    username: 'm.wright',
    roleId: 'system-manager',
    role: 'system-manager',
    roleDesc: 'Restricted Access - User & Asset management',
    roleColor: 'grey-darken-3',
    isActive: true
  },
  {
    id: 'user-3',
    name: 'Grace Harper',
    email: 'grace.harper@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=grace',
    username: 'g.harper',
    roleId: 'custom-tech-ops',
    role: 'custom-tech-ops',
    roleDesc: 'Tech Ops: Asset management focus',
    roleColor: 'warning',
    isActive: true
  },
  {
    id: 'user-4',
    name: 'David Chen',
    email: 'david.chen@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=david',
    username: 'd.chen',
    roleId: 'custom-compliance',
    role: 'custom-compliance',
    roleDesc: 'Compliance & audit log access',
    roleColor: 'info',
    isActive: false
  }
])

// Load initial permissions for selected role
onMounted(() => {
  loadRolePermissions()
})
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-t {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-e {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.rounded-lg {
  border-radius: 12px;
}

.role-panel {
  background: rgba(var(--v-theme-surface-variant), 0.18);
}

.role-list-item {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 18px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  transition: all 0.2s ease;
}

.role-list-item:hover {
  border-color: rgba(var(--v-theme-primary), 0.45);
  transform: translateY(-1px);
}

.role-list-item.active {
  background: rgba(var(--v-theme-primary), 0.08);
  border-color: rgb(var(--v-theme-primary));
}

.permission-checkbox :deep(.v-selection-control) {
  justify-content: center;
}

/* Table hover effect */
.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transition: background-color 0.2s ease;
}

/* Chip styling */
.v-chip {
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
