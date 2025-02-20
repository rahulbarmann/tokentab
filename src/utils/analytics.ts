import posthog from 'posthog-js'

const POSTHOG_KEY = 'phc_e7VhMvdctP4QSoUC3OsQC1KVB40pwKmfqRAHelY3dPL'
const POSTHOG_HOST = 'https://us.i.posthog.com'

export function initAnalytics() {
  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      persistence: 'localStorage',
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: true, // Disable session recording for privacy
      respect_dnt: true, // Respect Do Not Track setting
    })
  } catch (error) {
    console.error('Failed to initialize PostHog:', error)
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    posthog.capture(eventName, properties)
  } catch (error) {
    console.error('Failed to track event:', error)
  }
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