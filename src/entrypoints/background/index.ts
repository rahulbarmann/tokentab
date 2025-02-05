export default defineBackground(() => {
  chrome?.sidePanel?.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: unknown) => console.error(error))

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
      chrome.sidePanel.open({ tabId: sender.tab!.id, windowId: sender.tab!.windowId })
      sendResponse({ success: true })
    }
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetchCryptoBubbles') {
      fetch('https://cryptobubbles.net/backend/data/bubbles1000.usd.json')
        .then((response) => response.json())
        .then((data) => sendResponse({ data }))
        .catch((error) => sendResponse({ error: error.message }))
      return true // Required to use sendResponse asynchronously
    }
  })
})
