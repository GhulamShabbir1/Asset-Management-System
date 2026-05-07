import * as authService from '@/services/authService'
import { ApiError } from '@/utils/errorHandler'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type User = authService.AuthUser

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
    const loading = ref(false)
    const initialized = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => Boolean(token.value))

    const setSession = (nextUser: User | null, nextToken: string | null) => {
      user.value = nextUser
      token.value = nextToken

      if (nextToken) {
        localStorage.setItem(TOKEN_KEY, nextToken)
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
    }

    const clearError = () => {
      error.value = null
    }

    const clearSession = () => {
      setSession(null, null)
      error.value = null
    }

    const login = async (payload: authService.LoginPayload): Promise<authService.AuthResponse> => {
      loading.value = true
      clearError()

      try {
        const response = await authService.login(payload)
        setSession(response.user, response.token)
        return response
      } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Login failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    const signup = async (payload: authService.SignupPayload): Promise<unknown> => {
      loading.value = true
      clearError()

      try {
        return await authService.signup(payload)
      } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Registration failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    const verifySignup = async (payload: authService.VerifySignupPayload): Promise<unknown> => {
      loading.value = true
      clearError()

      try {
        return await authService.verifySignup(payload)
      } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Verification failed'
        throw err
      } finally {
        loading.value = false
      }
    }

    const forgetPassword = async (
      payload: authService.ForgetPasswordPayload
    ): Promise<unknown> => {
      loading.value = true
      clearError()

      try {
        return await authService.forgetPassword(payload)
      } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Failed to send reset code'
        throw err
      } finally {
        loading.value = false
      }
    }

    const resetPassword = async (
      payload: authService.ResetPasswordPayload
    ): Promise<unknown> => {
      loading.value = true
      clearError()

      try {
        return await authService.resetPassword(payload)
      } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Failed to reset password'
        throw err
      } finally {
        loading.value = false
      }
    }

    const fetchUser = async (signal?: AbortSignal): Promise<User | null> => {
      if (!token.value) {
        initialized.value = true
        return null
      }

      loading.value = true
      clearError()

      try {
        const currentUser = await authService.getCurrentUser(signal)
        user.value = currentUser
        return currentUser
      } catch (err) {
        if (!(err instanceof ApiError && err.isCancelled)) {
          error.value = err instanceof ApiError ? err.message : 'Failed to fetch user'
        }
        throw err
      } finally {
        loading.value = false
        initialized.value = true
      }
    }

    const logout = async () => {
      loading.value = true

      try {
        await authService.logout()
      } catch (err) {
        console.error('Logout request failed:', err)
      } finally {
        clearSession()
        loading.value = false
      }
    }

    return {
      user,
      token,
      loading,
      initialized,
      error,
      isAuthenticated,
      login,
      signup,
      verifySignup,
      forgetPassword,
      resetPassword,
      fetchUser,
      logout,
      clearError,
      clearSession,
      setSession,
    }
  }
)
