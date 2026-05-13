<template>
  <v-row class="mb-2">
    <v-col cols="12">
      <v-card rounded="lg" elevation="0" border>
        <div class="pa-3 bg-grey-lighten-4 border-b d-flex justify-space-between align-center flex-wrap gap-3">
          <div class="d-flex gap-2">
            
            <v-menu content-class="compact-filter-menu">
              <template v-slot:activator="{ props }">
                <v-btn variant="outlined" prepend-icon="mdi-filter-variant" size="small" rounded="md" v-bind="props">
                  {{ activeFilter === 'All' ? 'Filter' : activeFilter }}
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="activeFilter = 'All'">All Users</v-list-item>
                <v-list-item @click="activeFilter = 'Active'">Active Only</v-list-item>
                <v-list-item @click="activeFilter = 'Deactivated'">Deactivated Only</v-list-item>
              </v-list>
            </v-menu>

            <v-menu content-class="compact-filter-menu">
              <template v-slot:activator="{ props }">
                <v-btn variant="outlined" prepend-icon="mdi-sort" size="small" rounded="md" v-bind="props">Sort</v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="sortBy = [{ key: 'name', order: 'asc' }]">Name (A-Z)</v-list-item>
                <v-list-item @click="sortBy = [{ key: 'name', order: 'desc' }]">Name (Z-A)</v-list-item>
                <v-list-item @click="sortBy = [{ key: 'isActive', order: 'desc' }]">Status (Active First)</v-list-item>
              </v-list>
            </v-menu>

          </div>
          
          <v-text-field
            class="compact-filter-field"
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search name, email, or role..."
            variant="outlined" density="compact" hide-details
            style="max-width: 280px;" rounded="md" bg-color="white"
          ></v-text-field>
        </div>

        <v-data-table 
          class="user-list-table"
          :headers="tableHeaders" 
          :items="filteredUsersList" 
          :search="searchQuery" 
          v-model:sort-by="sortBy"
          density="compact"
          items-per-page="5" 
          hover
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-1">
              <v-avatar size="36" class="mr-3 border">
                <v-img :src="item.avatar"></v-img>
              </v-avatar>
              <div>
                <div class="font-weight-bold cell-title">{{ item.name }}</div>
                <div class="cell-copy text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.role="{ item }">
            <div class="d-flex flex-column align-start py-1">
              <v-chip :color="item.roleColor" size="small" class="font-weight-bold text-uppercase mb-1" variant="tonal">
                {{ getRoleDisplayName(item.role) }}
              </v-chip>
              <span class="cell-copy text-medium-emphasis font-italic">{{ item.roleDesc }}</span>
            </div>
          </template>

          <template v-slot:item.isActive="{ item }">
            <div class="d-flex align-center">
              <v-icon :icon="item.isActive ? 'mdi-circle' : 'mdi-circle-outline'" :color="item.isActive ? 'success' : 'grey'" size="12" class="mr-2"></v-icon>
              <span :class="item.isActive ? 'cell-copy text-high-emphasis' : 'cell-copy text-medium-emphasis font-italic'">
                {{ item.isActive ? 'Active' : 'Deactivated' }}
              </span>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="action-cell py-1">
              <v-btn
                variant="text"
                color="primary"
                size="small"
                icon="mdi-tune"
                @click="openUserPermissionsDialog(item)"
              ></v-btn>
              <v-btn
                variant="text"
                :color="item.isActive ? 'warning' : 'success'"
                size="small"
                :icon="item.isActive ? 'mdi-account-off-outline' : 'mdi-account-check-outline'"
                @click="toggleUserStatus(item)"
              ></v-btn>
              <v-btn
                variant="text"
                color="error"
                size="small"
                icon="mdi-delete-outline"
                @click="deleteUser(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-dialog v-model="userPermissionsDialog" max-width="600px" rounded="lg">
      <v-card rounded="lg" elevation="0" border>
        <v-card-title class="text-body-1 font-weight-bold pa-4 pb-2">
          Override Permissions for {{ selectedUser?.name }}
        </v-card-title>
        <v-card-text class="pa-4 pt-2">
          <v-alert type="warning" variant="tonal" class="mb-4" density="compact">
            User normally inherits permissions from <strong>{{ getRoleDisplayName(selectedUser?.roleId) }}</strong> role.
          </v-alert>
          <div v-for="perm in userOverridePermissions" :key="perm.module" class="mb-3">
            <div class="pa-3 rounded-lg" :class="perm.hasOverride ? 'bg-grey-lighten-4' : 'border'">
              <div class="d-flex align-center justify-space-between gap-3 flex-wrap">
                <div class="d-flex align-center">
                  <v-icon :icon="perm.icon" size="20" class="mr-3 text-medium-emphasis"></v-icon>
                  <span class="font-weight-medium">{{ perm.module }}</span>
                </div>
                <v-checkbox v-model="perm.hasOverride" label="Override" hide-details density="compact" class="mt-0 pt-0"></v-checkbox>
              </div>
              <div class="d-flex align-center justify-space-between gap-3 flex-wrap mt-3">
                <div class="text-caption text-medium-emphasis">Permission actions</div>
                <div class="d-flex align-center flex-wrap gap-3">
                  <v-checkbox :model-value="isAllChecked(perm.overrideActions)" @update:model-value="toggleAllActions(perm.overrideActions, $event)" label="All" hide-details density="compact" :disabled="!perm.hasOverride" class="mt-0 pt-0"></v-checkbox>
                  <v-checkbox v-for="action in crudActions" :key="`${perm.key}-override-${action.key}`" v-model="perm.overrideActions[action.key]" :label="action.label" hide-details density="compact" :disabled="!perm.hasOverride" class="mt-0 pt-0"></v-checkbox>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 gap-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="userPermissionsDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveUserOverrides">Save Overrides</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const usersList = inject('usersList')
