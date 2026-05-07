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

type SummaryMetric = {
  label: string
  value: string
  valueClass?: string
}

type SpecItem = {
  icon: string
  title: string
  subtitle: string
}

defineEmits<{
  reset: []
}>()

const summaryMetrics: SummaryMetric[] = [
  { label: 'Current Age', value: '71 Days' },
  { label: 'Service Frequency', value: 'Quarterly' },
  { label: 'Warranty Ends', value: 'Jan 2027' },
]

const specItems: SpecItem[] = [
  { icon: 'mdi-cpu-64-bit', title: 'Processor', subtitle: 'Apple M3 Max (14-core)' },
  { icon: 'mdi-memory', title: 'Memory', subtitle: '32GB Unified Memory' },
  { icon: 'mdi-harddisk', title: 'Storage', subtitle: '1TB SSD' },
  { icon: 'mdi-qrcode', title: 'Serial Number', subtitle: 'C02DG996MD6R' },
]

const timelineEvents = ref<TimelineEvent[]>([
  {
    date: 'MAR 12, 2024',
    time: '09:45 AM',
    title: 'Asset Updated',
    author: 'Marcus Chen (IT Admin)',
    icon: 'mdi-pencil',
    color: 'primary',
    status: 'Success',
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
    status: 'Success',
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
    status: 'Success',
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
    color: 'warning',
    status: 'Pending',
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
    color: 'grey-darken-1',
    status: 'Logged',
    statusColor: 'grey-darken-1',
    details: 'Unit Price: $3,499.00 | Vendor: Apple Enterprise',
  },
])
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero Header -->
    <v-row no-gutters>
      <v-col cols="12">
        <v-card rounded="lg" elevation="0" class="border-sm bg-primary-lighten-5 compact-panel">
          <v-row no-gutters>
            <v-col cols="12" md="7" class="pa-3 pa-md-4">
              <v-breadcrumbs
                :items="['Assignments', 'History']"
                density="compact"
                class="pa-0 pb-1"
              />
              
              <div class="d-flex align-center ga-3 mb-2">
                <v-avatar size="34" color="primary" rounded="lg">
                  <v-icon icon="mdi-laptop-mac" color="white" size="18" />
                </v-avatar>
                <div>
                  <div class="compact-kicker font-weight-bold text-uppercase">Asset Traceability</div>
                  <div class="compact-section-title font-weight-bold">Assignment History</div>
                </div>
              </div>
              
              <p class="compact-copy mb-2">
                Review every assignment, service checkpoint, and ownership update in one cleaner operational timeline.
              </p>

              <div class="d-flex ga-2 flex-wrap">
                <v-chip color="primary" variant="flat" size="x-small" class="compact-chip">AST-2024-001</v-chip>
                <v-chip color="success" variant="tonal" size="x-small" class="compact-chip">Active</v-chip>
                <v-chip variant="tonal" size="x-small" class="compact-chip">Last update: Mar 12, 2024</v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="5" class="pa-3 pa-md-4">
              <v-card rounded="lg" elevation="2" class="pa-3 bg-white compact-panel">
                <div class="d-flex ga-3 mb-2">
                  <v-avatar color="primary-lighten-4" size="32" rounded="lg">
                    <v-icon icon="mdi-laptop" color="primary" size="17" />
                  </v-avatar>
                  
                  <div class="flex-grow-1">
                    <div class="compact-card-title font-weight-bold">MacBook Pro 16" M3</div>
                    <div class="compact-copy">
                      Active warranty & quarterly service plan
                    </div>
                  </div>
                </div>

                <v-row dense class="mb-2">
                  <v-col cols="4">
                    <div class="compact-meta-label font-weight-bold">Assigned To</div>
                    <div class="compact-copy">John Doe</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="compact-meta-label font-weight-bold">Location</div>
                    <div class="compact-copy">SF HQ - Floor 4</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="compact-meta-label font-weight-bold">Condition</div>
                    <div class="compact-copy text-primary font-weight-bold">Excellent</div>
                  </v-col>
                </v-row>

                <v-divider class="my-1" />

                <div class="d-flex justify-space-between align-center flex-wrap ga-2">
                  <span class="compact-copy">Need to inspect another asset record?</span>
                  <v-btn
                    variant="flat"
                    color="primary"
                    prepend-icon="mdi-swap-horizontal"
                    size="x-small"
                    rounded="lg"
                    @click="$emit('reset')"
                  >
                    Change Asset
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row class="mt-2">
      <!-- Timeline Column -->
      <v-col cols="12" lg="7">
        <v-card rounded="lg" elevation="0" class="border-sm pa-4 pa-md-6 h-100">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <div class="compact-kicker font-weight-bold text-uppercase">History Feed</div>
              <div class="compact-section-title font-weight-bold">Full Activity Timeline</div>
            </div>
            <v-chip color="primary" variant="tonal" size="x-small" class="compact-chip">
              {{ timelineEvents.length }} events
            </v-chip>
          </div>

          <v-timeline 
            align="start" 
            side="end" 
            truncate-line="both" 
            density="compact"
            line-color="grey-lighten-2"
          >
            <v-timeline-item
              v-for="(event, index) in timelineEvents"
              :key="`${event.title}-${index}`"
              :dot-color="event.color"
              :icon="event.icon"
              fill-dot
              size="x-small"
            >
              <template #opposite>
                <div class="text-caption font-weight-bold">{{ event.date }}</div>
                <div class="text-caption">{{ event.time }}</div>
              </template>

              <v-card rounded="lg" elevation="1" class="history-event-card mb-2">
                <v-card-item class="history-event-header pb-0 pt-2 px-2">
                  <template #title>
                    <div class="d-flex justify-space-between align-start ga-2">
                      <div>
                        <div class="history-event-title font-weight-bold">{{ event.title }}</div>
                        <div class="history-event-meta">By {{ event.author }}</div>
                      </div>
                      <v-chip
                        size="x-small"
                        :color="event.statusColor"
                        variant="tonal"
                        class="history-event-chip"
                      >
                        {{ event.status }}
                      </v-chip>
                    </div>
                  </template>
                </v-card-item>

                <v-card-text class="history-event-content pb-2 px-2 pt-1">
                  <div v-if="event.details" class="history-event-details mb-2">
                    {{ event.details }}
                  </div>

                  <v-list
                    v-if="event.updates"
                    density="compact"
                    class="history-event-list bg-grey-lighten-4 rounded-lg pa-0 mt-1"
                  >
                    <v-list-item
                      v-for="(update, updateIndex) in event.updates"
                      :key="`${update.text}-${updateIndex}`"
                      :prepend-icon="update.icon"
                      min-height="24"
                      class="px-2"
                    >
                      <v-list-item-title class="history-event-details">
                        {{ update.text }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <div v-if="event.attachment" class="mt-2">
                    <v-btn
                      variant="tonal"
                      size="x-small"
                      prepend-icon="mdi-paperclip"
                      rounded="lg"
                      class="text-none history-event-attachment"
                    >
                      {{ event.attachment }}
                    </v-btn>
                  </div>

                  <div v-if="event.employee" class="d-flex align-center bg-grey-lighten-4 rounded-lg pa-2 mt-2">
                    <v-avatar size="24" class="mr-2">
                      <v-img src="https://i.pravatar.cc/150?img=11" />
                    </v-avatar>
                    <div>
                      <div class="history-event-title font-weight-bold">{{ event.employee.name }}</div>
                      <div class="history-event-details">{{ event.employee.role }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>

      <!-- Sidebar Column -->
      <v-col cols="12" lg="5">
        <v-card rounded="lg" elevation="0" class="border-sm pa-3 mb-3 bg-info-lighten-5 compact-panel">
          <div class="mb-2">
            <div class="compact-kicker font-weight-bold text-uppercase">Snapshot</div>
            <div class="compact-section-title font-weight-bold">Lifecycle Summary</div>
          </div>

          <v-row dense>
            <v-col
              v-for="metric in summaryMetrics"
              :key="metric.label"
              cols="4"
            >
              <v-sheet rounded="lg" class="pa-2 bg-white border-sm compact-panel">
                <div class="compact-copy">{{ metric.label }}</div>
                <div :class="['compact-card-title font-weight-bold mt-1', metric.valueClass]">
                  {{ metric.value }}
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>

        <v-card rounded="lg" elevation="0" class="border-sm pa-3 mb-3 compact-panel">
          <div class="d-flex justify-space-between align-center mb-1">
            <div>
              <div class="compact-kicker font-weight-bold text-uppercase">Hardware Profile</div>
              <div class="compact-section-title font-weight-bold">Asset Specs</div>
            </div>
            <v-btn icon="mdi-pencil-box-outline" variant="text" size="x-small" color="primary" />
          </div>

          <v-list density="compact" class="pa-0 bg-transparent">
            <v-list-item
              v-for="spec in specItems"
              :key="spec.title"
              :prepend-icon="spec.icon"
              :title="spec.title"
              :subtitle="spec.subtitle"
              min-height="32"
              class="compact-spec-row"
            />
          </v-list>
        </v-card>

        <v-card rounded="lg" elevation="0" class="border-sm overflow-hidden compact-panel">
          <div class="pa-3 pb-0">
            <div class="compact-kicker font-weight-bold text-uppercase">Site Context</div>
            <div class="compact-section-title font-weight-bold mb-1">Primary Location</div>
            <div class="compact-copy font-weight-bold text-primary">San Francisco HQ - Floor 4</div>
          </div>

          <v-img
            height="132"
            src="https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco&zoom=14&size=600x300&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:water|color:0xe0e0e0&style=feature:landscape|color:0xf5f5f5"
            cover
            class="mt-2"
          >
            <div class="fill-height d-flex align-center justify-center">
              <v-icon icon="mdi-map-marker" color="primary" size="30" />
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.history-event-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.history-event-title {
  font-size: 0.79rem;
  line-height: 1.2;
}

.history-event-meta,
.history-event-details {
  font-size: 0.71rem;
  line-height: 1.35;
  color: rgba(0, 0, 0, 0.62);
}

.history-event-chip {
  font-size: 0.62rem;
  letter-spacing: 0.03em;
}

.history-event-list :deep(.v-list-item__prepend > .v-icon) {
  font-size: 0.9rem;
}

.history-event-attachment {
  font-size: 0.68rem;
}

.compact-panel {
  border-color: rgba(0, 0, 0, 0.05) !important;
}

.compact-kicker {
  font-size: 0.64rem;
  line-height: 1.2;
  letter-spacing: 0.06em;
}

.compact-section-title {
  font-size: 0.88rem;
  line-height: 1.2;
}

.compact-card-title {
  font-size: 0.78rem;
  line-height: 1.2;
}

.compact-copy {
  font-size: 0.7rem;
  line-height: 1.35;
  color: rgba(0, 0, 0, 0.64);
}

.compact-meta-label {
  font-size: 0.67rem;
  line-height: 1.2;
}

.compact-chip {
  font-size: 0.62rem;
}

.compact-spec-row :deep(.v-list-item-title) {
  font-size: 0.74rem;
  line-height: 1.2;
  font-weight: 600;
}

.compact-spec-row :deep(.v-list-item-subtitle) {
  font-size: 0.68rem;
  line-height: 1.25;
}

.compact-spec-row :deep(.v-list-item__prepend > .v-icon) {
  font-size: 0.95rem;
}
</style>
