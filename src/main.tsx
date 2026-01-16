import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PasswordManagerView from './Components/Views/PasswodManagerView.tsx'
import "./styles.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
          <PasswordManagerView/>
  </StrictMode>,
)
