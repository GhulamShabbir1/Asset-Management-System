<script setup lang="ts">
import { ref } from 'vue'

type EventUpdate = {
  icon: string
  text: string
}

type EventEmployee = {
  name: string
  role: string
}

type TimelineEvent = {
  date: string
  time: string
  title: string
  author: string
  icon: string
  color: string
  status: string
  statusColor: string
  details?: string
  updates?: EventUpdate[]
  attachment?: string
  employee?: EventEmployee
}

defineEmits<{
  reset: []
}>()

const timelineEvents = ref<TimelineEvent[]>([
  {
    date: 'MAR 12, 2024',
    time: '09:45 AM',
    title: 'Asset Updated',
    author: 'Marcus Chen (IT Admin)',
    icon: 'mdi-pencil',
    color: 'primary',
    status: 'SUCCESS',
    statusColor: 'success',
    updates: [
      { icon: 'mdi-memory', text: 'Memory upgraded from 16GB to 32GB' },
      { icon: 'mdi-shield-check', text: 'Firmware patched to v2.4.1' },
    ],
  },
  {
    date: 'FEB 20, 2024',
    time: '02:15 PM',
    title: 'Maintenance Recorded',
    author: 'Sarah Jenkins (Technician)',
    icon: 'mdi-wrench',
    color: 'primary',
    status: 'SUCCESS',
    statusColor: 'success',
    details:
      'Routine keyboard cleaning and thermal paste re-application. External port diagnostics passed all integrity tests.',
    attachment: 'diagnostic_report_AST2024.pdf',
  },
  {
    date: 'JAN 15, 2024',
    time: '11:00 AM',
    title: 'Assigned to Employee',
    author: 'HR Department',
    icon: 'mdi-account',
    color: 'primary',
    status: 'SUCCESS',
    statusColor: 'success',
    employee: {
      name: 'John Doe',
      role: 'Senior Product Designer - Creative Dept.',
    },
  },
  {
    date: 'JAN 05, 2024',
    time: '08:30 AM',
    title: 'Inventory Check',
    author: 'System Audit',
    icon: 'mdi-clipboard-check',
    color: 'primary',
    status: 'PENDING',
    statusColor: 'warning',
    details:
      'Initial asset verification and serial number validation in progress. Tagging physical unit with AST-2024-001 label.',
  },
  {
    date: 'JAN 02, 2024',
    time: '04:00 PM',
    title: 'Asset Purchased',
    author: 'Procurement Office',
    icon: 'mdi-cart',
    color: 'primary',
    status: 'SUCCESS',
    statusColor: 'success',
    details: 'Unit Price: $3,499.00 | Vendor: Apple Enterprise',
  },
])
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1600px;">
    <v-row class="mb-6 align-end">
      <v-col cols="12" md="7">
        <v-breadcrumbs
          :items="['Assignments', 'History']"
          class="px-0 pb-2 text-medium-emphasis"
        />
        <h1 class="text-h4 font-weight-bold text-high-emphasis">
          Assignment History
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          Complete audit trail for asset assignments, updates, and maintenance cycles.
        </p>
      </v-col>

      <v-col cols="12" md="5">
        <v-card variant="tonal" color="primary" class="d-flex align-center pa-4" rounded="xl">
          <v-avatar color="primary" variant="flat" size="48" class="mr-4">
            <v-icon icon="mdi-laptop-mac" color="white" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold">MacBook Pro 16" M3</div>
            <div class="text-caption text-medium-emphasis d-flex align-center mt-1">
              AST-2024-001
              <v-icon icon="mdi-circle-small" />
              <span class="text-primary font-weight-black">ACTIVE</span>
            </div>
          </div>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-swap-horizontal"
            rounded="lg"
            @click="$emit('reset')"
          >
            Change
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="pa-6" rounded="xl" elevation="2">
          <v-timeline align="start" side="end" truncate-line="both">
            <v-timeline-item
              v-for="(event, index) in timelineEvents"
              :key="`${event.title}-${index}`"
              :dot-color="event.color"
              :icon="event.icon"
              fill-dot
              size="large"
            >
              <template #opposite>
                <div class="text-subtitle-2 font-weight-bold text-high-emphasis">
                  {{ event.date }}
                </div>
                <div class="text-caption text-medium-emphasis">{{ event.time }}</div>
              </template>

              <v-card variant="outlined" class="mb-4" rounded="lg">
                <v-card-item>
                  <template #title>
                    <div class="d-flex justify-space-between align-center ga-3">
                      <span class="text-h6">{{ event.title }}</span>
                      <v-chip
                        size="small"
                        :color="event.statusColor"
                        class="font-weight-bold text-uppercase"
                      >
                        {{ event.status }}
                      </v-chip>
                    </div>
                  </template>
                  <template #subtitle>
                    Performed by <strong>{{ event.author }}</strong>
                  </template>
                </v-card-item>

                <v-card-text class="pt-0">
                  <div v-if="event.details" class="text-body-2 text-medium-emphasis">
                    {{ event.details }}
                  </div>

                  <v-list
                    v-if="event.updates"
                    density="compact"
                    class="bg-grey-lighten-4 rounded mt-3"
                  >
                    <v-list-item
                      v-for="(update, updateIndex) in event.updates"
                      :key="`${update.text}-${updateIndex}`"
                      :prepend-icon="update.icon"
                    >
                      <v-list-item-title class="text-body-2">
                        {{ update.text }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <div v-if="event.attachment" class="mt-3">
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-paperclip"
                      color="grey-darken-2"
                    >
                      {{ event.attachment }}
                    </v-btn>
                  </div>

                  <div
                    v-if="event.employee"
                    class="d-flex align-center bg-grey-lighten-4 pa-3 rounded-lg mt-3"
                  >
                    <v-avatar size="40" class="mr-3">
                      <v-img src="https://i.pravatar.cc/150?img=11" />
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">{{ event.employee.name }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ event.employee.role }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-row>
          <v-col cols="12">
            <v-card rounded="xl" elevation="2">
              <v-card-title class="text-overline text-medium-emphasis px-6 pt-6">
                Lifecycle Summary
              </v-card-title>
              <v-list lines="one" class="px-4 pb-4">
                <v-list-item title="Current Age">
                  <template #append><span class="font-weight-bold">71 Days</span></template>
                </v-list-item>
                <v-divider />
                <v-list-item title="Total Value Loss">
                  <template #append>
                    <span class="font-weight-bold text-error">-$145.50</span>
                  </template>
                </v-list-item>
                <v-divider />
                <v-list-item title="Service Frequency">
                  <template #append><span class="font-weight-bold">Quarterly</span></template>
                </v-list-item>
                <v-divider />
                <v-list-item title="Warranty Ends">
                  <template #append><span class="font-weight-bold">Jan 2027</span></template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card rounded="xl" elevation="2">
              <div class="d-flex justify-space-between align-center px-6 pt-6">
                <v-card-title class="text-overline text-medium-emphasis px-0 pt-0">
                  Asset Specs
                </v-card-title>
                <v-btn
                  icon="mdi-pencil-box-outline"
                  variant="text"
                  color="primary"
                  size="small"
                />
              </div>

              <v-list lines="two" class="px-2 pb-4">
                <v-list-item
                  prepend-icon="mdi-cpu-64-bit"
                  title="Processor"
                  subtitle="Apple M3 Max (14-core)"
                />
                <v-list-item
                  prepend-icon="mdi-memory"
                  title="Memory"
                  subtitle="32GB Unified Memory"
                />
                <v-list-item
                  prepend-icon="mdi-harddisk"
                  title="Storage"
                  subtitle="1TB SSD"
                />
                <v-list-item
                  prepend-icon="mdi-qrcode"
                  title="Serial Number"
                  subtitle="C02DG996MD6R"
                />
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card rounded="xl" elevation="2">
              <v-card-title class="text-overline text-medium-emphasis px-6 pt-6">
                Primary Location
              </v-card-title>
              <v-card-subtitle class="text-subtitle-1 text-high-emphasis px-6 pb-4">
                San Francisco HQ - Floor 4
              </v-card-subtitle>
              <v-img
                height="200"
                src="https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco&zoom=14&size=600x300&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:water|color:0xe0e0e0&style=feature:landscape|color:0xf5f5f5"
                cover
                class="bg-grey-lighten-2"
              >
                <div class="fill-height d-flex align-center justify-center">
                  <v-icon icon="mdi-map-marker" color="primary" size="48" class="text-shadow" />
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
