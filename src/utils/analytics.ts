const POSTHOG_KEY = 'phc_e7VhMvdctP4QSoUC3OsQC1KVB40pwKmfqRAHelY3dPL'
const POSTHOG_HOST = 'https://us.i.posthog.com'

export async function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  try {
    const payload = {
      api_key: POSTHOG_KEY,
      event: eventName,
      properties: {
        ...properties,
        distinct_id: getUserId(),
      },
    }

    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

function getUserId(): string {
  const storedId = localStorage.getItem('posthog_user_id')
  if (storedId) return storedId

  const newId = crypto.randomUUID()
  localStorage.setItem('posthog_user_id', newId)
  return newId
}

export function trackInstall() {
  const manifest = chrome.runtime.getManifest()
  trackEvent('extension_installed', {
    version: manifest.version,
    browser: getBrowserInfo(),
  })
}

export function trackWidgetInteraction(widgetId: string, action: string, properties?: Record<string, any>) {
  trackEvent('widget_interaction', {
    widget_id: widgetId,
    action,
    ...properties,
  })
}

export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent('error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...context,
  })
}

function getBrowserInfo() {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}
