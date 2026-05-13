<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateCategoryModal from '@/components/modals/CreateCategoryModal.vue'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue' // <-- 1. IMPORT ADDED
import categoryService, { type Category } from '@/services/categoryService'

const categories = ref<Category[]>([])
const isLoading = ref(false)

// Create/Edit Modal State
const showModal = ref(false)
const selectedCategory = ref<Category | null>(null)

// --- 2. NEW DELETE MODAL STATE & FUNCTIONS ADDED HERE ---
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const itemToDelete = ref<{ id: number | string, name: string } | null>(null)

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await categoryService.getAllCategories() as any
    if (response && response.data) {
      categories.value = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || [])
    } else if (Array.isArray(response)) {
      categories.value = response
    } else {
      categories.value = []
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = [] 
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

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

// Opens the beautiful red modal instead of browser confirm()
const openDeleteModal = (id: number | string, name: string) => {
  itemToDelete.value = { id, name }
  showDeleteModal.value = true
}

// Runs when user clicks "Delete" inside the red modal
const confirmDelete = async () => {
  if (!itemToDelete.value) return

  isDeleting.value = true
  try {
    await categoryService.deleteCategory(itemToDelete.value.id)
    fetchCategories()
    showDeleteModal.value = false // Close on success
  } catch (error: any) {
    alert(`Delete Failed: ${error.message}`)
  } finally {
    isDeleting.value = false
    itemToDelete.value = null
  }
}
</script>

<template>
  <v-container fluid class="pa-0 mx-auto" style="max-width: 1400px;">
    <div class="d-flex justify-start align-center mb-6 mt-6">
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
                  <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openDeleteModal(item.id, item.name)" />
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

  <ConfirmDeleteModal
    v-model="showDeleteModal"
    title="Delete Category"
    :item-name="itemToDelete?.name"
    :is-loading="isDeleting"
    @confirm="confirmDelete"
  />
</template>