import api, { type RequestOptions } from './api'

export interface UserRecord {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface CreateUserPayload {
  email: string
  name: string
  role: string
  password: string
}

export interface UpdateUserPayload {
  email?: string
  name?: string
  role?: string
  avatar?: string
}

export const getUsers = (params: Record<string, unknown> = {}, options: RequestOptions = {}) =>
  api.get<UserRecord[]>('/users', params, options)

export const getUserById = (userId: string, options: RequestOptions = {}) =>
  api.get<UserRecord>(`/users/${userId}`, {}, options)

export const createUser = (payload: CreateUserPayload, options: RequestOptions = {}) =>
  api.post<UserRecord>('/users', payload, options)

export const updateUser = (
  userId: string,
  payload: UpdateUserPayload,
  options: RequestOptions = {}
) => api.put<UserRecord>(`/users/${userId}`, payload, options)

export const deleteUser = (userId: string, options: RequestOptions = {}) =>
  api.delete(`/users/${userId}`, options)

export const uploadUserAvatar = (
  userId: string,
  file: File,
  options: RequestOptions = {}
) => {
  const formData = new FormData()
  formData.append('avatar', file)

  return api.post<UserRecord>(`/users/${userId}/avatar`, formData, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadUserAvatar,
}
