<template>
  <v-container fluid class="bg-background py-8" max-width="1600">
    
    <v-row class="mb-6 align-center justify-space-between">
      <v-col cols="12" md="6">
        <h2 class="text-h4 font-weight-bold text-high-emphasis">User Management</h2>
        <p class="text-body-1 text-medium-emphasis mt-1">
          Manage system access, roles, and compliance policies.
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-md-end gap-4">
        <v-btn variant="outlined" prepend-icon="mdi-lock-account" size="large" rounded="lg">
          Create Custom Role
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-account-plus" size="large" rounded="lg" elevation="2">
          Add New User
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in summaryStats" :key="index">
        <v-card rounded="xl" elevation="2" class="pa-5 fill-height d-flex flex-column justify-center">
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

    <v-row class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="2" border>
          <div class="d-flex justify-space-between align-center pa-6 pb-4 border-b bg-grey-lighten-4">
            <div>
              <h3 class="text-h6 font-weight-bold">Role Permissions Overview</h3>
              <p class="text-body-2 text-medium-emphasis">Comparative matrix of system-defined and custom access levels.</p>
            </div>
            <v-btn variant="text" color="primary" prepend-icon="mdi-cog-outline" class="font-weight-bold">
              Configure Matrix
            </v-btn>
          </div>
          
          <v-table hover class="bg-surface">
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-left font-weight-bold text-uppercase text-caption">Module / Action</th>
                <th class="text-center font-weight-bold text-uppercase text-caption text-primary border-s">Super Admin</th>
                <th class="text-center font-weight-bold text-uppercase text-caption border-e">Manager</th>
                <th class="text-center font-weight-bold text-uppercase text-caption text-medium-emphasis">Custom (Tech Ops)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(perm, i) in permissionMatrix" :key="i">
                <td class="font-weight-medium py-3">{{ perm.module }}</td>
                <td class="text-center border-s py-3">
                  <v-icon v-if="perm.admin" icon="mdi-check-circle" color="primary"></v-icon>
                  <v-icon v-else icon="mdi-minus" color="grey-lighten-1"></v-icon>
                </td>
                <td class="text-center border-e py-3">
                  <v-icon v-if="perm.manager" icon="mdi-check-circle" color="primary"></v-icon>
                  <v-icon v-else icon="mdi-minus" color="grey-lighten-1"></v-icon>
                </td>
                <td class="text-center py-3">
                  <v-icon v-if="perm.custom" icon="mdi-check-circle" color="primary"></v-icon>
                  <v-icon v-else icon="mdi-minus" color="grey-lighten-1"></v-icon>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="2" border>
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
                  <div class="font-weight-bold">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                </div>
              </div>
            </template>

            <template v-slot:item.role="{ item }">
              <div class="d-flex flex-column align-start py-2">
                <v-chip :color="item.roleColor" size="small" class="font-weight-bold text-uppercase mb-1" variant="tonal">
                  {{ item.role }}
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
              <div class="d-flex justify-end gap-2">
                <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-tune">
                  Permissions
                </v-btn>
                <v-btn icon="mdi-pencil" variant="text" size="small" color="grey-darken-1"></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card rounded="xl" elevation="0" border color="primary" variant="tonal" class="pa-6 fill-height d-flex align-center">
          <div class="flex-grow-1 mr-4">
            <h3 class="text-h6 font-weight-bold text-primary mb-2">RBAC Governance Policy</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              You are managing the core access control matrix. Any changes to "Super Admin" or "Custom" roles that include 'Financial Audit' privileges will trigger a mandatory secondary approval flow for ISO 27001 compliance.
            </p>
            <div class="d-flex gap-6">
              <div>
                <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">MFA Status</div>
                <div class="text-body-2 font-weight-bold">Enforced for Admin Roles</div>
              </div>
              <div>
                <div class="text-caption text-grey-darken-2 font-weight-bold text-uppercase mb-1">Audit Interval</div>
                <div class="text-body-2 font-weight-bold">Every 90 Days</div>
              </div>
            </div>
          </div>
          <v-icon icon="mdi-shield-check" size="80" class="opacity-20 d-none d-sm-block"></v-icon>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="xl" elevation="2" border class="pa-6 fill-height d-flex flex-column justify-center text-center bg-grey-lighten-4">
          <div class="text-overline text-medium-emphasis mb-2">Security Audit</div>
          <div class="text-h4 font-weight-black mb-2">100% Compliant</div>
          <div class="text-body-2 text-medium-emphasis mb-4">Access control logs are synchronized with enterprise SIEM.</div>
          <v-btn variant="text" color="primary" class="font-weight-bold align-self-center">View Policy Logs</v-btn>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// --- Search State ---
const searchQuery = ref('')

// --- Summary Statistics Data ---
const summaryStats = ref([
  { title: 'Total Users', value: '1,284', trend: '+12%' },
  { title: 'Active Roles', value: '8', subtitle: '3 System / 5 Custom', subtitleClass: 'text-medium-emphasis' },
  { title: 'Elevated Access', value: '42', subtitle: 'Audit Req', subtitleClass: 'text-primary' },
  { title: 'Access Requests', value: '8', icon: 'mdi-alert-circle', iconColor: 'error', valueClass: 'text-error' }
])

// --- Permission Matrix Data ---
const permissionMatrix = ref([
  { module: 'Manage Assets (CRUD)', admin: true, manager: true, custom: true },
  { module: 'User Management', admin: true, manager: false, custom: false },
  { module: 'View Financial Reports', admin: true, manager: true, custom: false },
  { module: 'System Logs & Audits', admin: true, manager: false, custom: false },
  { module: 'Global Settings', admin: true, manager: false, custom: false }
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
    name: 'Sarah Connor',
    email: 'sarah.connor@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    username: 's.connor',
    role: 'Super Admin',
    roleDesc: 'Full Access',
    roleColor: 'primary',
    isActive: true
  },
  {
    name: 'Marcus Wright',
    email: 'marcus.w@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    username: 'm.wright',
    role: 'Manager',
    roleDesc: 'Restricted Access',
    roleColor: 'grey-darken-3',
    isActive: true
  },
  {
    name: 'Grace Harper',
    email: 'grace.harper@enterprise.com',
    avatar: 'https://i.pravatar.cc/150?u=grace',
    username: 'g.harper',
    role: 'Custom',
    roleDesc: 'Tech Ops Suite',
    roleColor: 'warning',
    isActive: false
  }
])
</script>

<style scoped>
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
</style>