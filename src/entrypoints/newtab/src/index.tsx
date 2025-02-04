/* eslint-disable @stylistic/comma-dangle */
/* eslint-disable simple-import-sort/imports */
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

function NewTab() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to TokenTab</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Your Web3-powered new tab experience</p>
    </div>
  )
}

const root = createRoot(document.querySelector('#app')!)
root.render(
  <React.StrictMode>
    <NewTab />
  </React.StrictMode>
)
