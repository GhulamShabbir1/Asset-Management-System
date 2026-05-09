<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <v-row class="mb-2 align-end">
      <v-col cols="12" md="8">
        <h1 class="text-h5 font-weight-bold text-high-emphasis mb-0" style="line-height: 1.1;">System Reports</h1>
        <p class="text-caption text-medium-emphasis mt-1">
          Download assets, employee assignments, audit logs, and lifecycle summaries from one place.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-md-end gap-4">
        <v-btn variant="outlined" prepend-icon="mdi-file-download-outline" size="large" rounded="lg">
          Export Summary
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-download-multiple" size="large" rounded="lg">
          Download All Reports
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" border class="rounded-lg mb-3">
      <v-card-text class="pa-4">
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

    <v-row class="mb-1">
      <v-col cols="12" md="4">
        <v-card class="rounded-lg pa-3 h-100" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-3">
            <v-avatar color="blue-lighten-5" rounded="md" size="36">
              <v-icon icon="mdi-laptop-mac" color="blue-darken-2" size="18"></v-icon>
            </v-avatar>
            <span class="text-caption font-weight-bold text-primary" style="font-size: 11px !important;">
              +4.2%
            </span>
          </div>
          <div class="text-medium-emphasis mb-1 report-kicker">TOTAL ASSETS</div>
          <div class="text-h5 font-weight-black">1,245</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-lg pa-3 h-100" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-3">
            <v-avatar color="blue-lighten-5" rounded="md" size="36">
              <v-icon icon="mdi-account-group" color="blue-darken-2" size="18"></v-icon>
            </v-avatar>
            <span class="text-caption font-weight-bold text-medium-emphasis" style="font-size: 11px !important;">480 users</span>
          </div>
          <div class="text-medium-emphasis mb-1 report-kicker">ACTIVE EMPLOYEES</div>
          <div class="text-h5 font-weight-black">480</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-lg pa-3 h-100" elevation="0" border>
          <div class="d-flex justify-space-between align-start mb-3">
            <v-avatar color="red-lighten-5" rounded="md" size="36">
              <v-icon icon="mdi-package-variant-closed" color="red-darken-2" size="18"></v-icon>
            </v-avatar>
            <span class="text-caption font-weight-bold text-error" style="font-size: 11px !important;">Needs review</span>
          </div>
          <div class="text-medium-emphasis mb-1 report-kicker">UNASSIGNED ASSETS</div>
          <div class="text-h5 font-weight-black">112</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-2">
      <v-col cols="12" lg="7">
        <v-card class="rounded-lg h-100" elevation="0" border>
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex justify-space-between align-center mb-2">
              <h4 class="text-body-1 font-weight-bold">Asset Distribution by Category</h4>
              <v-btn variant="text" color="primary" size="small" class="text-caption font-weight-bold">VIEW FULL DATA</v-btn>
            </div>
          </v-card-title>
          <div class="px-4 pb-4">
            <div class="d-flex align-end justify-space-between h-50 gap-4 mt-4 px-2">
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
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card rounded="lg" elevation="0" border class="h-100">
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-body-1 font-weight-bold">Download Center</div>
                <div class="text-caption text-medium-emphasis">Export every core report used by operations and HR.</div>
              </div>
              <v-btn variant="text" color="primary" size="small" class="text-caption font-weight-bold">
                DOWNLOAD ALL
              </v-btn>
            </div>
          </v-card-title>

          <v-list lines="two" class="py-0">
            <v-list-item 
              v-for="(report, index) in downloadableReports" 
              :key="report.title"
              class="border-b px-4 py-3 hover-bg-light"
            >
              <template v-slot:prepend>
                <v-avatar :color="report.badgeColor" rounded="md" size="36" class="mr-3">
                  <v-icon :icon="report.icon" :color="report.iconColor" size="18"></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold text-caption">{{ report.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ report.subtitle }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="d-flex align-center gap-2">
                  <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold">
                    {{ report.count }}
                  </v-chip>
                  <v-btn icon="mdi-file-pdf-box" variant="text" color="grey-darken-1" size="small"></v-btn>
                  <v-btn icon="mdi-file-delimited" variant="text" color="grey-darken-1" size="small"></v-btn>
                  <v-btn icon="mdi-microsoft-excel" variant="text" color="grey-darken-1" size="small"></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <div class="pa-4 bg-grey-lighten-4 border-t">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="report-kicker text-medium-emphasis mb-1">MOST REQUESTED</div>
                  <div class="text-caption font-weight-bold">Asset Inventory Report</div>
                </v-sheet>
              </v-col>
              <v-col cols="12" sm="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="report-kicker text-medium-emphasis mb-1">LAST EXPORT</div>
                  <div class="text-caption font-weight-bold">Today, 11:05 AM</div>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-2">
      <v-col cols="12">
        <h4 class="text-body-1 font-weight-bold mb-4">Recent Report Activity</h4>
        <v-card rounded="lg" elevation="0" border>
          <v-table hover density="compact" class="px-2 mt-1">
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
    title: 'Asset Inventory Report', 
    subtitle: 'Full asset register with category, condition, and location',
    count: '1,245',
    badgeColor: 'blue-lighten-5',
    iconColor: 'blue-darken-2'
  },
  { 
    icon: 'mdi-account-switch', 
    title: 'Employee Assignment Report', 
    subtitle: 'Assigned devices, owners, departments, and handover history',
    count: '480',
    badgeColor: 'green-lighten-5',
    iconColor: 'green-darken-2'
  },
  { 
    icon: 'mdi-wrench-clock', 
    title: 'Maintenance Summary', 
    subtitle: 'Repair jobs, service schedules, and maintenance backlog',
    count: '58',
    badgeColor: 'amber-lighten-5',
    iconColor: 'amber-darken-3'
  },
  { 
    icon: 'mdi-account-group-outline', 
    title: 'Employee Headcount Summary', 
    subtitle: 'Department-wise employee numbers and assigned asset totals',
    count: '12 depts',
    badgeColor: 'purple-lighten-5',
    iconColor: 'deep-purple-darken-2'
  },
  { 
    icon: 'mdi-history', 
    title: 'Lifecycle History Report', 
    subtitle: 'Movement history, audit trail, and status changes for all assets',
    count: '3,420',
    badgeColor: 'red-lighten-5',
    iconColor: 'red-darken-2'
  },
  { 
    icon: 'mdi-shield-check-outline', 
    title: 'Compliance and Audit Export', 
    subtitle: 'Controls, exceptions, approvals, and security review records',
    count: '24',
    badgeColor: 'grey-lighten-4',
    iconColor: 'grey-darken-2'
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
.report-kicker {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.border-t {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

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
