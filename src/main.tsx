import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SettingsView from "./Components/Views/SettingsView.tsx";
import LoginView from './Components/Views/LoginView.tsx'
import "./styles.css"
import {Settings} from "./Model/Settings.ts";

const theme = Settings.getSettings().getDarkMode() ? "dark" : "light";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <div data-theme={theme}>
          <LoginView />
          <SettingsView />
      </div>
  </StrictMode>,
)