const customRoles = inject('customRoles')
const rolePermissionsStore = inject('rolePermissionsStore')
const crudActions = inject('crudActions')

// --- NEW/UPDATED STATE ---
const searchQuery = ref('')
const activeFilter = ref('All')
const sortBy = ref([])

const userPermissionsDialog = ref(false)
const selectedUser = ref(null)
const userOverridePermissions = ref([])
const userOverridesStore = ref({})

// FIXED: Keys now match the data attributes ('name' and 'isActive')
const tableHeaders = [
  { title: 'USER INFO', key: 'name', align: 'start' }, 
  { title: 'USERNAME', key: 'username', align: 'start' },
  { title: 'ROLE & ACCESS', key: 'role', align: 'start' },
  { title: 'STATUS', key: 'isActive', align: 'start' }, 
  { title: 'ACTIONS', key: 'actions', align: 'end', sortable: false, width: 140, nowrap: true }
]

// FIXED: Computed property to handle filtering by Active/Deactivated
const filteredUsersList = computed(() => {
  // Active/Deactivated filtering only; role selection is not part of this filter
  // to avoid showing all users when a custom role is chosen.
  if (activeFilter.value === 'Active') {
    return usersList.value.filter(user => user.isActive)
  }
  if (activeFilter.value === 'Deactivated') {
    return usersList.value.filter(user => !user.isActive)
  }
  return usersList.value
})

function createCrudState(overrides = {}) {
  return { create: false, read: false, edit: false, delete: false, ...overrides }
}

function getRoleDisplayName(roleId) {
  if (String(roleId) === 'system-super-admin') return 'Super Admin'
  if (String(roleId) === 'system-manager') return 'Manager'
  const customRole = customRoles.value.find(r => String(r.id) === String(roleId))
  return customRole ? customRole.name : roleId
}

function openUserPermissionsDialog(user) {
  selectedUser.value = user
  const basePermissions = rolePermissionsStore.value[user.roleId] || rolePermissionsStore.value['system-manager']
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

function isAllChecked(actions) {
  return crudActions.every(action => !!actions[action.key])
}

function toggleAllActions(actions, value) {
  crudActions.forEach(action => { actions[action.key] = !!value })
}

function saveUserOverrides() {
  const overrides = {}
  userOverridePermissions.value.forEach(perm => {
    if (perm.hasOverride) { overrides[perm.key] = createCrudState(perm.overrideActions) }
  })
  userOverridesStore.value[selectedUser.value.id] = overrides

  const overrideCount = Object.keys(overrides).length
  selectedUser.value.roleDesc = overrideCount > 0 ? `${overrideCount} overrides active` : 'Inherits role permissions'
  userPermissionsDialog.value = false
}

function toggleUserStatus(user) {
  user.isActive = !user.isActive
}

function deleteUser(user) {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    usersList.value = usersList.value.filter(existingUser => existingUser.id !== user.id)
  }
}
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.compact-filter-menu :deep(.v-list-item) {
  min-height: 30px;
}
.compact-filter-menu :deep(.v-list-item-title),
.compact-filter-menu :deep(.v-list-item__content) {
  font-size: 0.68rem;
  line-height: 1.2;
}
.compact-filter-field :deep(.v-field__input) {
  font-size: 0.7rem;
  line-height: 1.2;
}
.compact-filter-field :deep(.v-field__input::placeholder) {
  font-size: 0.68rem;
  opacity: 0.72;
}
.compact-filter-field :deep(.v-field__prepend-inner .v-icon) {
  font-size: 0.95rem;
}
.compact-filter-field :deep(.v-field) {
  --v-input-control-height: 34px;
}
.cell-title {
  font-size: 0.72rem;
  line-height: 1.2;
}
.cell-copy {
  font-size: 0.68rem;
  line-height: 1.25;
}
.user-list-table :deep(.v-data-table-header__content) {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.user-list-table :deep(thead th) {
  background-color: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), 0.72);
  padding-top: 6px;
  padding-bottom: 6px;
  min-height: 34px;
}
.user-list-table :deep(tbody td) {
  vertical-align: middle;
  padding-top: 5px;
  padding-bottom: 5px;
}
.user-list-table :deep(.v-data-table-footer) {
  padding-top: 4px;
  padding-bottom: 4px;
}
.user-list-table :deep(tbody tr:hover) { background-color: rgba(var(--v-theme-primary), 0.04); transition: background-color 0.2s ease; }
.action-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  min-width: 108px;
  white-space: nowrap;
}
.v-chip { font-weight: 600; letter-spacing: 0.3px; }
</style>
