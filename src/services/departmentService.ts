import api, { type RequestOptions } from './api'

export interface Department {
  id: number | string
  department_name: string
  status: boolean
}

export interface CreateDepartmentPayload {
  department_name: string
  status: boolean
}

export interface UpdateDepartmentPayload {
  department_name?: string
  status?: boolean
}

export interface PaginatedDepartments {
  current_page: number
  data: Department[]
  total: number
}

export const createDepartment = (payload: CreateDepartmentPayload, options: RequestOptions = {}) => {
  return api.post<any>('/departments/create', payload, options)
}

export const getDepartmentById = (id: string | number, options: RequestOptions = {}) => {
  return api.get<any>(`/departments/${id}`, {}, options)
}

export const updateDepartment = (id: string | number, payload: UpdateDepartmentPayload, options: RequestOptions = {}) => {
  // UPDATED: Matches backend format /departments/update/{id}
  return api.put<any>(`/departments/update/${id}`, payload, options)
}

export const deleteDepartment = (id: string | number, options: RequestOptions = {}) => {
  // UPDATED: Matches backend format /departments/delete/{id}
  return api.delete<any>(`/departments/delete/${id}`, options)
}

export const getAllDepartments = (options: RequestOptions = {}) => {
  return api.get<{ success: boolean; message: string; data: PaginatedDepartments }>('/departments/read', {}, options)
}

export default {
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getAllDepartments
}