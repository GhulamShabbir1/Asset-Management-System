<script setup lang="ts">
import { computed, ref } from 'vue'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  lastActivity: string
  status: 'Active' | 'Inactive' | 'Action Required'
  role: 'Administrator' | 'Manager' | 'Regular User'
  image: string
  hasAlert?: boolean
}

const searchQuery = ref('')
const selectedDepartment = ref('All Departments')
const selectedStatus = ref('All Statuses')
const selectedRole = ref('All Roles')
const selectedRows = ref<Employee[]>([])

const departments = ['All Departments', 'Engineering', 'Product', 'Sales', 'HR']
const statuses = ['All Statuses', 'Active', 'Inactive', 'Action Required']
const roles = ['All Roles', 'Administrator', 'Manager', 'Regular User']

const headers = [
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Employee ID', key: 'id', sortable: false },
  { title: 'Department', key: 'department', sortable: false },
  { title: 'Last Activity', key: 'lastActivity', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const employees: Employee[] = [
  {
    id: 'EMP-2024-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    department: 'Engineering',
    lastActivity: '2 hours ago',
    status: 'Active',
    role: 'Manager',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBapFrXGhtWu3i0xnGOOZRa-MsI-MLgXkLHdqeR0H8hX3V7VaEHqLXQXeYoQIAbL1oz6wblgrD2RX_OEd-xCvS6FxZMWWI85Zkh_YR6oUbNJ0vOaPP6J0tqf7YWNXyH6EkTwp7nIAyd7HR8_D5YL09ueQek_RA37XIyW1FkF_AbyPCr8QC4PNbdOGAtA0U3aSvZACp4qgXoTpy9WRa6UDKxn_10qUx2Y2iZAKCi2pzb9NAWqzH5G-GK8roZ-xs177DOV2HEdExp2aJ',
  },
  {
    id: 'EMP-2024-045',
    name: 'Marcus Thorne',
    email: 'm.thorne@company.com',
    department: 'Product',
    lastActivity: 'Yesterday',
    status: 'Active',
    role: 'Regular User',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhOlSjmxWo1Wqv5NaUEt8pZpVFj66rGMrhg87tPvFunZKLytIw5zfH_R-03LVzpsPSPe_nwNHJVGMeFx7lB8f5YiJbUsDa-Hmewf13P0qEJPqBjp5B2-IAuPHU1MiAdo6OUuDkX8rNwzjkxsnztgQ3PgiXKYCIXypJ4zmeCZYvA7-fgBrAIjAkepy0wUOnItXvJHeh0Xhhhvb-b0_xjSWbhcfvn5oqBu4bvb-v7i7dY8YUvifWNWzgZfMk4fHeP-vB42kzNWckgSKF',
  },
  {
    id: 'EMP-2023-112',
    name: 'Elena Rodriguez',
    email: 'elena.r@company.com',
    department: 'HR',
    lastActivity: '5 days ago',
    status: 'Action Required',
    role: 'Administrator',
    hasAlert: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXcjJh6-HidYMOeQDQTLzfz5327iuJ4LyB-qmAlngfqkcvGWf1tiSa7T4CC_wJJWLto0nTBTY-MYhwN5uGGLnkGo0hT8wXaIJDfkWzvKUwAVO86eVZLtGQiD-G8UHSpj3IdJnJYY4PN2fb1okOhyBz-bzpli0zLAvFvPyJ6ZoDphgNnDGZPGtHCdYuZp13EtADrPY-NE0ZA43cVrI7p9echXXXuRzq_a_uXQ7VqIyYd96h3H8a7L96Bbnsgcx_NRzeIM8Bd-zM2Io',
  },
  {
    id: 'EMP-2024-102',
    name: 'David Chen',
    email: 'd.chen@company.com',
    department: 'Sales',
    lastActivity: '1 month ago',
    status: 'Inactive',
    role: 'Manager',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRzmh0W0QFsBZTmPRZAuK1YacRyJ4G2nlcUl8iXBApKdWayG7fBe__tC6vJyl_-BM54NTbfZkVEW9Emzsq9WVHpZIzfMQPyaZbbQqb8LCupCkCiw3O47IRQqn1AvJH7CE_lzPEe2pTPpI9uHsRSCFvX8k5jCDYfTy4BC7VnkoPnqqdHb2inLTwD_fzkDADUeGc7hPQ7IY6T43STEEHOB9qr8y8gUJXlbzQZd-lNQDhOtyktRWc5WnCE0b-C4D7GaW6gCE0B7sgv5Tp',
  },
  {
    id: 'EMP-2024-089',
    name: 'Sophie Muller',
    email: 's.muller@company.com',
    department: 'Engineering',
    lastActivity: '4 hours ago',
    status: 'Active',
    role: 'Regular User',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVaUVS_XdKcsnjDhtyD8vSfc8Fu1QllqE0LpXdJGF7RCA0oLLXUP_SbKX-K-545i_UsEWJdoEnjYYcqFC8aswm0cN9aWLeRhd9pirIuNPba58GEI5l0PoHp7gHLeWazTsK01GrWjWD716YWreszfkB1uAWucUZMt6pfh-89hzwvwWklAQC2BXS37a0QV0U1FvBu2Rz_Wun9Hs-QAj4FKUw9lghN8Vj_Ij6ETqdon25eQqRutG7AWrJ3QcfUVYAhNkUH6SSTOX8UDiX',
  },
]

const filteredEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return employees.filter((employee) => {
    const matchesSearch =
      query.length === 0 ||
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.id.toLowerCase().includes(query)

    const matchesDepartment =
      selectedDepartment.value === 'All Departments' || employee.department === selectedDepartment.value

    const matchesStatus =
      selectedStatus.value === 'All Statuses' || employee.status === selectedStatus.value

    const matchesRole = selectedRole.value === 'All Roles' || employee.role === selectedRole.value

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole
  })
})

