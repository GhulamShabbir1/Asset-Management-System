import api, { type RequestOptions } from './api'

export interface AssetCategory {
  id: number
  name: string
}

export interface AssetDepartment {
  id: number
  name: string
}

export interface Asset {
  id: number | string
  assetName: string
  assetCode: string
  category: AssetCategory
  department: AssetDepartment
  totalQuantity: number
  remainingQuantity: number
  status: string
  assetImage?: string | null
}

export interface PaginatedAssetResponse {
  list: Asset[]
  meta: {
    currentPage: number
    perPage: number
    total: number
    lastPage: number
  }
}

export interface CreateAssetPayload {
  asset_name: string
  asset_code: string
  category_id: number
  department_id: number
  total_quantity: number
  brand?: string
  purchase_date?: string
  status?: string
  asset_image?: File | null
  invoice_image?: File | null
}

export const getAssets = (params: Record<string, any> = {}, options: RequestOptions = {}) => {
  return api.get<{ success: boolean; message: string; data: PaginatedAssetResponse }>('/assets', params, options)
}

export const getAssetById = (id: string | number, options: RequestOptions = {}) => {
  return api.get<{ success: boolean; message: string; data: Asset }>(`/assets/${id}`, {}, options)
}

export const createAsset = (payload: CreateAssetPayload, options: RequestOptions = {}) => {
  const formData = new FormData()
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value as string | Blob)
    }
  })

  return api.post<{ success: boolean; message: string; data: any }>('/assets', formData, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateAsset = (id: string | number, payload: Partial<CreateAssetPayload>, options: RequestOptions = {}) => {
  const formData = new FormData()
  formData.append('_method', 'PUT') // Backend requirement for multipart updates
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value as string | Blob)
    }
  })

  return api.post<{ success: boolean; message: string; data: any }>(`/assets/${id}`, formData, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteAsset = (id: string | number, options: RequestOptions = {}) => {
  return api.delete<{ success: boolean; message: string; data: null }>(`/assets/${id}`, options)
}

export default {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
}