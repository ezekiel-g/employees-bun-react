import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/react/components/App'

const div = document.getElementById('root')

if (!div)
  throw new Error('Root element not found')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(div))

  root.render(app)
}
else {
  createRoot(div).render(app)
}
