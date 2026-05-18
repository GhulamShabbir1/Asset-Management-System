<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import CreateEmployeeModal from '@/components/modals/CreateEmployeeModal.vue'
import ServerPagination from '@/components/common/ServerPagination.vue'
import * as employeeService from '@/services/employeeService'
import type { CreateEmployeePayload } from '@/services/employeeService'
import { getAllDepartments } from '@/services/departmentService'
import type { Department } from '@/services/departmentService'

// Employee interface matching API response
interface Employee {
  id: string | number
  name: string
  father_name?: string
  email?: string
  contact_info?: string
  department?: string
  department_id?: number
  address?: string
  designation?: string
  joining_date?: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  lastActivity?: string
  role?: 'Administrator' | 'Manager' | 'Regular User'
  image?: string
  hasAlert?: boolean
}

// UI state
const searchQuery = ref('')
const selectedDepartment = ref('All Departments')
const selectedStatus = ref('All Statuses')
const selectedRole = ref('All Roles')
const filterMenu = ref(false)
const createEmployeeDialog = ref(false)

// Data state
const employees = ref<Employee[]>([])
const departments = ref<Department[]>([])
const departmentMap = ref<Record<number, string>>({})

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalPages = ref(1)
const totalEmployeesCount = ref(0)

// Loading and error states
const isLoading = ref(false)
const isLoadingDepartments = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Delete confirmation state
const deleteConfirmDialog = ref(false)
const employeeToDelete = ref<Employee | null>(null)
const isDeleting = ref(false)

// Edit state
const editingEmployee = ref<(CreateEmployeePayload & { id?: number | string }) | undefined>()

const statuses = ['All Statuses', 'active', 'inactive', 'on_leave']
const roles = ['All Roles', 'Administrator', 'Manager', 'Regular User']

const headers = [
  { title: 'Name', key: 'name', sortable: false, align: 'start' },
  { title: 'Employee ID', key: 'id', sortable: false },
  { title: 'Department', key: 'department', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

// Computed dynamic department list
const departmentList = computed(() => {
  return ['All Departments', ...departments.value.map(d => d.department_name)]
})

// Map employee status to display status
const mapStatus = (status: string): Employee['status'] => {
  if (status === 'active' || status === 'Active') return 'active'
  if (status === 'inactive' || status === 'Inactive') return 'inactive'
  if (status === 'on_leave' || status === 'Action Required') return 'on_leave'
  return 'active'
}

// Filter employees based on search and filters
const filteredEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return employees.value.filter((employee) => {
    const matchesSearch =
      query.length === 0 ||
      employee.name.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      String(employee.id).toLowerCase().includes(query)

    const matchesDepartment =
      selectedDepartment.value === 'All Departments' ||
      employee.department === selectedDepartment.value

    const matchesStatus =
      selectedStatus.value === 'All Statuses' ||
      mapStatus(employee.status) === selectedStatus.value

    const matchesRole = selectedRole.value === 'All Roles' ||
      employee.role === selectedRole.value

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole
  })
})

// Get department color for chips
const getDepartmentColor = (department: string) => {
  const normalized = department?.toLowerCase() || 'grey'
  if (normalized === 'engineering') return 'blue-darken-1'
  if (normalized === 'product') return 'grey-darken-3'
  if (normalized === 'sales') return 'deep-purple-darken-1'
  if (normalized === 'hr') return 'teal-darken-1'
  return 'grey'
}

// Get status color
const getStatusColor = (status: string) => {
  const normalized = status?.toLowerCase() || 'active'
  if (normalized === 'active') return 'success'
  if (normalized === 'inactive') return 'grey-darken-1'
  if (normalized === 'on_leave') return 'warning'
  return 'grey'
}

// Format status for display
const formatStatus = (status: string) => {
  if (status === 'active') return 'Active'
  if (status === 'inactive') return 'Inactive'
  if (status === 'on_leave') return 'On Leave'
  return status
}

const escapeCsvValue = (value: unknown) => {
  const normalized = value == null ? '' : String(value)
  return `"${normalized.replace(/"/g, '""')}"`
}

const exportEmployeesToCsv = () => {
  const csvRows = [
    ['Name', 'Employee ID', 'Department', 'Email', 'Status'],
    ...filteredEmployees.value.map(employee => [
      employee.name,
      employee.id,
      employee.department || 'N/A',
      employee.email || employee.contact_info || '-',
      formatStatus(employee.status),
    ]),
  ]

  const csvContent = csvRows.map(row => row.map(escapeCsvValue).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(downloadUrl)
}

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    isLoadingDepartments.value = true
    const response = await getAllDepartments()
    if (response?.data) {
      departments.value = Array.isArray(response.data)
        ? response.data
        : response.data.data || []
      
      // Create department map for quick lookup
      departmentMap.value = {}
      departments.value.forEach((dept: any) => {
        departmentMap.value[dept.id] = dept.department_name || dept.name || 'Unknown'
      })
    }
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoadingDepartments.value = false
  }
}

