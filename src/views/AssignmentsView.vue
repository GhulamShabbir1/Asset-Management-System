<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateAssignmentModal from '@/components/modals/CreateAssignModal.vue'
import ServerPagination from '@/components/common/ServerPagination.vue'
import assignmentService, { type CheckoutPayload, type AssignmentRecord } from '@/services/assignmentService'

const assignments = ref<AssignmentRecord[]>([])
const isLoading = ref(false)
const showAssignmentModal = ref(false)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(15)
const totalPages = ref(1)
const totalAssignmentsCount = ref(0)

const fetchAssignmentsList = async () => {
  isLoading.value = true
  try {
    const response = await assignmentService.getAssignmentHistory()
    if (response && response.success && response.data) {
      const resData = response.data as any
      const list = Array.isArray(resData) ? resData : (resData.data || resData.list || [])
      
      assignments.value = list
      
      const meta = resData.meta || resData
      totalAssignmentsCount.value = meta.total || list.length
      totalPages.value = meta.last_page || meta.lastPage || 1
    }
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAssignmentsList()
})

const handleAssignmentSave = async (data: CheckoutPayload) => {
  try {
    await assignmentService.checkoutAsset(data)
    showAssignmentModal.value = false
    fetchAssignmentsList()
  } catch (error) {
    console.error('Failed to assign asset:', error)
  }
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    
    <div class="d-flex justify-start align-center mb-6 mt-6">
      <v-btn
        variant="outlined" size="small" prepend-icon="mdi-download" class="text-none font-weight-bold mr-3 rounded-md" elevation="0"
      >
        Export CSV
      </v-btn>
      <v-btn
        color="primary" variant="flat" size="small" prepend-icon="mdi-clipboard-account-outline" class="text-none font-weight-bold rounded-md" elevation="0"
        @click="showAssignmentModal = true"
      >
        Assign Asset
      </v-btn>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-medium-emphasis text-caption px-4" style="text-transform: uppercase;">Asset ID</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Employee ID</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Assign Date</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Return Date</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Status</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="5" class="text-center py-10">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="assignments.length === 0">
          <tr>
            <td colspan="5" class="text-center py-8 text-medium-emphasis text-body-2">
              No assignments found.
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="item in assignments" :key="item.assignment_id">
            <td class="font-weight-bold text-caption px-4">{{ item.asset_id }}</td>
            <td class="text-body-2 font-weight-medium">{{ item.employee_id }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ formatDate(item.assign_date) }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ formatDate(item.return_date) }}</td>
            <td>
              <v-chip size="small" variant="tonal" :color="item.is_active ? 'blue-darken-2' : 'grey-darken-2'" class="font-weight-bold text-uppercase">
                {{ item.is_active ? 'Active' : 'Returned' }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <ServerPagination
        v-if="totalPages > 1 || assignments.length > 0"
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :total-pages="totalPages"
        :total-items="totalAssignmentsCount"
        @change="fetchAssignmentsList"
      />
    </v-card>
  </v-container>

  <CreateAssignmentModal v-model="showAssignmentModal" @submit="handleAssignmentSave" />
</template>
