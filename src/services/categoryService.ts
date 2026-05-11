import api, { type RequestOptions } from './api'

// --- Interfaces ---
export interface Category {
  id: number | string
  name: string
  description?: string
  status: boolean
}

export interface CreateCategoryPayload {
  name: string
  description: string
  status: boolean
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string
  status?: boolean
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: Category
}

export interface DeleteCategoryResponse {
  success: boolean
  message: string
  data: null
}

export interface PaginatedCategories {
    current_page: number
    data: Category[]
    total: number
  }

// --- API Calls ---

export const createCategory = (payload: CreateCategoryPayload, options: RequestOptions = {}) => {
  return api.post<CategoryResponse>('/categories/create', payload, options)
}

export const getCategoryById = (id: string | number, options: RequestOptions = {}) => {
  return api.get<CategoryResponse>(`/categories/${id}`, {}, options)
}

export const updateCategory = (id: string | number, payload: UpdateCategoryPayload, options: RequestOptions = {}) => {
  return api.put<CategoryResponse>(`/categories/${id}/update`, payload, options)
}

export const deleteCategory = (id: string | number, options: RequestOptions = {}) => {
  return api.delete<DeleteCategoryResponse>(`/categories/${id}/delete`, options)
}

export const getAllCategories = (options: RequestOptions = {}) => {
    return api.get<{ success: boolean; message: string; data: PaginatedCategories }>('/categories/read', {}, options)
  }

export default {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
}