import api, { type RequestOptions } from './api'

export interface CheckoutPayload {
  asset_id: number
  employee_id: number
  quantity: number
  description: string
}

export interface CheckinPayload {
  asset_id: number
}

export interface AssignmentRecord {
  assignment_id: number
  asset_id: number
  employee_id: number
  assigned_by: number
  quantity: number
  status: string
  assign_date: string
  return_date: string | null
  is_active: boolean
}

export const checkoutAsset = (payload: CheckoutPayload, options: RequestOptions = {}) => {
  // Updated to POST /api/assignments
  return api.post<{ success: boolean; message: string; data: AssignmentRecord }>('/assignments', payload, options)
}

export const checkinAsset = (payload: CheckinPayload, options: RequestOptions = {}) => {
  // Updated to PATCH /api/assignments/return
  return api.patch<{ success: boolean; message: string; data: AssignmentRecord }>('/assignments/return', payload, options)
}

export const getAssignmentHistory = (assetId?: string | number, options: RequestOptions = {}) => {
  // Uses GET /api/assignments/history (or /api/assignments/history/{id} if checking a specific asset)
  const url = assetId ? `/assignments/history/${assetId}` : '/assignments/history'
  return api.get<{ success: boolean; message: string; data: AssignmentRecord[] }>(url, {}, options)
}

export default {
  checkoutAsset,
  checkinAsset,
  getAssignmentHistory
}