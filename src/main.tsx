import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SettingsView from "./Components/Views/SettingsView.tsx";
import LoginView from './Components/Views/LoginView.tsx'
import "./styles.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <LoginView />
  </StrictMode>,
)
