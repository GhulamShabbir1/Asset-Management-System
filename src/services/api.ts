import { handleApiError } from '@/utils/errorHandler'
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import apiClient from './apiClient'
import { createManagedSignal, createRequestKey } from './requestManager'

export interface RequestOptions {
  signal?: AbortSignal
  timeout?: number
  headers?: Record<string, string>
  requestKey?: string
  cancelPrevious?: boolean
  responseType?: AxiosRequestConfig['responseType']
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

const buildConfig = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options: RequestOptions = {}
) => {
  const config: AxiosRequestConfig = {
    timeout: options.timeout,
    headers: options.headers,
    responseType: options.responseType,
    onUploadProgress: options.onUploadProgress,
  }

  if (options.cancelPrevious) {
    const requestKey = options.requestKey || createRequestKey(method, url)
    const managedRequest = createManagedSignal(requestKey, options.signal)

    return {
      config: {
        ...config,
        signal: managedRequest.signal,
      },
      cleanup: managedRequest.cleanup,
    }
  }

  return {
    config: {
      ...config,
      signal: options.signal,
    },
    cleanup: undefined,
  }
}

const executeRequest = async <T>(
  request: Promise<{ data: T }>,
  cleanup?: () => void
): Promise<T> => {
  try {
    const response = await request
    return response.data
  } catch (error) {
    return handleApiError(error)
  } finally {
    cleanup?.()
  }
}

const get = async <T = unknown>(
  url: string,
  params: Record<string, unknown> = {},
  options: RequestOptions = {}
): Promise<T> => {
  const { config, cleanup } = buildConfig('GET', url, options)
  return executeRequest<T>(apiClient.get(url, { ...config, params }), cleanup)
}

const post = async <T = unknown>(
  url: string,
  payload: unknown = {},
  options: RequestOptions = {}
): Promise<T> => {
  const { config, cleanup } = buildConfig('POST', url, options)
  return executeRequest<T>(apiClient.post(url, payload, config), cleanup)
}

const put = async <T = unknown>(
  url: string,
  payload: unknown = {},
  options: RequestOptions = {}
): Promise<T> => {
  const { config, cleanup } = buildConfig('PUT', url, options)
  return executeRequest<T>(apiClient.put(url, payload, config), cleanup)
}

const patch = async <T = unknown>(
  url: string,
  payload: unknown = {},
  options: RequestOptions = {}
): Promise<T> => {
  const { config, cleanup } = buildConfig('PUT', url, options)
  return executeRequest<T>(apiClient.patch(url, payload, config), cleanup)
}

const del = async <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { config, cleanup } = buildConfig('DELETE', url, options)
  return executeRequest<T>(apiClient.delete(url, config), cleanup)
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
}
