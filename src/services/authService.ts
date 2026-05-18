import api from './api'
import { ApiError } from '@/utils/errorHandler'

export interface AuthUser {
  id: string | number
  email: string
  name: string
  role?: string
  avatar?: string
  organization_id?: number
  organization?: {
    id: number
    name: string
    created_at?: string
    updated_at?: string
  }
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload extends LoginPayload {
  name: string
  organization: string
  confirm_password: string
}

export interface ForgetPasswordPayload {
  email: string
}

export interface VerifySignupPayload {
  verification_code: string
}

export interface ResetPasswordPayload {
  verification_code: string
  password: string
  confirm_password: string
}

export interface UpdatePasswordPayload {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface BackendLoginResponse {
  success: boolean
  message: string
  errors: null | any
  data: {
    access_token: string
    user: AuthUser
  }
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<BackendLoginResponse>('/auth/login', data)
  // Transform backend response to our expected format
  return {
    user: response.data.user,
    token: response.data.access_token,
  }
}

export const signup = (data: SignupPayload) => api.post('/auth/signup', data)

export const getCurrentUser = (signal?: AbortSignal) =>
  api.get<AuthUser>('/auth/me', {}, { signal })

export const logout = () => api.post('/auth/logout')

/**
 * Request password reset OTP
 */
export const forgetPassword = async (data: ForgetPasswordPayload) => {
  try {
    return await api.post('/auth/forgot-password', data)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return api.post('/auth/forget-password', data)
    }

    throw error
  }
}

export const verifySignup = (data: VerifySignupPayload) =>
  api.post('/auth/verify-signup', data)

/**
 * Reset password with token
 */
export const resetPassword = (data: ResetPasswordPayload) =>
  api.post('/auth/reset-password', data)

export interface UpdateProfilePayload {
  name: string
  profile_picture?: string | null
}

/**
 * Get all registered users
 */
export const readUsers = (options: RequestOptions = {}) =>
  api.get<AuthUser[]>('/auth/read', {}, options)

/**
 * Update password (requires authentication token)
 */
export const updatePassword = (data: UpdatePasswordPayload) =>
  api.patch('/auth/update-password', data)

/**
 * Update profile (requires authentication token)
 */
export const updateProfile = (data: UpdateProfilePayload) =>
  api.put('/auth/update', data)

export default {
  login,
  signup,
  getCurrentUser,
  logout,
  forgetPassword,
  verifySignup,
  resetPassword,
  updatePassword,
  updateProfile,
  readUsers,
}