const getDepartmentColor = (department: string) => {
  const normalized = department.toLowerCase()
  if (normalized === 'engineering') return 'blue-darken-1'
  if (normalized === 'product') return 'grey-darken-3'
  if (normalized === 'sales') return 'deep-purple-darken-1'
  if (normalized === 'hr') return 'teal-darken-1'
  return 'grey'
}

const getStatusColor = (status: Employee['status']) => {
  if (status === 'Active') return 'success'
  if (status === 'Inactive') return 'grey-darken-1'
  return 'error' 
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDepartment.value = 'All Departments'
  selectedStatus.value = 'All Statuses'
  selectedRole.value = 'All Roles'
}
</script>

<template>
  <div class="w-100">
    
    <div class="mb-6">
      <div class="d-flex justify-space-between align-center flex-wrap ga-4 mb-2">
        <h1 class="text-display font-weight-bold text-on-surface mb-0">
          Employee Directory
        </h1>

        <div class="d-flex align-center ga-3">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-account-plus"
            class="text-none font-weight-bold mr-3 rounded-md text-white"
            elevation="0"
          >
            Add Employee
          </v-btn>

          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-download"
            class="text-none font-weight-bold rounded-md"
            elevation="0"
          >
            Export CSV
          </v-btn>
        </div>
      </div>
      
      <p class="text-body-md text-on-surface-variant">
        Manage organization personnel and their linked IT infrastructure.
      </p>
    </div>

    <v-card outlined flat class="d-flex align-center pa-3 ga-4 flex-nowrap mb-4">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by name, email, or employee ID..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="flex-grow-1"
        style="max-width: 350px"
      />

      <div class="d-flex align-center ga-2">
        <span class="text-body-2 text-medium-emphasis mr-2">Department:</span>
        <v-select
          v-model="selectedDepartment"
          :items="departments"
          variant="outlined"
          density="compact"
          hide-details
          style="width: 160px"
        />
      </div>

      <div class="d-flex align-center ga-2">
        <span class="text-body-2 text-medium-emphasis mr-2">Status:</span>
        <v-select
          v-model="selectedStatus"
          :items="statuses"
          variant="outlined"
          density="compact"
          hide-details
          style="width: 160px"
        />
      </div>

      <div class="d-flex align-center ga-2">
        <span class="text-body-2 text-medium-emphasis mr-2">User Wise Filter:</span>
        <v-select
          v-model="selectedRole"
          :items="roles"
          variant="outlined"
          density="compact"
          hide-details
          style="width: 160px"
        />
      </div>

      <v-btn icon="mdi-restart-alt" variant="text" size="small" @click="resetFilters" />
    </v-card>

    <v-card border elevation="0">
      <v-data-table
        v-model="selectedRows"
        :headers="headers"
        :items="filteredEmployees"
        item-value="id"
        show-select
        density="comfortable"
        :items-per-page="20"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center ga-3 py-2">
            <v-avatar :image="item.image" size="40" />
            <div>
              <div class="text-body-md font-weight-bold text-on-surface">{{ item.name }}</div>
              <div class="text-caption text-on-surface-variant">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template #item.department="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="getDepartmentColor(item.department)"
            class="text-caption font-weight-bold"
            label
          >
            {{ item.department.toUpperCase() }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="getStatusColor(item.status)"
            class="text-caption text-uppercase font-weight-bold"
            label
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end align-center ga-1">
            <v-btn
              v-if="item.hasAlert"
              icon="mdi-alert-circle-outline"
              variant="text"
              size="small"
              color="error"
            />
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" />
              </template>
              <v-list density="compact">
                <v-list-item title="View Details" />
                <v-list-item title="Edit" />
                <v-list-item title="Delete" />
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style scoped>
</style>