// Fetch employees from API
const fetchEmployees = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Pass pagination params to the API
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value
    }
    const response = await employeeService.getEmployees(params)
    
    if (response?.data) {
      const resData = response.data as any
      const employeeList = Array.isArray(resData) ? resData : resData.data || resData
      
      // Update pagination info
      const meta = resData.meta || resData
      totalEmployeesCount.value = meta.total || employeeList.length
      totalPages.value = meta.last_page || meta.lastPage || 1

      employees.value = employeeList.map((emp: any) => {
        const employeeId = emp.employee_id || emp.id || emp.emp_id
        
        // Handle department mapping whether it comes as an embedded object or just an ID
        const departmentName = emp.department?.department_name 
                            || emp.department?.name 
                            || emp.department 
                            || departmentMap.value[emp.department_id] 
                            || 'Unknown'

        return {
          id: employeeId,
          name: emp.name,
          father_name: emp.father_name,
          email: emp.email,
          contact_info: emp.contact_info,
          department: departmentName,
          department_id: emp.department?.id || emp.department_id,
          address: emp.address,
          designation: emp.designation,
          joining_date: emp.joining_date,
          salary: emp.salary,
          status: emp.status,
          lastActivity: new Date().toLocaleString(),
          role: 'Regular User',
          image: emp.image,
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch employees:', error)
    errorMessage.value = 'Failed to load employees. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedDepartment.value = 'All Departments'
  selectedStatus.value = 'All Statuses'
  selectedRole.value = 'All Roles'
}

// Handle create employee
const handleCreateEmployee = async (data: CreateEmployeePayload) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    if (editingEmployee.value?.id) {
      // Update existing employee
      await employeeService.updateEmployee(editingEmployee.value.id, data)
      successMessage.value = 'Employee updated successfully!'
      editingEmployee.value = undefined
    } else {
      // Create new employee
      await employeeService.createEmployee(data)
      successMessage.value = 'Employee created successfully!'
    }

    // Refresh employee list
    await fetchEmployees()
    createEmployeeDialog.value = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save employee:', error)
    errorMessage.value = 'Failed to save employee. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Open create employee dialog
const openCreateDialog = () => {
  editingEmployee.value = undefined
  createEmployeeDialog.value = true
}

// Open edit employee dialog
const openEditDialog = (employee: Employee) => {
  // Get the proper ID (handle different field names from backend)
  const employeeId = employee.employee_id || employee.id || employee.emp_id
  
  editingEmployee.value = {
    name: employee.name,
    father_name: employee.father_name,
    contact_info: employee.contact_info,
    email: employee.email,
    address: employee.address,
    designation: employee.designation,
    joining_date: employee.joining_date,
    salary: employee.salary,
    status: employee.status,
    department_id: employee.department_id || 0,
    id: employeeId,
  }
  createEmployeeDialog.value = true
}

// Open delete confirmation dialog
const openDeleteConfirm = (employee: Employee) => {
  employeeToDelete.value = employee
  deleteConfirmDialog.value = true
}

// Confirm and delete employee
const confirmDelete = async () => {
  if (!employeeToDelete.value) return

  try {
    isDeleting.value = true
    errorMessage.value = ''

    // Get the proper employee ID (handle different field names)
    const employeeId = employeeToDelete.value.employee_id || employeeToDelete.value.id || employeeToDelete.value.emp_id
    
    if (!employeeId || employeeId === 'undefined') {
      throw new Error('Invalid employee ID. Employee may not have been properly loaded.')
    }

    await employeeService.deleteEmployee(employeeId)
    
    successMessage.value = 'Employee deleted successfully!'
    
    // Remove from local list
    employees.value = employees.value.filter(
      emp => {
        const empId = emp.employee_id || emp.id || emp.emp_id
        const deleteId = employeeToDelete.value?.employee_id || employeeToDelete.value?.id || employeeToDelete.value?.emp_id
        return empId !== deleteId
      }
    )

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Failed to delete employee. Please try again.'
  } finally {
    isDeleting.value = false
    deleteConfirmDialog.value = false
    employeeToDelete.value = null
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch departments first, then employees
  await fetchDepartments()
  await fetchEmployees()
})
</script>

<template>
  <div class="w-100">
    <v-alert 
      v-if="successMessage" 
      type="success" 
      variant="tonal" 
      class="mb-4"
      closable
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>

    <v-alert 
      v-if="errorMessage" 
      type="error" 
      variant="tonal" 
      class="mb-4"
      closable
      @click:close="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <v-card outlined flat class="d-flex align-center pa-3 ga-4 flex-nowrap mb-4">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by name, email, or employee ID..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="flex-grow-0"
        style="width: 350px"
      />

      <v-menu v-model="filterMenu" location="bottom end" :offset="8" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            class="text-none font-weight-semibold"
            prepend-icon="mdi-filter-variant"
          >
            Filters
          </v-btn>
        </template>

        <v-card min-width="320" class="pa-4" elevation="8">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-2 font-weight-bold">Filters</div>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-restart-alt"
              class="text-none"
              @click="resetFilters"
            >
              Reset
            </v-btn>
          </div>

          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">Department</div>
              <v-select
                v-model="selectedDepartment"
                :items="departmentList"
                variant="outlined"
                density="compact"
                hide-details
                :loading="isLoadingDepartments"
              />
            </div>

            <div>
              <div class="text-caption text-medium-emphasis mb-1">Status</div>
              <v-select
                v-model="selectedStatus"
                :items="statuses"
                variant="outlined"
                density="compact"
                hide-details
              />
            </div>

            <div>
              <div class="text-caption text-medium-emphasis mb-1">User Wise Filter</div>
              <v-select
                v-model="selectedRole"
                :items="roles"
                variant="outlined"
                density="compact"
                hide-details
              />
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex justify-end ga-2">
            <v-btn variant="text" class="text-none" @click="filterMenu = false">Close</v-btn>
            <v-btn color="primary" variant="flat" class="text-none" @click="filterMenu = false">
              Apply
            </v-btn>
          </div>
        </v-card>
      </v-menu>

      <v-spacer />

      <div class="d-flex align-center ga-3">
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-account-plus"
          class="text-none font-weight-bold rounded-md text-white"
          elevation="0"
          @click="openCreateDialog"
        >
          Add Employee
        </v-btn>

        <v-btn
          variant="outlined"
          size="small"
          prepend-icon="mdi-download"
          class="text-none font-weight-bold rounded-md"
          elevation="0"
          @click="exportEmployeesToCsv"
        >
          Export CSV
        </v-btn>
      </div>
    </v-card>

    <v-card v-if="isLoading" border elevation="0" class="pa-4">
      <div class="d-flex align-center justify-center" style="height: 400px">
        <div class="text-center">
          <v-progress-circular indeterminate color="primary" class="mb-4" />
          <div class="text-body-2">Loading employees...</div>
        </div>
      </div>
    </v-card>

    <v-card v-else border elevation="0">
      <v-data-table
        :headers="headers"
        :items="filteredEmployees"
        item-value="id"
        density="comfortable"
        :items-per-page="itemsPerPage"
        class="table-with-scroll"
        :loading="isLoading"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2" :class="item.image ? 'ga-3' : ''">
            <v-avatar v-if="item.image" :image="item.image" size="40" />
            <div>
              <div class="text-body-md font-weight-bold text-on-surface">{{ item.name }}</div>
              <div class="text-caption text-on-surface-variant">{{ item.email || item.contact_info }}</div>
            </div>
          </div>
        </template>

        <template #item.id="{ item }">
          <div class="text-caption">{{ item.id }}</div>
        </template>

        <template #item.department="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="getDepartmentColor(item.department || '')"
            class="text-caption font-weight-bold"
            label
          >
            {{ item.department?.toUpperCase() || 'N/A' }}
          </v-chip>
        </template>

        <template #item.email="{ item }">
          <div class="text-caption">{{ item.email || item.contact_info || '-' }}</div>
        </template>

        <template #item.status="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="getStatusColor(item.status)"
            class="text-caption text-uppercase font-weight-bold"
            label
          >
            {{ formatStatus(item.status) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end align-center ga-1">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="openEditDialog(item)"
              title="Edit employee"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="openDeleteConfirm(item)"
              title="Delete employee"
            />
          </div>
        </template>

        <template #bottom>
          <div v-if="filteredEmployees.length === 0" class="d-flex align-center justify-center pa-8">
            <div class="text-center">
              <v-icon size="48" class="mb-4 text-medium-emphasis">mdi-folder-open</v-icon>
              <div class="text-body-2 text-medium-emphasis">No employees found</div>
            </div>
          </div>
          <ServerPagination
            v-else
            v-model:current-page="currentPage"
            v-model:items-per-page="itemsPerPage"
            :total-pages="totalPages"
            :total-items="totalEmployeesCount"
            @change="fetchEmployees"
          />
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteConfirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete <strong>{{ employeeToDelete?.name }}</strong>? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey-darken-1" variant="text" @click="deleteConfirmDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="isDeleting" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CreateEmployeeModal 
      v-model="createEmployeeDialog" 
      :editing-employee="editingEmployee"
      @submit="handleCreateEmployee" 
    />
  </div>
</template>

<style scoped>
.table-with-scroll {
  display: flex;
  flex-direction: column;
}

.table-with-scroll ::v-deep .v-table__wrapper {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
}

.table-with-scroll ::v-deep .v-table__wrapper::-webkit-scrollbar {
  width: 8px;
}

.table-with-scroll ::v-deep .v-table__wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.table-with-scroll ::v-deep .v-table__wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.table-with-scroll ::v-deep .v-table__wrapper::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.table-with-scroll ::v-deep .v-data-table__footer {
  flex-shrink: 0;
}
</style>
