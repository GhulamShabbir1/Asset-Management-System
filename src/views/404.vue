<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <v-container fluid class="fill-height bg-surface pa-0">
    <v-row no-gutters class="fill-height ma-0 align-center justify-center">
      <v-col cols="12" class="pa-6 pa-md-12 d-flex align-center justify-center">
        <div class="text-center">
          <v-avatar color="primary" size="72" class="mb-6 mx-auto">
            <v-icon size="32" color="white">mdi-compass-off-outline</v-icon>
          </v-avatar>

          <div class="text-h2 text-sm-h1 font-weight-black text-primary mb-2">
            404
          </div>

          <h1 class="text-h4 text-sm-h3 font-weight-bold mb-3">
            Page not found
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-8 mx-auto" style="max-width: 36rem;">
            The page you are looking for may have been moved, renamed, or no longer exists.
          </p>

          <div class="d-flex flex-column flex-sm-row justify-center ga-3">
            <v-btn color="primary" size="large" class="text-none font-weight-bold px-6" to="/dashboard">
              Go to Dashboard
            </v-btn>
            <v-btn variant="outlined" size="large" class="text-none font-weight-bold px-6" @click="goBack">
              Go Back
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>