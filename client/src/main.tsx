import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './firebase.js'

const container = document.getElementById('root')
if (!container) throw new Error('Root not found')

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)