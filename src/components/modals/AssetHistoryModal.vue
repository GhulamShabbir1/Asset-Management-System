<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700px"
    rounded="lg"
  >
    <v-card rounded="lg" elevation="0" border v-if="asset">
      <div class="pa-3 border-b bg-grey-lighten-4 d-flex justify-space-between align-center">
        <div>
          <v-chip
            v-if="asset.status"
            :color="asset.statusColor || 'primary'"
            size="x-small"
            class="mb-2 font-weight-bold text-uppercase"
            variant="flat"
          >
            {{ asset.status }}
          </v-chip>
          <h2 class="modal-title font-weight-bold mb-0">{{ asset.name }}</h2>
          <div class="modal-meta text-medium-emphasis mt-1">
            <v-icon icon="mdi-barcode-scan" size="14" class="mr-1"></v-icon>
            {{ asset.tag }} &nbsp;|&nbsp; ID: {{ asset.id }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)" />
      </div>

      <v-card-text class="pa-4">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-6">
          <v-progress-circular indeterminate color="primary" size="40" />
          <div class="mt-2 text-medium-emphasis text-caption">Loading history…</div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="text-center py-5">
          <v-icon icon="mdi-alert-circle" size="40" color="error" class="mb-2" />
          <p class="modal-empty-copy" style="color: rgba(var(--v-theme-error), 0.95);">{{ errorMessage }}</p>
        </div>

        <!-- Timeline -->
        <div v-else>
          <v-timeline density="compact" align="start" truncate-line="both">
            <v-timeline-item
              v-for="(event, index) in timelineEvents"
              :key="event.key || index"
              :dot-color="getEventColor(event.title || event.status || '')"
              size="small"
              fill-dot
            >
              <div class="mb-3">
                <div class="d-flex justify-space-between align-start flex-wrap gap-2 mb-1">
                  <strong class="modal-event-title font-weight-bold">{{ event.title }}</strong>
                  <span class="modal-meta text-medium-emphasis">{{ event.date }}</span>
                </div>
                <div v-if="event.employee" class="modal-meta text-medium-emphasis mb-2">
                  <v-icon icon="mdi-account" size="14" class="mr-1"></v-icon>
                  {{ event.employee }}
                </div>
                <div v-else class="modal-meta text-medium-emphasis mb-2">
                  <v-icon icon="mdi-account" size="14" class="mr-1"></v-icon>
                  Unknown
                </div>
                <v-sheet color="grey-lighten-4" class="pa-2 rounded-md modal-note border">
                  {{ event.notes }}
                </v-sheet>

                <div v-if="event.returnedAt" class="mt-2">
                  <v-chip size="x-small" variant="tonal" color="grey-darken-2">Returned: {{ event.returnedAt }}</v-chip>
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>

          <div v-if="!timelineEvents || timelineEvents.length === 0" class="text-center py-5 text-medium-emphasis">
            <v-icon icon="mdi-history" size="40" color="grey-lighten-2" class="mb-2" />
            <p class="modal-empty-copy">No history recorded for this asset yet.</p>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-3 border-t bg-grey-lighten-4">
        <v-btn variant="text" color="primary" prepend-icon="mdi-printer" size="small">Print Log</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" rounded="md" @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TimelineEvent = {
  key?: string | number
  title: string
  date: string
  employee?: string
  notes: string
  status?: string
  returnedAt?: string
}

const props = defineProps<{
  modelValue: boolean
  asset: any
  loading?: boolean
  errorMessage?: string | null
  timelineEvents?: TimelineEvent[]
}>()

defineEmits(['update:modelValue'])


const timelineEvents = computed<TimelineEvent[]>(() => props.timelineEvents ?? [])

// Helper to color-code timeline dots based on the action/status
function getEventColor(actionOrStatus: string) {
  const lower = String(actionOrStatus).toLowerCase()
  if (lower.includes('assigned') || lower.includes('checkout')) return 'blue'
  if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('service')) return 'warning'
  if (lower.includes('purchased') || lower.includes('deployed') || lower.includes('created')) return 'success'
  if (lower.includes('returned') || lower.includes('retired') || lower.includes('checkin')) return 'grey-darken-2'
  if (lower.includes('unavailable') || lower.includes('inactive')) return 'grey'
  return 'primary'
}
</script>


<style scoped>
.gap-2 { gap: 8px; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.modal-title { font-size: 0.92rem; line-height: 1.2; }
.modal-event-title { font-size: 0.72rem; line-height: 1.2; }
.modal-meta { font-size: 0.67rem; line-height: 1.2; }
.modal-note { font-size: 0.69rem; line-height: 1.3; }
.modal-empty-copy { font-size: 0.72rem; line-height: 1.25; }
</style>

