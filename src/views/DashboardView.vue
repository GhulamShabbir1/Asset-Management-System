<script setup lang="ts">
const stats = [
  { title: 'TOTAL ASSETS', value: '1,248', icon: 'mdi-clipboard-text-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5', trend: '+2.4%', trendColor: 'text-success' },
  { title: 'ASSIGNED ASSETS', value: '1,024', icon: 'mdi-account-check-outline', iconColor: 'blue-darken-2', bg: 'bg-blue-lighten-5', trend: '82% Cap.', trendColor: 'text-medium-emphasis' },
  { title: 'AVAILABLE ASSETS', value: '224', icon: 'mdi-check-circle-outline', iconColor: 'success', bg: 'bg-success-light', trend: 'Available', trendColor: 'text-success' },
  { title: 'PENDING MAINTENANCE', value: '12', icon: 'mdi-wrench-outline', iconColor: 'red-darken-2', bg: 'bg-red-lighten-5', trend: 'Priority', trendColor: 'text-error' },
]

const recentActivity = [
  { asset: 'MacBook Pro M3 - 14"', sn: 'SN: 8902-3341-X', icon: 'mdi-laptop', user: 'Sarah Jenkins', action: 'New Assignment', date: 'Oct 12, 10:24 AM', status: 'ASSIGNED', statusBg: 'blue-lighten-5', statusText: 'text-blue-darken-2' },
  { asset: 'iPhone 15 Pro', sn: 'SN: 1102-9982-M', icon: 'mdi-cellphone', user: 'Marcus Rivera', action: 'Returned', date: 'Oct 12, 09:15 AM', status: 'AVAILABLE', statusBg: 'success-light', statusText: 'text-success' },
  { asset: 'Dell UltraSharp 32"', sn: 'SN: 4421-0012-P', icon: 'mdi-monitor', user: 'Inventory Stock', action: 'Maintenance Check', date: 'Oct 11, 04:50 PM', status: 'MAINTENANCE', statusBg: 'red-lighten-5', statusText: 'text-red-darken-2' },
  { asset: 'iPad Pro 12.9"', sn: 'SN: 7712-4431-Q', icon: 'mdi-tablet-ipad', user: 'Elena Zhao', action: 'New Assignment', date: 'Oct 11, 02:20 PM', status: 'ASSIGNED', statusBg: 'blue-lighten-5', statusText: 'text-blue-darken-2' },
]

const alerts = [
  { title: 'Warranty Expiring', desc: '3x Dell Latitude laptops warranties expire in 14 days.', action: 'REVIEW ASSETS', icon: 'mdi-clock-outline', color: 'error', borderClass: 'border-s-lg border-error' },
  { title: 'Routine Inspection', desc: 'Server Rack B-12 quarterly maintenance scheduled for tomorrow.', action: 'ACKNOWLEDGE', icon: 'mdi-wrench-outline', color: 'grey-darken-2', borderClass: '' },
  { title: 'Software Update', desc: 'Adobe Creative Cloud enterprise licenses renewal pending.', action: 'MANAGE BILLING', icon: 'mdi-update', color: 'grey-darken-2', borderClass: '' },
]

const healthChart = [
  { day: 'MON', height: '60%', color: '#dcfce3' },
  { day: 'TUE', height: '70%', color: '#6ee7b7' },
  { day: 'WED', height: '85%', color: '#000000' },
  { day: 'THU', height: '65%', color: '#dcfce3' },
  { day: 'FRI', height: '55%', color: '#6ee7b7' },
  { day: 'SAT', height: '80%', color: '#000000' },
]
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">Dashboard</h1>
        <p class="text-caption text-medium-emphasis">Overview of corporate asset health and allocation.</p>
      </div>
      <v-btn variant="outlined" prepend-icon="mdi-download" color="black" size="small" class="text-none font-weight-bold">
        Export Report
      </v-btn>
    </div>

    <v-row class="mb-2">
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

    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="0" border class="rounded-lg h-100">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <span class="text-body-1 font-weight-bold">Recent Activity</span>
            <span class="text-caption text-black font-weight-bold cursor-pointer">View All</span>
          </v-card-title>
          
          <v-table hover density="compact" class="px-2">
            <thead>
              <tr>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">ASSET / ITEM</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">USER</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">ACTION</th>
                <th class="font-weight-bold text-medium-emphasis" style="font-size: 10px; text-transform: uppercase;">DATE</th>
                <th class="font-weight-bold text-medium-emphasis text-right" style="font-size: 10px; text-transform: uppercase;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentActivity" :key="item.sn">
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
        
        <v-card elevation="0" color="#171b29" class="rounded-lg mb-4">
          <v-card-title class="text-white text-body-1 font-weight-bold pa-4 pb-2">
            Quick Actions
          </v-card-title>
          <v-card-text class="pa-3 pt-0">
            <v-list bg-color="transparent" density="compact" class="pa-0">
              <v-list-item 
                ripple 
                class="rounded-md mb-2 pa-2 cursor-pointer" 
                style="background-color: #252a3d"
              >
                <template v-slot:prepend>
                  <v-avatar color="white" rounded="md" size="32" class="mr-3">
                    <v-icon color="black" size="16">mdi-clipboard-text-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-white font-weight-bold text-caption">New Assignment</v-list-item-title>
                <v-list-item-subtitle class="text-grey-lighten-1" style="font-size: 10px;">Assign asset to employee</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item 
                ripple 
                class="rounded-md pa-2 cursor-pointer" 
                style="background-color: #252a3d"
              >
                <template v-slot:prepend>
                  <v-avatar color="white" rounded="md" size="32" class="mr-3">
                    <v-icon color="black" size="16">mdi-plus-box-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-white font-weight-bold text-caption">Add New Asset</v-list-item-title>
                <v-list-item-subtitle class="text-grey-lighten-1" style="font-size: 10px;">Register hardware/license</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border class="rounded-lg mb-4">
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
                <div class="font-weight-bold text-black cursor-pointer" style="font-size: 9px;">{{ alert.action }}</div>
              </div>
            </v-sheet>
          </v-card-text>
        </v-card>

        <v-card elevation="0" border class="rounded-lg">
          <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">
            Inventory Health
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="d-flex align-end justify-space-between mt-2" style="height: 80px;">
              <div v-for="bar in healthChart" :key="bar.day" class="d-flex flex-column align-center w-100">
                <v-sheet 
                  class="mb-1 rounded-t-sm w-75" 
                  :color="bar.color"
                  :height="bar.height"
                ></v-sheet>
                <span class="text-medium-emphasis" style="font-size: 9px !important;">{{ bar.day }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>