import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as permissionService from '@/services/permissionService'
import type { Permission } from '@/services/permissionService'
import { ApiError } from '@/utils/errorHandler'

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>([])
  const groupedPermissions = ref<Record<string, Permission[]>>({})
  const modules = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Fetch all permissions
   */
  const fetchAllPermissions = async () => {
    loading.value = true
    clearError()
    try {
      const response = await permissionService.getAllPermissions()
      permissions.value = response.data || []
      return permissions.value
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch permissions'
      console.error('Error fetching permissions:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch grouped permissions
   */
  const fetchGroupedPermissions = async () => {
    loading.value = true
    clearError()
    try {
      const response = await permissionService.getGroupedPermissions()
      groupedPermissions.value = response.data || {}
      return groupedPermissions.value
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch grouped permissions'
      console.error('Error fetching grouped permissions:', err)
      return {}
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch all modules
   */
  const fetchModules = async () => {
    loading.value = true
    clearError()
    try {
      const response = await permissionService.getPermissionModules()
      modules.value = response.data || []
      return modules.value
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch modules'
      console.error('Error fetching modules:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    permissions,
    groupedPermissions,
    modules,
    loading,
    error,

    // Actions
    clearError,
    fetchAllPermissions,
    fetchGroupedPermissions,
    fetchModules,
  }
})
