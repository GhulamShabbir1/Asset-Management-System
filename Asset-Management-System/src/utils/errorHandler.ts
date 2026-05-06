import axios, { AxiosError } from 'axios'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export interface ApiErrorDetails {
  message: string
  status: number | null
  code?: string
  data?: unknown
  isNetworkError: boolean
  isTimeout: boolean
  isCancelled: boolean
}

export class ApiError extends Error {
  status: number | null
  code?: string
  data?: unknown
  isNetworkError: boolean
  isTimeout: boolean
  isCancelled: boolean

  constructor(details: ApiErrorDetails) {
    super(details.message)
    this.name = 'ApiError'
    this.status = details.status
    this.code = details.code
    this.data = details.data
    this.isNetworkError = details.isNetworkError
    this.isTimeout = details.isTimeout
    this.isCancelled = details.isCancelled
  }
}

const extractServerMessage = (data: unknown) => {
  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data === 'object' && data !== null) {
    if ('message' in data && data.message) {
      return String(data.message)
    }

    if ('error' in data && data.error) {
      return String(data.error)
    }
  }

  return null
}

export const normalizeApiError = (error: unknown) => {
  if (axios.isCancel(error)) {
    return new ApiError({
      message: 'Request cancelled',
      status: null,
      code: 'REQUEST_CANCELLED',
      isNetworkError: false,
      isTimeout: false,
      isCancelled: true,
    })
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const status = axiosError.response?.status ?? null
    const data = axiosError.response?.data
    const serverMessage = extractServerMessage(data)
    const isTimeout = axiosError.code === 'ECONNABORTED'
    const isNetworkError = !axiosError.response && !isTimeout

    const message =
      serverMessage ||
      (status === 401
        ? 'Your session has expired. Please sign in again.'
        : status && status >= 500
          ? 'Server error. Please try again in a moment.'
          : isTimeout
            ? 'The request took too long. Please try again.'
            : isNetworkError
              ? 'Unable to connect. Please check your internet connection.'
              : axiosError.message || 'Something went wrong.')

    return new ApiError({
      message,
      status,
      code: axiosError.code,
      data,
      isNetworkError,
      isTimeout,
      isCancelled: false,
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      status: null,
      isNetworkError: false,
      isTimeout: false,
      isCancelled: false,
    })
  }

  return new ApiError({
    message: 'An unexpected error occurred.',
    status: null,
    isNetworkError: false,
    isTimeout: false,
    isCancelled: false,
  })
}

export const handleApiError = (error: unknown): never => {
  const normalizedError = normalizeApiError(error)

  if (normalizedError.status === 401) {
    localStorage.removeItem('auth_token')
    window.dispatchEvent(
      new CustomEvent(UNAUTHORIZED_EVENT, {
        detail: normalizedError,
      })
    )
  }

  console.error('API Error:', {
    message: normalizedError.message,
    status: normalizedError.status,
    data: normalizedError.data,
    code: normalizedError.code,
  })

  throw normalizedError
}
