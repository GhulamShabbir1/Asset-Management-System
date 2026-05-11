<template>
  <v-container fluid class="pa-0 mx-auto user-management-view" style="max-width: 1400px;">
    <v-row class="mb-1 align-center justify-space-between">
      <v-col cols="12" md="6">
        <h1 class="page-title font-weight-bold text-high-emphasis mb-0">Access Control</h1>
        <p class="page-subtitle text-medium-emphasis mt-1 mb-0">
          Manage users, define custom roles, and configure granular permissions.
        </p>
      </v-col>
    </v-row>

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

    <v-row class="mb-1 mt-3">
      <v-col cols="12" lg="8">
        <v-card rounded="lg" elevation="0" border color="primary" variant="tonal" class="pa-3 fill-height d-flex align-center compact-card">
          <div class="flex-grow-1 mr-3">
            <h3 class="section-title font-weight-bold text-primary mb-1">RBAC Governance Policy</h3>
            <p class="section-copy text-medium-emphasis mb-3">
              You are managing the core access control matrix. Any changes to "Super Admin" or "Custom" roles that include 'Financial Audit' privileges will trigger a mandatory secondary approval flow for ISO 27001 compliance.
            </p>
            <div class="d-flex gap-4">
              <div>
                <div class="micro-label text-primary font-weight-bold text-uppercase mb-1">MFA Status</div>
                <div class="micro-copy font-weight-bold">Enforced for Admin Roles</div>
              </div>
              <div>
                <div class="micro-label text-grey-darken-2 font-weight-bold text-uppercase mb-1">Audit Interval</div>
                <div class="micro-copy font-weight-bold">Every 90 Days</div>
              </div>
            </div>
          </div>
          <v-icon icon="mdi-shield-check" size="64" class="opacity-20 d-none d-sm-block"></v-icon>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="lg" elevation="0" border class="pa-3 fill-height d-flex flex-column justify-center text-center bg-grey-lighten-4 compact-card">
          <div class="dashboard-kicker text-medium-emphasis mb-1">Security Audit</div>
          <div class="audit-value font-weight-black mb-1">100% Compliant</div>
          <div class="section-copy text-medium-emphasis mb-2">Access control logs are synchronized with enterprise SIEM.</div>
          <v-btn variant="text" color="primary" class="font-weight-bold align-self-center">View Policy Logs</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import RoleMatrix from '../components/UserManagement/RoleMatrix.vue'
import UserList from '../components/UserManagement/UserList.vue'

// --- NEW: Tab State ---
const activeTab = ref('roles') // Defaults to showing the Role Management tab

// --- Shared Constants & Helpers ---
const crudActions = [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'Read' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' }
]

function createCrudState(overrides = {}) {
  return { create: false, read: false, edit: false, delete: false, ...overrides }
}

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

// --- Global State ---
const rolePermissionsStore = ref({
  'system-super-admin': basePermissionModules.map(p => ({ ...p, actions: createCrudState({ create: true, read: true, edit: true, delete: true }) })),
  'system-manager': basePermissionModules.map(p => ({
    ...p,
    actions: createCrudState({
      create: ['User Management', 'Asset Management'].includes(p.module),
      read: ['User Management', 'Asset Management', 'Financial Reports'].includes(p.module),
      edit: ['User Management', 'Asset Management'].includes(p.module),
      delete: ['User Management'].includes(p.module)
    })
  }))
})

const customRoles = ref([
  { id: 'custom-tech-ops', name: 'Tech Ops', description: 'Technical operations with asset management access' },
  { id: 'custom-compliance', name: 'Compliance Officer', description: 'Focus on compliance and audit controls' }
])

// Initialize custom roles state
customRoles.value.forEach(role => {
  if (!rolePermissionsStore.value[role.id]) {
    rolePermissionsStore.value[role.id] = basePermissionModules.map(p => ({
      ...p,
      actions: createCrudState({ read: p.module === 'Asset Management' || p.module === 'Compliance Controls' })
    }))
  }
})

const usersList = ref([
  { id: 'user-1', name: 'Sarah Connor', email: 'sarah.connor@enterprise.com', avatar: 'https://i.pravatar.cc/150?u=sarah', username: 's.connor', roleId: 'system-super-admin', role: 'system-super-admin', roleDesc: 'Full Access across all modules', roleColor: 'primary', isActive: true },
  { id: 'user-2', name: 'Marcus Wright', email: 'marcus.w@enterprise.com', avatar: 'https://i.pravatar.cc/150?u=marcus', username: 'm.wright', roleId: 'system-manager', role: 'system-manager', roleDesc: 'Restricted Access - User & Asset management', roleColor: 'grey-darken-3', isActive: true },
  { id: 'user-3', name: 'Grace Harper', email: 'grace.harper@enterprise.com', avatar: 'https://i.pravatar.cc/150?u=grace', username: 'g.harper', roleId: 'custom-tech-ops', role: 'custom-tech-ops', roleDesc: 'Tech Ops: Asset management focus', roleColor: 'warning', isActive: true },
  { id: 'user-4', name: 'David Chen', email: 'david.chen@enterprise.com', avatar: 'https://i.pravatar.cc/150?u=david', username: 'd.chen', roleId: 'custom-compliance', role: 'custom-compliance', roleDesc: 'Compliance & audit log access', roleColor: 'info', isActive: false }
])

// Provide state to children
provide('crudActions', crudActions)
provide('basePermissionModules', basePermissionModules)
provide('rolePermissionsStore', rolePermissionsStore)
provide('customRoles', customRoles)
provide('usersList', usersList)

// --- Summary Stats ---
const summaryStats = ref([
  { title: 'TOTAL USERS', value: '1,284', trend: '+12%', icon: 'mdi-account-group-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5' },
  { title: 'ACTIVE ROLES', value: computed(() => 2 + customRoles.value.length), subtitle: '2 System / ' + customRoles.value.length + ' Custom', subtitleClass: 'text-medium-emphasis', icon: 'mdi-shield-account-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5' },
  { title: 'ELEVATED ACCESS', value: '42', subtitle: 'Audit Req', subtitleClass: 'text-primary', icon: 'mdi-shield-lock-outline', iconColor: 'red-darken-2', bg: 'bg-red-lighten-5' },
  { title: 'ACCESS REQUESTS', value: '8', subtitle: 'Pending', subtitleClass: 'text-error', icon: 'mdi-alert-circle-outline', iconColor: 'red-darken-2', bg: 'bg-red-lighten-5', valueClass: 'text-error' }
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
