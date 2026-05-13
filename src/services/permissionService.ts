import api, { type RequestOptions } from './api'

/**
 * Permission interface representing a permission in the system
 */
export interface Permission {
  permission_id: number
  permission_name: string
  display_name: string
  module: string
  action: string
  description?: string
  created_at?: string
  updated_at?: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  errors?: any
}

/**
 * Get all permissions
 * @param options - Request options
 * @returns List of all permissions
 */
export const getAllPermissions = (options: RequestOptions = {}) =>
  api.get<ApiResponse<Permission[]>>('permissions', {}, options)

/**
 * Get permissions grouped by module
 * @param options - Request options
 * @returns Object with module names as keys and arrays of permissions as values
 */
export const getGroupedPermissions = (options: RequestOptions = {}) =>
  api.get<ApiResponse<Record<string, Permission[]>>>('permissions/grouped', {}, options)

/**
 * Get a specific permission by ID
 * @param id - Permission ID
 * @param options - Request options
 * @returns Single permission details
 */
export const getPermissionById = (id: number | string, options: RequestOptions = {}) =>
  api.get<ApiResponse<Permission>>(`permissions/${id}`, {}, options)

/**
 * Get permissions for a specific module
 * @param moduleName - Name of the module
 * @param options - Request options
 * @returns List of permissions for the module
 */
export const getPermissionsByModule = (moduleName: string, options: RequestOptions = {}) =>
  api.get<ApiResponse<Permission[]>>('permissions/by-module', { module: moduleName }, options)

/**
 * Get list of all unique module names
 * @param options - Request options
 * @returns List of module names
 */
export const getPermissionModules = (options: RequestOptions = {}) =>
  api.get<ApiResponse<string[]>>('permissions/modules', {}, options)

export default {
  getAllPermissions,
  getGroupedPermissions,
  getPermissionById,
  getPermissionsByModule,
  getPermissionModules,
}
