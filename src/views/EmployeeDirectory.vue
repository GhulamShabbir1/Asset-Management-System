<script setup lang="ts">
import { ref } from 'vue'

interface Employee {
  id: string
  name: string
  department: string
  assignedAssets: number
  assets: Array<{
    icon: string
    title: string
  }>
  lastActivity: string
  status: 'Active' | 'Action Required'
  image: string
  hasAlert?: boolean
}

const selectedDepartment = ref('ALL')
const searchQuery = ref('')

const departments = ['ALL DEPARTMENTS', 'ENGINEERING', 'PRODUCT', 'SALES']

const employees: Employee[] = [
  {
    id: 'EMP-2024-001',
    name: 'Sarah Jenkins',
    department: 'Engineering',
    assignedAssets: 4,
    assets: [
      { icon: 'mdi-laptop-mac', title: 'MacBook Pro 16' },
      { icon: 'mdi-cellphone', title: 'iPhone 15 Pro' },
      { icon: 'mdi-monitor', title: 'Dell UltraSharp 27' },
      { icon: 'mdi-headphones', title: 'AirPods Pro' },
    ],
    lastActivity: '2 hours ago',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBapFrXGhtWu3i0xnGOOZRa-MsI-MLgXkLHdqeR0H8hX3V7VaEHqLXQXeYoQIAbL1oz6wblgrD2RX_OEd-xCvS6FxZMWWI85Zkh_YR6oUbNJ0vOaPP6J0tqf7YWNXyH6EkTwp7nIAyd7HR8_D5YL09ueQek_RA37XIyW1FkF_AbyPCr8QC4PNbdOGAtA0U3aSvZACp4qgXoTpy9WRa6UDKxn_10qUx2Y2iZAKCi2pzb9NAWqzH5G-GK8roZ-xs177DOV2HEdExp2aJ',
  },
  {
    id: 'EMP-2024-045',
    name: 'Marcus Thorne',
    department: 'Product',
    assignedAssets: 2,
    assets: [
      { icon: 'mdi-laptop', title: 'ThinkPad X1 Carbon' },
      { icon: 'mdi-cellphone', title: 'Galaxy S23' },
    ],
    lastActivity: 'Yesterday',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhOlSjmxWo1Wqv5NaUEt8pZpVFj66rGMrhg87tPvFunZKLytIw5zfH_R-03LVzpsPSPe_nwNHJVGMeFx7lB8f5YiJbUsDa-Hmewf13P0qEJPqBjp5B2-IAuPHU1MiAdo6OUuDkX8rNwzjkxsnztgQ3PgiXKYCIXypJ4zmeCZYvA7-fgBrAIjAkepy0wUOnItXvJHeh0Xhhhvb-b0_xjSWbhcfvn5oqBu4bvb-v7i7dY8YUvifWNWzgZfMk4fHeP-vB42kzNWckgSKF',
  },
  {
    id: 'EMP-2023-112',
    name: 'Elena Rodriguez',
    department: 'HR',
    assignedAssets: 3,
    assets: [
      { icon: 'mdi-laptop-mac', title: 'MacBook Air' },
      { icon: 'mdi-tablet', title: 'iPad Pro' },
      { icon: 'mdi-keyboard', title: 'Expired Warranty' },
    ],
    lastActivity: '5 days ago',
    status: 'Action Required',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXcjJh6-HidYMOeQDQTLzfz5327iuJ4LyB-qmAlngfqkcvGWf1tiSa7T4CC_wJJWLto0nTBTY-MYhwN5uGGLnkGo0hT8wXaIJDfkWzvKUwAVO86eVZLtGQiD-G8UHSpj3IdJnJYY4PN2fb1okOhyBz-bzpli0zLAvFvPyJ6ZoDphgNnDGZPGtHCdYuZp13EtADrPY-NE0ZA43cVrI7p9echXXXuRzq_a_uXQ7VqIyYd96h3H8a7L96Bbnsgcx_NRzeIM8Bd-zM2Io',
    hasAlert: true,
  },
  {
    id: 'EMP-2024-078',
    name: 'David Chen',
    department: 'Sales',
    assignedAssets: 5,
    assets: [
      { icon: 'mdi-laptop', title: 'Laptop' },
      { icon: 'mdi-cellphone', title: 'Smartphone' },
      { icon: 'mdi-tablet', title: 'Tablet' },
      { icon: 'mdi-wifi', title: 'WiFi Device' },
      { icon: 'mdi-power-plug', title: 'Power Adapter' },
    ],
    lastActivity: '1 day ago',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRzmh0W0QFsBZTmPRZAuK1YacRyJ4G2nlcUl8iXBApKdWayG7fBe__tC6vJyl_-BM54NTbfZkVEW9Emzsq9WVHpZIzfMQPyaZbbQqb8LCupCkCiw3O47IRQqn1AvJH7CE_lzPEe2pTPpI9uHsRSCFvX8k5jCDYfTy4BC7VnkoPnqqdHb2inLTwD_fzkDADUeGc7hPQ7IY6T43STEEHOB9qr8y8gUJXlbzQZd-lNQDhOtyktRWc5WnCE0b-C4D7GaW6gCE0B7sgv5Tp',
  },
  {
    id: 'EMP-2024-089',
    name: 'Sophie Muller',
    department: 'Engineering',
    assignedAssets: 1,
    assets: [{ icon: 'mdi-laptop-mac', title: 'MacBook Pro' }],
    lastActivity: '3 hours ago',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVaUVS_XdKcsnjDhtyD8vSfc8Fu1QllqE0LpXdJGF7RCA0oLLXUP_SbKX-K-545i_UsEWJdoEnjYYcqFC8aswm0cN9aWLeRhd9pirIuNPba58GEI5l0PoHp7gHLeWazTsK01GrWjWD716YWreszfkB1uAWucUZMt6pfh-89hzwvwWklAQC2BXS37a0QV0U1FvBu2Rz_Wun9Hs-QAj4FKUw9lghN8Vj_Ij6ETqdon25eQqRutG7AWrJ3QcfUVYAhNkUH6SSTOX8UDiX',
  },
]

