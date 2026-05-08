<template>
  <v-container max-width="1600" class="py-4 bg-background" fluid>
    
    <v-row class="mb-4 align-end">
      <v-col cols="12" md="8">
        <h1 class="text-h5 font-weight-bold text-high-emphasis mb-0" style="line-height: 1.1;">System Reports</h1>
        <p class="text-caption text-medium-emphasis mt-1">
          Comprehensive analytics, employee assignments, and lifecycle tracking.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-md-end gap-4">
        <v-btn variant="outlined" prepend-icon="mdi-download" size="large" rounded="lg">
          Export Data
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-file-document-multiple" size="large" rounded="lg">
          Generate All
        </v-btn>
      </v-col>
    </v-row>

    <v-card variant="outlined" class="mb-8" rounded="xl" border>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.dateRange"
              :items="['Last 30 Days', 'This Quarter', 'Year to Date', 'All Time']"
              label="Timeframe"
              prepend-inner-icon="mdi-calendar"
              variant="underlined"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.department"
              :items="['All Departments', 'IT', 'HR', 'Engineering', 'Sales', 'Design']"
              label="Department"
              prepend-inner-icon="mdi-domain"
              variant="underlined"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.category"
              :items="['All Categories', 'Computing', 'Mobile Devices', 'Furniture', 'Networking']"
              label="Asset Category"
              prepend-inner-icon="mdi-shape"
              variant="underlined"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filters.status"
              :items="['All Statuses', 'Active', 'Unassigned', 'In Repair', 'Retired']"
              label="Asset Status"
              prepend-inner-icon="mdi-check-circle-outline"
              variant="underlined"
              hide-details
              color="primary"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex flex-column justify-space-between fill-height" rounded="xl" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="primary" variant="tonal" rounded>
              <v-icon icon="mdi-laptop-mac"></v-icon>
            </v-avatar>
            <v-chip size="small" color="success" prepend-icon="mdi-trending-up" class="font-weight-bold">
              +4.2%
            </v-chip>
          </div>
          <div>
            <div class="text-medium-emphasis mb-1" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Total Assets</div>
            <div class="text-h5 font-weight-black text-high-emphasis">1,245</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex flex-column justify-space-between fill-height" rounded="xl" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="primary" variant="tonal" rounded>
              <v-icon icon="mdi-account-group"></v-icon>
            </v-avatar>
            <v-chip size="small" color="grey-darken-1" prepend-icon="mdi-minus" class="font-weight-bold">
              Steady
            </v-chip>
          </div>
          <div>
            <div class="text-medium-emphasis mb-1" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Active Employees</div>
            <div class="text-h5 font-weight-black text-high-emphasis">480</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex flex-column justify-space-between fill-height" rounded="xl" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-4">
            <v-avatar color="primary" variant="tonal" rounded>
              <v-icon icon="mdi-package-variant-closed"></v-icon>
            </v-avatar>
            <v-chip size="small" color="warning" prepend-icon="mdi-alert-circle-outline" class="font-weight-bold">
              Requires Action
            </v-chip>
          </div>
          <div>
            <div class="text-medium-emphasis mb-1" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Unassigned Assets</div>
            <div class="text-h5 font-weight-black text-high-emphasis">112</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <v-col cols="12" lg="7">
        <v-card class="pa-4 fill-height" rounded="xl" elevation="0" border>
          <div class="d-flex justify-space-between align-center mb-6">
            <h4 class="text-body-1 font-weight-bold">Asset Distribution by Category</h4>
            <v-btn variant="text" color="primary" size="small" class="text-caption font-weight-bold">VIEW FULL DATA</v-btn>
          </div>
          
          <div class="d-flex align-end justify-space-between h-50 gap-4 mt-8 px-4">
            <div v-for="item in distributionData" :key="item.label" class="d-flex flex-column align-center flex-grow-1">
              <v-tooltip :text="`${item.count} items`" location="top">
                <template v-slot:activator="{ props }">
                  <div 
                    v-bind="props"
                    class="w-100 bg-grey-lighten-3 rounded-t-lg position-relative cursor-pointer transition-swing"
                    style="height: 200px;"
                  >
                    <div 
                      class="position-absolute bottom-0 w-100 rounded-t-lg bg-primary" 
                      :style="{ height: `${item.percentage}%`, opacity: 0.85 }"
                    ></div>
                  </div>
                </template>
              </v-tooltip>
              <span class="text-caption text-medium-emphasis mt-3 font-weight-medium">{{ item.label }}</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card rounded="xl" elevation="0" border class="fill-height d-flex flex-column">
          <v-card-title class="pa-6 pb-2 border-b">
            <div class="text-body-1 font-weight-bold">Available Reports</div>
            <div class="text-caption text-medium-emphasis">Export active assignments and audits.</div>
          </v-card-title>

          <v-list lines="two" class="flex-grow-1 py-0">
            <v-list-item 
              v-for="(report, index) in downloadableReports" 
              :key="index"
              class="border-b px-6 py-3 hover-bg-light"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-4" rounded class="text-primary mr-4">
                  <v-icon :icon="report.icon"></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold text-caption">{{ report.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ report.subtitle }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="d-flex gap-2">
                  <v-btn icon="mdi-file-pdf-box" variant="text" color="grey-darken-1" size="small"></v-btn>
                  <v-btn icon="mdi-file-delimited" variant="text" color="grey-darken-1" size="small"></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-card-actions class="pa-4 bg-grey-lighten-4 justify-center">
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right" class="text-caption font-weight-bold">
              VIEW ARCHIVED REPORTS
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h4 class="text-body-1 font-weight-bold mb-4">Recent Report Activity</h4>
        <v-card rounded="xl" elevation="0" border>
          <v-table hover>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">TIMESTAMP</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">USER</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">REPORT TYPE</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">STATUS</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">FORMAT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, i) in activityLogs" :key="i">
                <td class="text-caption text-medium-emphasis">{{ log.timestamp }}</td>
                <td class="text-caption font-weight-medium">{{ log.user }}</td>
                <td class="text-caption">{{ log.reportType }}</td>
                <td>
                  <v-chip size="x-small" :color="log.statusColor" class="font-weight-bold text-uppercase">
                    {{ log.status }}
                  </v-chip>
                </td>
                <td class="text-caption font-weight-bold text-medium-emphasis">{{ log.format }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Filter State
const filters = ref({
  dateRange: 'Last 30 Days',
  department: 'All Departments',
  category: 'All Categories',
  status: 'All Statuses'
})

// Data for Custom Bar Chart Visual
const distributionData = ref([
  { label: 'Computing', percentage: 85, count: 642 },
  { label: 'Furniture', percentage: 62, count: 215 },
  { label: 'Vehicles', percentage: 15, count: 34 },
  { label: 'Networking', percentage: 92, count: 310 },
  { label: 'Mobile', percentage: 45, count: 184 }
])

// Reports List
const downloadableReports = ref([
  { 
    icon: 'mdi-clipboard-list', 
    title: 'Inventory Audit', 
    subtitle: 'Full ledger of verified assets' 
  },
  { 
    icon: 'mdi-account-switch', 
    title: 'Assignment History', 
    subtitle: 'Chain of custody by employee' 
  },
  { 
    icon: 'mdi-wrench-clock', 
    title: 'Maintenance Summary', 
    subtitle: 'Lifecycle & repair logs' 
  }
])

// Activity Logs Table
const activityLogs = ref([
  {
    timestamp: '2024-05-07 14:22',
    user: 'Marcus Chen (Admin)',
    reportType: 'Asset Allocation by Dept',
    status: 'SUCCESS',
    statusColor: 'success',
    format: 'PDF'
  },
  {
    timestamp: '2024-05-07 11:05',
    user: 'Elena Rodriguez',
    reportType: 'Unassigned Inventory List',
    status: 'SUCCESS',
    statusColor: 'success',
    format: 'CSV'
  },
  {
    timestamp: '2024-05-06 09:45',
    user: 'System Process',
    reportType: 'Weekly Asset Reconciliation',
    status: 'PROCESSING',
    statusColor: 'warning',
    format: 'ZIP'
  }
])
</script>

<style scoped>
/* Minor utility to simulate the hover background color on list items */
.hover-bg-light:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
.gap-4 {
  gap: 16px;
}
.gap-2 {
  gap: 8px;
}
</style>
