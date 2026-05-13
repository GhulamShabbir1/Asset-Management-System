<script setup lang="ts">
import { ref, computed } from 'vue'

const stats = [
  { title: 'TOTAL ASSETS', value: '1,248', icon: 'mdi-clipboard-text-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5', trend: '+2.4%', trendColor: 'text-primary' },
  { title: 'ASSIGNED ASSETS', value: '1,024', icon: 'mdi-account-check-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5', trend: '82% Cap.', trendColor: 'text-medium-emphasis' },
  { title: 'AVAILABLE ASSETS', value: '224', icon: 'mdi-check-circle-outline', iconColor: 'primary', bg: 'bg-primary-light', trend: 'Available', trendColor: 'text-primary' },
  { title: 'PENDING MAINTENANCE', value: '12', icon: 'mdi-wrench-outline', iconColor: 'red-darken-2', bg: 'bg-red-lighten-5', trend: 'Priority', trendColor: 'text-error' },
]

const recentActivity = [
  { asset: 'MacBook Pro M3 - 14"', sn: 'SN: 8902-3341-X', icon: 'mdi-laptop', user: 'Sarah Jenkins', action: 'New Assignment', date: 'Oct 12, 10:24 AM', status: 'ASSIGNED', statusBg: 'blue-lighten-5', statusText: 'text-blue-darken-2' },
  { asset: 'iPhone 15 Pro', sn: 'SN: 1102-9982-M', icon: 'mdi-cellphone', user: 'Marcus Rivera', action: 'Returned', date: 'Oct 12, 09:15 AM', status: 'AVAILABLE', statusBg: 'primary-light', statusText: 'text-primary' },
  { asset: 'Dell UltraSharp 32"', sn: 'SN: 4421-0012-P', icon: 'mdi-monitor', user: 'Inventory Stock', action: 'Maintenance Check', date: 'Oct 11, 04:50 PM', status: 'MAINTENANCE', statusBg: 'red-lighten-5', statusText: 'text-red-darken-2' },
  { asset: 'iPad Pro 12.9"', sn: 'SN: 7712-4431-Q', icon: 'mdi-tablet-ipad', user: 'Elena Zhao', action: 'New Assignment', date: 'Oct 11, 02:20 PM', status: 'ASSIGNED', statusBg: 'blue-lighten-5', statusText: 'text-blue-darken-2' },
]

const alerts = [
  { title: 'Warranty Expiring', desc: '3x Dell Latitude laptops warranties expire in 14 days.', action: 'REVIEW ASSETS', icon: 'mdi-clock-outline', color: 'error', borderClass: 'border-s-lg border-error' },
  { title: 'Routine Inspection', desc: 'Server Rack B-12 quarterly maintenance scheduled for tomorrow.', action: 'ACKNOWLEDGE', icon: 'mdi-wrench-outline', color: 'grey-darken-2', borderClass: '' },
  { title: 'Software Update', desc: 'Adobe Creative Cloud enterprise licenses renewal pending.', action: 'MANAGE BILLING', icon: 'mdi-update', color: 'grey-darken-2', borderClass: '' },
]

// Filter Logic
const filters = ['All', 'Assignments', 'Returns', 'Maintenance']
const activeFilter = ref('All')

const filteredActivity = computed(() => {
  if (activeFilter.value === 'Assignments') return recentActivity.filter(i => i.status === 'ASSIGNED')
  if (activeFilter.value === 'Returns') return recentActivity.filter(i => i.status === 'AVAILABLE')
  if (activeFilter.value === 'Maintenance') return recentActivity.filter(i => i.status === 'MAINTENANCE')
  return recentActivity
})
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">

    <v-row class="mt-6 mb-1">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card elevation="0" border class="rounded-lg pa-3 h-100">
          <div class="d-flex justify-space-between align-start mb-3">
            <v-avatar :class="['rounded-md', stat.bg]" size="36">
              <v-icon :color="stat.iconColor" size="18">{{ stat.icon }}</v-icon>
            </v-avatar>
            <span :class="['text-caption font-weight-bold', stat.trendColor]" style="font-size: 11px !important;">{{ stat.trend }}</span>
          </div>
          <div class="text-medium-emphasis mb-1" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">{{ stat.title }}</div>
          <div class="text-h5 font-weight-black">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card elevation="0" border class="rounded-lg h-100">
          
          <v-card-title class="pa-4 pb-2">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-1 font-weight-bold">Recent Activity</span>
              <span class="text-caption text-primary font-weight-bold cursor-pointer">View All</span>
            </div>
            
            <div class="d-flex align-center">
              <v-chip
                v-for="filter in filters"
                :key="filter"
                :color="activeFilter === filter ? 'primary' : 'grey-lighten-4'"
                :class="[
                  'mr-2 cursor-pointer',
                  activeFilter === filter ? 'text-white font-weight-bold' : 'text-medium-emphasis font-weight-medium'
                ]"
                variant="flat"
                size="small"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </v-chip>
            </div>
          </v-card-title>
          
          <v-table hover density="compact" class="px-2 mt-1">
            <thead>
              <tr>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">ASSET / ITEM</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">USER</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">ACTION</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">DATE</th>
                <th class="font-weight-bold text-medium-emphasis text-right" style="font-size: 10px; text-transform: uppercase;">STATUS</th>
              </tr>
            </thead>
            <tbody v-if="filteredActivity.length === 0">
              <tr>
                <td colspan="5" class="text-center py-6 text-medium-emphasis text-caption">No recent activity for this filter.</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="item in filteredActivity" :key="item.sn">
                <td class="py-2">
                  <div class="d-flex align-center">
                    <v-icon size="20" color="grey-darken-1" class="mr-3">{{ item.icon }}</v-icon>
                    <div>
                      <div class="font-weight-bold text-caption">{{ item.asset }}</div>
                      <div class="text-medium-emphasis" style="font-size: 10px;">{{ item.sn }}</div>
                    </div>
                  </div>
                </td>
                <td><div class="text-caption">{{ item.user }}</div></td>
                <td><div class="text-caption">{{ item.action }}</div></td>
                <td>
                  <div class="text-caption" style="max-width: 80px; line-height: 1.2;">{{ item.date }}</div>
                </td>
                <td class="text-right">
                  <v-chip size="x-small" variant="flat" :color="item.statusBg" :class="[item.statusText, 'font-weight-bold']">
                    {{ item.status }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="0" border class="rounded-lg">
          <v-card-title class="d-flex justify-space-between align-center pa-4 pb-2">
            <span class="text-body-1 font-weight-bold">Maintenance Alerts</span>
            <v-icon color="error" size="small">mdi-alert-outline</v-icon>
          </v-card-title>
          <v-card-text class="pa-3 pt-0">
            <v-sheet 
              v-for="(alert, index) in alerts" 
              :key="index"
              color="grey-lighten-5"
              :class="['pa-3 mb-2 rounded-md d-flex', alert.borderClass]"
            >
              <v-icon :color="alert.color" size="16" class="mr-2 mt-1">{{ alert.icon }}</v-icon>
              <div>
                <div class="font-weight-bold text-caption mb-1">{{ alert.title }}</div>
                <div class="text-medium-emphasis mb-2" style="font-size: 10px; line-height: 1.3;">{{ alert.desc }}</div>
                <div class="font-weight-bold text-black cursor-pointer hover-primary" style="font-size: 9px;">{{ alert.action }}</div>
              </div>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>