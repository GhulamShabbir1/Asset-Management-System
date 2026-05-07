<script setup lang="ts">
import { computed, ref } from 'vue'
import CreateAssignmentModal from '@/components/modals/CreateAssignModal.vue'
import CreateAssetModal from '@/components/modals/CreateAssetModal.vue'

type AssetRow = {
  id: string
  category: string
  model: string
  status: string
  statusColor: string
  statusBg: string
  custodian: null | {
    name: string
    initials: string
    color: string
  }
}

const showAssignmentModal = ref(false)
const showAssetModal = ref(false)

const filters = ['All', 'Available', 'Assigned', 'Maintenance']
const activeFilter = ref('All')

const assets: AssetRow[] = [
  {
    id: 'AST-99201',
    category: 'IT Hardware',
    model: 'MacBook Pro 16" (M3 Max)',
    status: 'AVAILABLE',
    statusColor: 'primary',
    statusBg: 'primary-light',
    custodian: null,
  },
  {
    id: 'AST-88124',
    category: 'IT Hardware',
    model: 'Dell UltraSharp 32" 4K',
    status: 'ASSIGNED',
    statusColor: 'blue-darken-2',
    statusBg: 'blue-lighten-5',
    custodian: { name: 'Sarah Henderson', initials: 'SH', color: 'blue-grey' },
  },
  {
    id: 'AST-44290',
    category: 'Furniture',
    model: 'Herman Miller Aeron (Size B)',
    status: 'MAINTENANCE',
    statusColor: 'error',
    statusBg: 'red-lighten-5',
    custodian: null,
  },
  {
    id: 'AST-77103',
    category: 'IT Hardware',
    model: 'iPhone 15 Pro Max 512GB',
    status: 'ASSIGNED',
    statusColor: 'blue-darken-2',
    statusBg: 'blue-lighten-5',
    custodian: { name: 'Marcus Knight', initials: 'MK', color: 'success' },
  },
  {
    id: 'AST-33019',
    category: 'Kitchenware',
    model: 'Commercial Espresso Machine',
    status: 'AVAILABLE',
    statusColor: 'primary',
    statusBg: 'primary-light',
    custodian: null,
  },
]

const summaryCards = [
  {
    title: 'STOCK ALERTS',
    value: '12 items',
    subtitle: 'Below critical threshold',
    icon: 'mdi-alert-outline',
    iconColor: 'error',
    bg: 'bg-red-lighten-5',
    btnText: 'View Details',
  },
  {
    title: 'UPCOMING MAINTENANCE',
    value: '08 items',
    subtitle: 'Scheduled for next 7 days',
    icon: 'mdi-cog-outline',
    iconColor: 'blue-grey-darken-2',
    bg: 'bg-blue-grey-lighten-5',
    btnText: 'Open Schedule',
  },
  {
    title: 'ASSET VALUE',
    value: '$428,500',
    subtitle: 'Total depreciated value',
    icon: 'mdi-cash-multiple',
    iconColor: 'primary',
    bg: 'bg-primary-light',
    btnText: 'Financial Report',
  },
]

const filteredAssets = computed(() => {
  if (activeFilter.value === 'All') {
    return assets
  }

  return assets.filter((asset) => asset.status === activeFilter.value.toUpperCase())
})

const handleAssignmentSave = (data: unknown) => {
  console.log('Assignment Saved:', data)
}

const handleAssetSave = (data: unknown) => {
  console.log('New Asset Saved:', data)
}

const editAsset = (id: string) => {
  console.log('Edit asset:', id)
}

