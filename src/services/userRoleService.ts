import api, { type RequestOptions } from './api'

export interface UserRolePayload {
  user_id: number | string
  role_id: number | string
}

export interface UserRoleResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * Assign a role to a user
 */
export const assignRole = (payload: UserRolePayload, options: RequestOptions = {}) =>
  api.post<UserRoleResponse>('/user-role/assign', payload, options)

/**
 * Update a user's role
 */
export const updateRole = (userId: number | string, roleId: number | string, options: RequestOptions = {}) =>
  api.put<UserRoleResponse>(`/user-role/update/${userId}`, { role_id: roleId }, options)

/**
 * Read a user's role
 */
export const getUserRole = (userId: number | string, options: RequestOptions = {}) =>
  api.get<UserRoleResponse>(`/user-role/read/${userId}`, {}, options)

/**
 * Remove a user's role
 */
export const deleteRole = (userId: number | string, options: RequestOptions = {}) =>
  api.delete<UserRoleResponse>(`/user-role/delete/${userId}`, options)

export default {
  assignRole,
  updateRole,
  getUserRole,
  deleteRole,
}
