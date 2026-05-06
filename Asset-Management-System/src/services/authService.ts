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

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export const login = (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data)

export const register = (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data)

export const getCurrentUser = (signal?: AbortSignal) =>
  api.get<AuthUser>('/auth/me', {}, { signal })

export const logout = () => api.post('/auth/logout')

export default {
  login,
  register,
  getCurrentUser,
  logout,
}
