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
          <v-chip :color="asset.statusColor" size="x-small" class="mb-2 font-weight-bold text-uppercase" variant="flat">
            {{ asset.status }}
          </v-chip>
          <h2 class="modal-title font-weight-bold mb-0">{{ asset.name }}</h2>
          <div class="modal-meta text-medium-emphasis mt-1">
            <v-icon icon="mdi-barcode-scan" size="14" class="mr-1"></v-icon>
            {{ asset.tag }} &nbsp;|&nbsp; ID: {{ asset.id }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
      </div>

      <v-card-text class="pa-4">
        <v-timeline density="compact" align="start" truncate-line="both">
          <v-timeline-item
            v-for="(event, index) in asset.history"
            :key="index"
            :dot-color="getEventColor(event.action)"
            size="small"
            fill-dot
          >
            <div class="mb-3">
              <div class="d-flex justify-space-between align-start flex-wrap gap-2 mb-1">
                <strong class="modal-event-title font-weight-bold">{{ event.action }}</strong>
                <span class="modal-meta text-medium-emphasis">{{ event.date }}</span>
              </div>
              <div class="modal-meta text-medium-emphasis mb-2">
                <v-icon icon="mdi-account" size="14" class="mr-1"></v-icon> {{ event.user }}
              </div>
              <v-sheet color="grey-lighten-4" class="pa-2 rounded-md modal-note border">
                {{ event.notes }}
              </v-sheet>
            </div>
          </v-timeline-item>
        </v-timeline>

        <div v-if="!asset.history || asset.history.length === 0" class="text-center py-5 text-medium-emphasis">
          <v-icon icon="mdi-history" size="40" color="grey-lighten-2" class="mb-2"></v-icon>
          <p class="modal-empty-copy">No history recorded for this asset yet.</p>
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
defineProps<{
  modelValue: boolean
  asset: any
}>()

defineEmits(['update:modelValue'])

// Helper to color-code timeline dots based on the action word
function getEventColor(action: string) {
  const lowerAction = action.toLowerCase()
  if (lowerAction.includes('assigned')) return 'blue'
  if (lowerAction.includes('maintenance') || lowerAction.includes('repair')) return 'warning'
  if (lowerAction.includes('purchased') || lowerAction.includes('deployed')) return 'success'
  if (lowerAction.includes('returned') || lowerAction.includes('retired')) return 'grey-darken-2'
  return 'primary'
}
</script>

<style scoped>
.gap-2 { gap: 8px; }
.border-b { border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.border-t { border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.modal-title {
  font-size: 0.92rem;
  line-height: 1.2;
}
.modal-event-title {
  font-size: 0.72rem;
  line-height: 1.2;
}
.modal-meta {
  font-size: 0.67rem;
  line-height: 1.2;
}
.modal-note {
  font-size: 0.69rem;
  line-height: 1.3;
}
.modal-empty-copy {
  font-size: 0.72rem;
  line-height: 1.25;
}
</style>
