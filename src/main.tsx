import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginView from './Components/Views/LoginView.tsx'
import "./styles.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <div data-theme={"dark"}>
        <LoginView />
      </div>
  </StrictMode>,
)
