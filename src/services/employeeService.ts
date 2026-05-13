import api, { type RequestOptions } from './api'

// Employee interface matching API payload structure
export interface Employee {
  id?: number | string
  employee_id?: number | string  // Backend may use this field name
  emp_id?: number | string       // Alternative naming
  name: string
  father_name?: string
  contact_info: string
  email?: string
  address?: string
  designation?: string
  joining_date?: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  department_id: number
  image?: string
  lastActivity?: string
  role?: 'Administrator' | 'Manager' | 'Regular User'
  hasAlert?: boolean
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Payload for create/update operations
export interface CreateEmployeePayload {
  name: string
  father_name?: string
  contact_info: string
  email?: string
  address?: string
  designation?: string
  joining_date?: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  department_id: number
}

/**
 * Fetch all employees from the API
 * @param params Query parameters (like page and per_page)
 * @param options Request options
 * @returns Promise with employee list
 */
export const getEmployees = (params: Record<string, any> = {}, options: RequestOptions = {}) => {
  return api.get<ApiResponse<any>>('/employees/read', params, options)
}

/**
 * Fetch a single employee by ID
 * @param id Employee ID
 * @param options Request options
 * @returns Promise with employee data
 */
export const getEmployeeById = (id: string | number, options: RequestOptions = {}) => {
  return api.get<ApiResponse<Employee>>(`/employees/read/${id}`, {}, options)
}

/**
 * Create a new employee
 * @param payload Employee data
 * @param options Request options
 * @returns Promise with created employee data
 */
export const createEmployee = (payload: CreateEmployeePayload, options: RequestOptions = {}) => {
  return api.post<ApiResponse<Employee>>('/employees/create', payload, options)
}

/**
 * Update an existing employee
 * @param id Employee ID
 * @param payload Updated employee data
 * @param options Request options
 * @returns Promise with updated employee data
 */
export const updateEmployee = (
  id: string | number,
  payload: Partial<CreateEmployeePayload>,
  options: RequestOptions = {}
) => {
  return api.put<ApiResponse<Employee>>(`/employees/update/${id}`, payload, options)
}

/**
 * Extract the proper employee ID from employee object
 * Handles different backend field naming conventions
 */
export const getEmployeeId = (employee: Employee | any): number | string | null => {
  const id = employee?.employee_id || employee?.id || employee?.emp_id
  if (!id) {
    console.warn('Employee ID not found in:', employee)
    return null
  }
  return id
}

/**
 * Delete an employee
 * @param id Employee ID
 * @param options Request options
 * @returns Promise with success response
 */
export const deleteEmployee = (id: string | number, options: RequestOptions = {}) => {
  if (!id || id === 'undefined') {
    throw new Error('Invalid employee ID: ' + id)
  }
  
  const endpoint = `/employees/delete/${id}`
  console.log('Calling delete endpoint:', {
    endpoint,
    employeeId: id,
  })
  return api.delete<ApiResponse<null>>(endpoint, options)
}

/**
 * Test delete endpoint (for debugging)
 * Tries multiple endpoint formats to find which one works
 */
export const testDeleteEndpoint = async (id: string | number) => {
  const endpoints = [
    `/employees/delete/${id}`,
    `/employees/${id}`,
    `/api/employees/delete/${id}`,
    `/api/employees/${id}`,
  ]

  const results = []

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`)
      const response = await api.delete<any>(endpoint)
      results.push({
        endpoint,
        status: 'SUCCESS',
        response,
      })
    } catch (error: any) {
      results.push({
        endpoint,
        status: 'FAILED',
        error: error?.message,
        status_code: error?.status,
      })
    }
  }

  console.table(results)
  return results
}

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeId,
  testDeleteEndpoint,
}