const deleteAsset = (id: string) => {
  console.log('Delete asset:', id)
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-space-between align-end mb-2">
      <div>
        <h1 class="text-h5 font-weight-bold mb-0" style="line-height: 1.1;">Assets</h1>
        <p class="text-caption text-medium-emphasis mt-n1">
          Manage and track enterprise hardware across all departments.
        </p>
      </div>

      <div class="d-flex align-center pb-1">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-clipboard-account-outline"
          class="text-none font-weight-bold mr-3 rounded-md"
          elevation="0"
          @click="showAssignmentModal = true"
        >
          Add Assignment
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          class="text-none font-weight-bold rounded-md"
          elevation="0"
          @click="showAssetModal = true"
        >
          Add Asset
        </v-btn>
      </div>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <div class="d-flex align-center justify-space-between pa-4 border-b">
        <div class="d-flex align-center">
          <v-chip
            v-for="filter in filters"
            :key="filter"
            :color="activeFilter === filter ? 'primary' : 'grey-lighten-4'"
            :class="[
              'mr-2 cursor-pointer',
              activeFilter === filter
                ? 'text-white font-weight-bold'
                : 'text-medium-emphasis font-weight-medium',
            ]"
            variant="flat"
            size="small"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </v-chip>
        </div>

        <div class="d-flex text-right align-center">
          <div class="pr-5 mr-5 border-e">
            <div
              class="text-medium-emphasis font-weight-bold mb-1"
              style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;"
            >
              Total Assets
            </div>
            <div class="text-h6 font-weight-bold" style="line-height: 1;">1,248</div>
          </div>
          <div>
            <div
              class="text-medium-emphasis font-weight-bold mb-1"
              style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;"
            >
              Utilization
            </div>
            <div class="text-h6 font-weight-bold text-primary" style="line-height: 1;">92.4%</div>
          </div>
        </div>
      </div>

      <v-table hover>
        <thead>
          <tr>
            <th style="width: 50px;" class="px-4">
              <v-checkbox-btn density="compact" color="primary" />
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Asset ID
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Category
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Model
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Status
            </th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">
              Custodian
            </th>
            <th
              class="font-weight-bold text-medium-emphasis text-caption text-right"
              style="text-transform: uppercase;"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="filteredAssets.length === 0">
          <tr>
            <td colspan="7" class="text-center py-6 text-medium-emphasis text-caption">
              No assets found for this filter.
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="item in filteredAssets" :key="item.id">
            <td class="px-4">
              <v-checkbox-btn density="compact" color="primary" />
            </td>
            <td class="font-weight-bold text-caption">{{ item.id }}</td>
            <td class="text-body-2">{{ item.category }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.model }}</td>
            <td>
              <v-chip
                size="small"
                variant="flat"
                :color="item.statusBg"
                :class="[`text-${item.statusColor}`, 'font-weight-bold']"
              >
                {{ item.status }}
              </v-chip>
            </td>
            <td>
              <div v-if="item.custodian" class="d-flex align-center">
                <v-avatar
                  size="24"
                  :color="item.custodian.color"
                  class="mr-2 text-white text-caption font-weight-bold"
                >
                  {{ item.custodian.initials }}
                </v-avatar>
                <span class="text-body-2">{{ item.custodian.name }}</span>
              </div>
              <span v-else class="text-medium-emphasis">-</span>
            </td>

            <td class="text-right" style="min-width: 100px;">
              <v-tooltip text="Edit Asset" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-pencil-outline"
                    variant="text"
                    size="small"
                    color="primary"
                    class="mr-1"
                    @click="editAsset(item.id)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Asset" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-trash-can-outline"
                    variant="text"
                    size="small"
                    color="error"
                    @click="deleteAsset(item.id)"
                  />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-space-between align-center pa-3 border-t bg-grey-lighten-4">
        <span class="text-caption text-medium-emphasis font-weight-medium">
          Showing 1-10 of 1,248 assets
        </span>
        <div class="d-flex align-center">
          <v-btn icon="mdi-chevron-left" variant="text" size="small" class="mr-1" disabled />
          <v-btn
            variant="flat"
            color="black"
            size="x-small"
            class="font-weight-bold mx-1 rounded-sm"
            style="min-width: 24px; height: 24px;"
          >
            1
          </v-btn>
          <v-btn
            variant="text"
            color="black"
            size="x-small"
            class="font-weight-bold mx-1 rounded-sm"
            style="min-width: 24px; height: 24px;"
          >
            2
          </v-btn>
          <v-btn
            variant="text"
            color="black"
            size="x-small"
            class="font-weight-bold mx-1 rounded-sm"
            style="min-width: 24px; height: 24px;"
          >
            3
          </v-btn>
          <span class="text-caption mx-2">...</span>
          <v-btn
            variant="text"
            color="black"
            size="x-small"
            class="font-weight-bold mx-1 rounded-sm"
            style="min-width: 24px; height: 24px;"
          >
            125
          </v-btn>
          <v-btn icon="mdi-chevron-right" variant="text" size="small" class="ml-1" />
        </div>
      </div>
    </v-card>

    <v-row>
      <v-col v-for="(card, index) in summaryCards" :key="index" cols="12" md="4">
        <v-card elevation="0" border class="rounded-lg h-100 d-flex flex-column">
          <v-card-text class="pa-4 flex-grow-1">
            <div
              class="text-medium-emphasis font-weight-bold mb-3"
              style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;"
            >
              {{ card.title }}
            </div>
            <div class="d-flex align-center">
              <v-avatar :class="['rounded-md mr-4', card.bg]" size="48">
                <v-icon :color="card.iconColor" size="24">{{ card.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold" style="line-height: 1.2;">{{ card.value }}</div>
                <div class="text-caption text-medium-emphasis mt-1">{{ card.subtitle }}</div>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-btn
            block
            variant="text"
            color="black"
            class="text-none font-weight-bold text-caption rounded-0 py-3"
            style="height: auto;"
          >
            {{ card.btnText }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <CreateAssignmentModal v-model="showAssignmentModal" @submit="handleAssignmentSave" />
  <CreateAssetModal v-model="showAssetModal" @submit="handleAssetSave" />
</template>
