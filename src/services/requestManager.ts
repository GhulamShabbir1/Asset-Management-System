const pendingRequests = new Map<string, AbortController>()

const buildReason = (key: string) => `Canceled previous request for "${key}".`

export const createRequestKey = (
  method: string,
  url: string,
  identifier?: string
) => `${method.toUpperCase()}:${url}:${identifier || 'default'}`

export const cancelRequest = (key: string) => {
  const controller = pendingRequests.get(key)

  if (controller) {
    controller.abort(buildReason(key))
    pendingRequests.delete(key)
  }
}

export const cancelAllRequests = () => {
  pendingRequests.forEach((controller, key) => {
    controller.abort(buildReason(key))
  })

  pendingRequests.clear()
}

export const createAbortController = () => new AbortController()

export const createManagedSignal = (key: string, externalSignal?: AbortSignal) => {
  cancelRequest(key)

  const controller = createAbortController()
  pendingRequests.set(key, controller)

  const handleExternalAbort = () => {
    controller.abort(externalSignal?.reason || buildReason(key))
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      handleExternalAbort()
    } else {
      externalSignal.addEventListener('abort', handleExternalAbort, { once: true })
    }
  }

  const cleanup = () => {
    if (externalSignal) {
      externalSignal.removeEventListener('abort', handleExternalAbort)
    }

    if (pendingRequests.get(key) === controller) {
      pendingRequests.delete(key)
    }
  }

  return {
    controller,
    signal: controller.signal,
    cleanup,
  }
}
