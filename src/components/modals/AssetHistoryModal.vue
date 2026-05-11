<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="700px" 
    rounded="xl"
  >
    <v-card rounded="xl" elevation="0" border v-if="asset">
      
      <div class="pa-4 border-b bg-grey-lighten-4 d-flex justify-space-between align-center">
        <div>
          <v-chip :color="asset.statusColor" size="x-small" class="mb-2 font-weight-bold text-uppercase" variant="flat">
            {{ asset.status }}
          </v-chip>
          <h2 class="text-h6 font-weight-bold mb-0" style="line-height: 1.2;">{{ asset.name }}</h2>
          <div class="text-caption text-medium-emphasis mt-1">
            <v-icon icon="mdi-barcode-scan" size="14" class="mr-1"></v-icon>
            {{ asset.tag }} &nbsp;|&nbsp; ID: {{ asset.id }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
      </div>

      <v-card-text class="pa-6">
        <v-timeline density="compact" align="start" truncate-line="both">
          <v-timeline-item
            v-for="(event, index) in asset.history"
            :key="index"
            :dot-color="getEventColor(event.action)"
            size="small"
            fill-dot
          >
            <div class="mb-4">
              <div class="d-flex justify-space-between align-start flex-wrap gap-2 mb-1">
                <strong class="text-body-2 font-weight-bold">{{ event.action }}</strong>
                <span class="text-caption text-medium-emphasis">{{ event.date }}</span>
              </div>
              <div class="text-caption text-medium-emphasis mb-2">
                <v-icon icon="mdi-account" size="14" class="mr-1"></v-icon> {{ event.user }}
              </div>
              <v-sheet color="grey-lighten-4" class="pa-3 rounded-lg text-body-2 border">
                {{ event.notes }}
              </v-sheet>
            </div>
          </v-timeline-item>
        </v-timeline>

        <div v-if="!asset.history || asset.history.length === 0" class="text-center py-6 text-medium-emphasis">
          <v-icon icon="mdi-history" size="40" color="grey-lighten-2" class="mb-2"></v-icon>
          <p class="text-body-2">No history recorded for this asset yet.</p>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 border-t bg-grey-lighten-4">
        <v-btn variant="text" color="primary" prepend-icon="mdi-printer" size="small">Print Log</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" rounded="lg" @click="$emit('update:modelValue', false)">Close</v-btn>
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
</style>