<template>
  <v-container fluid class="pa-0 mx-auto user-management-view" style="max-width: 1400px;">
    

    <v-tabs
      v-model="activeTab"
      color="primary"
      align-tabs="start"
      class="mb-3 border-b compact-tabs"
    >
      <v-tab value="roles" prepend-icon="mdi-shield-account">Role Management</v-tab>
      <v-tab value="users" prepend-icon="mdi-account-group">User Directory</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" :touch="false">
      <v-window-item value="roles">
        <RoleMatrix />
      </v-window-item>
      
      <v-window-item value="users">
        <UserList />
      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRoleStore } from '@/stores/roleStore'
import { usePermissionStore } from '@/stores/permissionStore'
import RoleMatrix from '../components/UserManagement/RoleMatrix.vue'
import UserList from '../components/UserManagement/UserList.vue'

// --- Tab State ---
const activeTab = ref('roles')

// --- Pinia stores ---
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

// --- Shared UI Constants (injected into children) ---
const crudActions = [
  { key: 'create', label: 'Create', apiAction: 'create' },
  { key: 'read',   label: 'Read',   apiAction: 'view'   },
  { key: 'edit',   label: 'Edit',   apiAction: 'update' },
  { key: 'delete', label: 'Delete', apiAction: 'delete' },
]

function createCrudState(overrides = {}) {
  return { create: false, read: false, edit: false, delete: false, ...overrides }
}

/**
 * Mapping module names to icons
 */
const moduleIcons = {
  'User Management': 'mdi-account-group',
  'Role Management': 'mdi-shield-account',
  'Financial Reports': 'mdi-chart-line',
  'System Logs & Audits': 'mdi-file-document-outline',
  'Security Settings': 'mdi-lock',
  'Asset Management': 'mdi-database',
  'Compliance Controls': 'mdi-gavel',
  'API Access': 'mdi-api',
  'Employee Management': 'mdi-account-tie',
  'Asset Assignment': 'mdi-file-export',
  'Maintenance': 'mdi-tools',
}

/**
 * basePermissionModules is now computed from permissionStore.groupedPermissions
 */
const basePermissionModules = computed(() => {
  const grouped = permissionStore.groupedPermissions
  return Object.keys(grouped).map(moduleName => {
    return {
      key: moduleName.toLowerCase().replace(/\s+/g, '-'),
      module: moduleName,
      icon: moduleIcons[moduleName] || 'mdi-cube-outline',
      description: `Manage ${moduleName} permissions`,
      permissions: grouped[moduleName] // The raw permission objects from API
    }
  })
})

/**
 * customRoles is a live computed ref from the Pinia store.
 * UserList.vue uses it for getRoleDisplayName() lookups.
 */
const customRoles = computed(() =>
  roleStore.roles.map(r => ({
    id:          String(r.id || r.role_id),
    name:        r.name,
    description: r.description ?? '',
  }))
)

// Local UI permission matrix (used by UserList override dialog only)
// Note: This still uses the hardcoded ones for system roles for now, 
// but we could also drive it from API data if system roles are in API.
const rolePermissionsStore = ref({
  'system-super-admin': [], // Will be populated or handled differently
  'system-manager': [],
})

// Demo user list (replace with real user API when ready)
const usersList = ref([
  { id: 'user-1', name: 'Sarah Connor',  email: 'sarah.connor@enterprise.com',  avatar: 'https://i.pravatar.cc/150?u=sarah',  username: 's.connor',  roleId: 'system-super-admin', role: 'system-super-admin', roleDesc: 'Full Access across all modules',                  roleColor: 'primary',      isActive: true  },
  { id: 'user-2', name: 'Marcus Wright', email: 'marcus.w@enterprise.com',       avatar: 'https://i.pravatar.cc/150?u=marcus', username: 'm.wright',  roleId: 'system-manager',     role: 'system-manager',     roleDesc: 'Restricted Access - User & Asset management',     roleColor: 'grey-darken-3',isActive: true  },
  { id: 'user-3', name: 'Grace Harper',  email: 'grace.harper@enterprise.com',   avatar: 'https://i.pravatar.cc/150?u=grace',  username: 'g.harper',  roleId: 'custom-tech-ops',    role: 'custom-tech-ops',    roleDesc: 'Tech Ops: Asset management focus',                roleColor: 'warning',      isActive: true  },
  { id: 'user-4', name: 'David Chen',    email: 'david.chen@enterprise.com',     avatar: 'https://i.pravatar.cc/150?u=david',  username: 'd.chen',    roleId: 'custom-compliance',  role: 'custom-compliance',  roleDesc: 'Compliance & audit log access',                   roleColor: 'info',         isActive: false },
])

// Provide to children
provide('crudActions',           crudActions)
provide('basePermissionModules', basePermissionModules)
provide('rolePermissionsStore',  rolePermissionsStore)
provide('customRoles',           customRoles)
provide('usersList',             usersList)

// --- Lifecycle ---
onMounted(async () => {
  await Promise.all([
    roleStore.fetchRoles(),
    permissionStore.fetchGroupedPermissions()
  ])
})

// --- Summary stats (reactive to store) ---
const summaryStats = ref([
  { title: 'TOTAL USERS',      value: '1,284',                                            trend: '+12%', icon: 'mdi-account-group-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5' },
  { title: 'ACTIVE ROLES',     value: computed(() => 2 + roleStore.roles.length),          subtitle: computed(() => `2 System / ${roleStore.roles.length} Custom`), subtitleClass: 'text-medium-emphasis', icon: 'mdi-shield-account-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5' },
  { title: 'ELEVATED ACCESS',  value: '42',  subtitle: 'Audit Req',  subtitleClass: 'text-primary', icon: 'mdi-shield-lock-outline',   iconColor: 'red-darken-2',  bg: 'bg-red-lighten-5'  },
  { title: 'ACCESS REQUESTS',  value: '8',   subtitle: 'Pending',    subtitleClass: 'text-error',   icon: 'mdi-alert-circle-outline',   iconColor: 'red-darken-2',  bg: 'bg-red-lighten-5', valueClass: 'text-error' },
])
</script>

<style scoped>
.user-management-view { padding-block: 2px 6px; }
.page-title { font-size: 1.2rem; line-height: 1.1; }
.page-subtitle { font-size: 0.74rem; line-height: 1.3; }
.section-title { font-size: 0.9rem; line-height: 1.2; }
.section-copy { font-size: 0.72rem; line-height: 1.35; }
.micro-label { font-size: 0.62rem; line-height: 1.2; letter-spacing: 0.05em; }
.micro-copy { font-size: 0.72rem; line-height: 1.25; }
.audit-value { font-size: 1.15rem; line-height: 1.1; }
.gap-4 { gap: 16px; }
.dashboard-kicker { font-size: 9px; text-transform: uppercase; letter-spacing: 0.4px; }
.compact-card { min-height: auto; }

/* Clean up tab styling */
.compact-tabs :deep(.v-tab) {
  min-height: 38px;
  padding-inline: 12px;
  font-size: 0.78rem;
  text-transform: none !important;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
