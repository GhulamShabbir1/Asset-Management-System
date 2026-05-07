import api from './api'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
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

export interface AuthResponse {
  user: AuthUser
  token: string
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

export const login = (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data)

export const signup = (data: SignupPayload) => api.post('/auth/signup', data)

export const getCurrentUser = (signal?: AbortSignal) =>
  api.get<AuthUser>('/auth/me', {}, { signal })

export const logout = () => api.post('/auth/logout')

/**
 * Request password reset OTP
 */
export const forgetPassword = (data: ForgetPasswordPayload) =>
  api.post('/auth/forget-password', data)

export const verifySignup = (data: VerifySignupPayload) =>
  api.post('/auth/verify-signup', data)

/**
 * Reset password with token
 */
export const resetPassword = (data: ResetPasswordPayload) =>
  api.post('/auth/reset-password', data)

export default {
  login,
  signup,
  getCurrentUser,
  logout,
  forgetPassword,
  verifySignup,
  resetPassword,
}
