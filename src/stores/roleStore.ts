import type { CreateRolePayload, Role, UpdateRolePayload } from '@/services/roleService'
import * as roleService from '@/services/roleService'
import { ApiError } from '@/utils/errorHandler'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Computed: Check if any roles are loaded
   */
  const hasRoles = computed(() => roles.value.length > 0)

  /**
   * Computed: Get system roles only
   */
  const systemRoles = computed(() => roles.value.filter((r) => r.is_system))

  /**
   * Computed: Get custom roles only
   */
  const customRoles = computed(() => roles.value.filter((r) => !r.is_system))

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Fetch all roles from API
   */
  const fetchRoles = async () => {
    loading.value = true
    clearError()

    try {
      const response = await roleService.getRoles()
      const data = (response as any)?.data
      roles.value = (Array.isArray(data) ? data : []).map((r: any) => ({
        ...r,
        id: r.id || r.role_id // Normalize ID from backend
      }))
      return roles.value
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch roles'
      console.error('Error fetching roles:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a specific role by ID
   */
  const getRole = async (roleId: string | number) => {
    clearError()

    try {
      const response = await roleService.getRoleById(roleId)
      const role = (response as any)?.data
      currentRole.value = role
      return role
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch role'
      console.error('Error fetching role:', err)
      return null
    }
  }

  /**
   * Create a new role
   */
  const createRole = async (payload: CreateRolePayload) => {
    loading.value = true
    clearError()

    try {
      const response = await roleService.createRole(payload)
      const newRole = (response as any)?.data
      roles.value.push(newRole)
      currentRole.value = newRole
      return newRole
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to create role'
      console.error('Error creating role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing role
   */
  const updateRoleAction = async (roleId: string | number, payload: UpdateRolePayload) => {
    loading.value = true
    clearError()

    try {
      const response = await roleService.updateRole(roleId, payload)
      const updatedRole = (response as any)?.data

      // Update in roles array
      const index = roles.value.findIndex((r) => r.id === roleId)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }

      // Update current role if it matches
      if (currentRole.value?.id === roleId) {
        currentRole.value = updatedRole
      }

      return updatedRole
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to update role'
      console.error('Error updating role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a role
   */
  const deleteRoleAction = async (roleId: string | number) => {
    loading.value = true
    clearError()

    try {
      await roleService.deleteRole(roleId)
      roles.value = roles.value.filter((r) => r.id !== roleId)

      if (currentRole.value?.id === roleId) {
        currentRole.value = null
      }

      return true
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to delete role'
      console.error('Error deleting role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update role permissions
   */
  const updateRolePermissions = async (roleId: string | number, permissions: number[]) => {
    loading.value = true
    clearError()

    try {
      const response = await roleService.updateRolePermissions(roleId, permissions)
      const updatedData = (response as any)?.data

      // Update permissions in roles array
      const index = roles.value.findIndex((r) => r.id === roleId)
      if (index !== -1) {
        roles.value[index].permissions = permissions
      }

      // Update current role permissions
      if (currentRole.value?.id === roleId) {
        currentRole.value.permissions = permissions
      }

      return updatedData
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Failed to update permissions'
      console.error('Error updating permissions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if a role has a specific permission
   */
  const checkRolePermission = (roleId: string | number, permissionId: number): boolean => {
    const role = roles.value.find((r) => r.id === roleId)
    return role ? roleService.hasPermission(role.permissions, permissionId) : false
  }

  return {
    // State
    roles,
    currentRole,
    loading,
    error,

    // Computed
    hasRoles,
    systemRoles,
    customRoles,

    // Actions
    clearError,
    fetchRoles,
    getRole,
    createRole,
    updateRoleAction,
    deleteRoleAction,
    updateRolePermissions,
    checkRolePermission,
  }
})
