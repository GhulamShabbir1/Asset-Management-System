<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateCategoryModal from '@/components/modals/CreateCategoryModal.vue'
import categoryService, { type Category } from '@/services/categoryService'

const categories = ref<Category[]>([])
const isLoading = ref(false)

// Modal State
const showModal = ref(false)
const selectedCategory = ref<Category | null>(null)

    const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await categoryService.getAllCategories() as any
    
    // Check if the response contains data
    if (response && response.data) {
      // Bulletproof check: gracefully handles both flat arrays AND paginated objects!
      categories.value = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || [])
    } 
    // Fallback just in case the backend returns the array directly without a wrapper
    else if (Array.isArray(response)) {
      categories.value = response
    } else {
      categories.value = []
    }
    
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = [] // Ensure it stays an array even on error to prevent crashes
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  fetchCategories()
})

// --- Actions ---

const openCreateModal = () => {
  selectedCategory.value = null
  showModal.value = true
}

const openEditModal = (category: Category) => {
  selectedCategory.value = { ...category }
  showModal.value = true
}

const handleSaveCategory = async (data: any) => {
  try {
    if (selectedCategory.value?.id) {
      await categoryService.updateCategory(selectedCategory.value.id, data)
    } else {
      await categoryService.createCategory(data)
    }
    showModal.value = false
    fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
  }
}

const deleteCategory = async (id: number | string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await categoryService.deleteCategory(id)
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-start align-center mb-4 mt-4">
      <v-btn
        color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none font-weight-bold rounded-md" elevation="0"
        @click="openCreateModal"
      >
        Add Category
      </v-btn>
    </div>

    <v-card elevation="0" border class="rounded-lg mb-4">
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Category Name</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Description</th>
            <th class="font-weight-bold text-medium-emphasis text-caption" style="text-transform: uppercase;">Status</th>
            <th class="font-weight-bold text-medium-emphasis text-caption text-right" style="text-transform: uppercase;">Actions</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="4" class="text-center py-10">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="categories.length === 0">
          <tr>
            <td colspan="4" class="text-center py-8 text-medium-emphasis text-body-2">
              No categories found.
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr v-for="item in categories" :key="item.id">
            <td class="font-weight-bold text-body-2">{{ item.name }}</td>
            <td class="text-body-2 text-medium-emphasis">{{ item.description || 'N/A' }}</td>
            <td>
              <v-chip size="small" variant="tonal" :color="item.status ? 'success' : 'grey-darken-1'" class="font-weight-bold text-uppercase">
                {{ item.status ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
            <td class="text-right" style="min-width: 100px;">
              <v-tooltip text="Edit Category" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="primary" class="mr-1" @click="openEditModal(item)" />
                </template>
              </v-tooltip>

              <v-tooltip text="Delete Category" location="top">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="deleteCategory(item.id)" />
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>

  <CreateCategoryModal 
    v-model="showModal" 
    :edit-data="selectedCategory"
    @submit="handleSaveCategory" 
  />
</template>