const filteredEmployees = ref(employees)

const tableHeaders = [
  { title: 'NAME', key: 'name' },
  { title: 'ID', key: 'id' },
  { title: 'DEPARTMENT', key: 'department' },
  { title: 'LAST ACTIVITY', key: 'lastActivity' },
  { title: 'STATUS', key: 'status' },
]

const getDepartmentColor = (dept: string) => {
  const deptLower = dept.toLowerCase()
  if (deptLower === 'engineering') return 'secondary-container'
  if (deptLower === 'product') return 'tertiary-container'
  if (deptLower === 'sales') return 'secondary-container'
  if (deptLower === 'hr') return 'secondary-fixed'
  return 'surface-container'
}

const getStatusColor = (status: string) => {
  return status === 'Active' ? 'tertiary-fixed' : 'error-container'
}

const getStatusTextColor = (status: string) => {
  return status === 'Active' ? 'on-tertiary-fixed' : 'on-error-container'
}
</script>

<template>
  <div class="w-100">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-end mb-8 gap-4">
      <div>
        <h1 class="text-display font-weight-bold text-on-surface mb-2">Employee Directory</h1>
        <p class="text-body-md text-on-surface-variant">Manage organization personnel and their linked IT infrastructure.</p>
      </div>

      <!-- Department Filter -->
      <v-btn-group variant="outlined" color="outline" density="compact" class="bg-surface-container">
        <v-btn
          v-for="dept in departments"
          :key="dept"
          :color="selectedDepartment === dept ? 'primary' : 'on-surface-variant'"
          :variant="selectedDepartment === dept ? 'flat' : 'text'"
          :class="selectedDepartment === dept ? 'bg-surface-container-lowest' : ''"
          @click="selectedDepartment = dept"
        >
          {{ dept }}
        </v-btn>
      </v-btn-group>
    </div>

    <!-- Employee Cards Grid -->
    <v-row class="mb-8">
      <!-- Employee Cards -->
      <v-col v-for="employee in filteredEmployees" :key="employee.id" cols="12" sm="6" lg="4" class="d-flex">
        <v-card
          class="w-100 d-flex flex-column"
          :class="employee.status === 'Action Required' ? 'border-l-error' : ''"
          elevation="0"
          border
        >
          <!-- Card Header -->
          <div class="d-flex align-start justify-space-between px-6 py-6">
            <div class="d-flex align-center gap-4 flex-1">
              <v-avatar size="64" :image="employee.image" />
              <div class="flex-1">
                <h3 class="text-h3 font-weight-bold text-on-surface">{{ employee.name }}</h3>
                <v-chip
                  size="small"
                  :color="getDepartmentColor(employee.department)"
                  class="text-caption"
                >
                  {{ employee.department.toUpperCase() }}
                </v-chip>
              </div>
            </div>

            <!-- Alert or Menu Icon -->
            <v-icon
              v-if="employee.hasAlert"
              color="error"
              size="24"
              title="Requires Attention"
            >
              mdi-alert-circle
            </v-icon>
            <v-menu v-else>
              <template v-slot:activator="{ props: menuProps }">
                <v-icon v-bind="menuProps" color="on-surface-variant" size="24">
                  mdi-dots-vertical
                </v-icon>
              </template>
              <v-list>
                <v-list-item title="View Details" @click="() => {}" />
                <v-list-item title="Edit" @click="() => {}" />
                <v-list-item title="Delete" @click="() => {}" />
              </v-list>
            </v-menu>
          </div>

          <!-- Card Body -->
          <v-divider class="my-2" />

          <div class="px-6 py-4 flex-grow-1 d-flex flex-column justify-space-between">
            <!-- Assets Section -->
            <div>
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-body-sm text-on-surface-variant">Assigned Assets</span>
                <span class="font-weight-bold text-on-surface">{{ employee.assignedAssets }} Items</span>
              </div>

              <!-- Asset Icons -->
              <div class="d-flex gap-2 flex-wrap">
                <v-icon
                  v-for="(asset, idx) in employee.assets"
                  :key="idx"
                  size="24"
                  color="on-surface-variant"
                  :title="asset.title"
                  class="p-2 bg-surface-container rounded"
                >
                  {{ asset.icon }}
                </v-icon>
              </div>
            </div>

            <!-- View Details Button -->
            <v-btn
              variant="text"
              color="primary"
              class="justify-start mt-4 px-0 text-capitalize text-body-sm"
            >
              View Details
              <v-icon right size="18">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Add Employee Card -->
      <v-col cols="12" sm="6" lg="4">
        <v-card
          class="w-100 d-flex flex-column align-center justify-center"
          elevation="0"
          border
          style="min-height: 300px; border-style: dashed; cursor: pointer"
        >
          <v-icon size="48" color="on-surface-variant" class="mb-4">mdi-account-plus</v-icon>
          <h4 class="text-h3 font-weight-bold text-on-surface-variant mb-2">Add Employee</h4>
          <p class="text-body-sm text-on-surface-variant text-center">Onboard new organizational personnel</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Directory Overview Table -->
    <v-card elevation="0" border>
      <div class="px-6 py-4 d-flex justify-space-between align-center" style="border-bottom: 1px solid var(--v-outline-variant)">
        <h3 class="text-h3 font-weight-bold text-on-surface">Directory Overview</h3>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          prepend-icon="mdi-download"
          class="text-uppercase"
        >
          Export CSV
        </v-btn>
      </div>

      <v-table density="comfortable">
        <thead>
          <tr style="background-color: var(--v-surface-container-low)">
            <th v-for="header in tableHeaders" :key="header.key" class="text-uppercase text-on-surface-variant text-caption font-weight-bold">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees.slice(0, 3)" :key="employee.id">
            <td>
              <span :class="employee.status === 'Action Required' ? 'text-error font-weight-bold' : 'font-weight-bold'">
                {{ employee.name }}
              </span>
            </td>
            <td>
              <span class="text-on-surface-variant font-weight-medium">{{ employee.id }}</span>
            </td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.lastActivity }}</td>
            <td>
              <v-chip
                size="x-small"
                :color="getStatusColor(employee.status)"
                :text-color="getStatusTextColor(employee.status)"
                class="text-uppercase text-caption font-weight-bold"
              >
                {{ employee.status }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="px-6 py-4 d-flex justify-space-between align-center" style="border-top: 1px solid var(--v-outline-variant); background-color: var(--v-surface-container-low)">
        <p class="text-body-sm text-on-surface-variant">Showing 1-3 of 148 employees</p>
        <div class="d-flex gap-2">
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.border-l-error {
  border-left: 4px solid var(--v-error) !important;
}
</style>
