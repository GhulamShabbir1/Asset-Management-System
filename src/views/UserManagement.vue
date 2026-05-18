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

    <AddUserRoleModal 
      v-model="addUserModal" 
      :roles="customRoles" 
      @user-added="fetchUsers" 
    />
  </v-container>
</template>

<script setup>
import { ref, computed, provide, onMounted, watch } from 'vue'
import { useRoleStore } from '@/stores/roleStore'
import { usePermissionStore } from '@/stores/permissionStore'
import RoleMatrix from '../components/UserManagement/RoleMatrix.vue'
import UserList from '../components/UserManagement/UserList.vue'
import AddUserRoleModal from '../components/modals/AddUserRoleModal.vue'
import authService from '@/services/authService'

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
const rolePermissionsStore = ref({
  'system-super-admin': [], 
  'system-manager': [],
})

const addUserModal = ref(false)

// Demo user list (initialized empty, populated from API)
const usersList = ref([])

const fetchUsers = async () => {
  try {
    const res = await authService.readUsers()
    console.log('User API Raw Response:', res)
    
    // Extremely robust extraction based on user-provided JSON
    let data = []
    if (res && typeof res === 'object') {
      if (res.data && res.data.users && Array.isArray(res.data.users)) {
        data = res.data.users
      } else if (res.users && Array.isArray(res.users)) {
        data = res.users
      } else if (res.data && Array.isArray(res.data)) {
        data = res.data
      } else if (Array.isArray(res)) {
        data = res
      }
    }

    console.log('Extracted users array:', data)

    usersList.value = data.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email || '',
      avatar: user.profile_picture || user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      username: user.username || user.email?.split('@')[0] || `user_${user.id}`,
      roleId: user.role_id || user.assigned_role?.role_id || user.role?.id || 'unassigned',
      role: user.assigned_role?.name || user.role?.name || (user.role_id && user.role !== 'admin' ? user.role : (user.role_id ? 'Assigned' : 'unassigned')),
      roleDesc: user.assigned_role?.description || user.role_description || (user.role_id ? 'Assigned System Role' : 'No role assigned'),
      roleColor: (user.role_id || user.assigned_role || user.role) ? 'primary' : 'grey',
      isActive: user.is_active ?? true
    }))
    
    console.log('Mapped usersList:', usersList.value)
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

// Provide to children
provide('crudActions',           crudActions)
provide('basePermissionModules', basePermissionModules)
provide('rolePermissionsStore',  rolePermissionsStore)
provide('customRoles',           customRoles)
provide('usersList',             usersList)
provide('fetchUsers',            fetchUsers)
provide('addUserModal',          addUserModal)

// --- Lifecycle ---
onMounted(async () => {
  await Promise.all([
    roleStore.fetchRoles(),
    permissionStore.fetchGroupedPermissions(),
    fetchUsers()
  ])
})

watch(addUserModal, (newVal) => {
  if (newVal) {
    roleStore.fetchRoles()
    fetchUsers()
  }
})

// --- Summary stats (reactive to store) ---
const summaryStats = ref([
  { title: 'TOTAL USERS',      value: computed(() => usersList.value.length),              trend: '+12%', icon: 'mdi-account-group-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5' },
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
