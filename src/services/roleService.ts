import api, { type RequestOptions } from './api'

/**
 * Role interface representing a role in the system
 */
export interface Role {
  id: number | string
  name: string
  description: string
  permissions: number[]
  is_system?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Create Role Payload
 */
export interface CreateRolePayload {
  name: string
  description: string
  permission: number[]
}

/**
 * Update Role Payload
 */
export interface UpdateRolePayload {
  name?: string
  description?: string
  permissions?: number[]
}

/**
 * Role API Response wrapper
 */
export interface RoleResponse<T> {
  success: boolean
  message: string
  data: T
}

/**
 * Create a new role
 * @param payload - Role data (name, description, permissions)
 * @param options - Request options
 * @returns Created role
 */
export const createRole = (payload: CreateRolePayload, options: RequestOptions = {}) =>
  api.post<RoleResponse<Role>>('role/create', payload, options)

/**
 * Get all roles
 * @param params - Query parameters
 * @param options - Request options
 * @returns List of roles
 */
export const getRoles = (params: Record<string, unknown> = {}, options: RequestOptions = {}) =>
  api.get<RoleResponse<Role[]>>('role/read', params, options)

/**
 * Get a specific role by ID
 * @param roleId - Role ID
 * @param options - Request options
 * @returns Role details
 */
export const getRoleById = (roleId: string | number, options: RequestOptions = {}) =>
  api.get<RoleResponse<Role>>(`role/read/${roleId}`, {}, options)

/**
 * Update a role
 * @param roleId - Role ID to update
 * @param payload - Updated role data
 * @param options - Request options
 * @returns Updated role
 */
export const updateRole = (
  roleId: string | number,
  payload: UpdateRolePayload,
  options: RequestOptions = {}
) => api.put<RoleResponse<Role>>(`role/update/${roleId}`, payload, options)

/**
 * Delete a role
 * @param roleId - Role ID to delete
 * @param options - Request options
 * @returns Deletion response
 */
export const deleteRole = (roleId: string | number, options: RequestOptions = {}) =>
  api.delete<RoleResponse<{ id: string | number }>>(`role/delete/${roleId}`, options)

/**
 * Check if a role has a specific permission
 * @param permissions - Array of permission IDs
 * @param permissionId - Permission ID to check
 * @returns True if role has permission
 */
export const hasPermission = (permissions: number[], permissionId: number): boolean => {
  return permissions.includes(permissionId)
}

/**
 * Get permissions for a role
 * @param roleId - Role ID
 * @param options - Request options
 * @returns Role permissions
 */
export const getRolePermissions = (roleId: string | number, options: RequestOptions = {}) =>
  api.get<RoleResponse<{ role_id: string | number; permissions: number[] }>>(
    `role/${roleId}/permissions`,
    {},
    options
  )

/**
 * Update role permissions
 * @param roleId - Role ID
 * @param permissions - Array of permission IDs
 * @param options - Request options
 * @returns Updated permissions
 */
export const updateRolePermissions = (
  roleId: string | number,
  permissions: number[],
  options: RequestOptions = {}
) =>
  api.put<RoleResponse<{ role_id: string | number; permissions: number[] }>>(
    `role/${roleId}/permissions`,
    { permissions },
    options
  )

export default {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  hasPermission,
  getRolePermissions,
  updateRolePermissions,
}
