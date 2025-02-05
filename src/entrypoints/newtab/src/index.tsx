import * as React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NewTab from './NewTab'

const root = createRoot(document.querySelector('#app')!)
root.render(
  <React.StrictMode>
    <NewTab />
  </React.StrictMode>
)
