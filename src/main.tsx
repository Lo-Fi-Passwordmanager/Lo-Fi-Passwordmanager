import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import "./styles.css"
import PasswordView from "./Components/Views/PasswordView.tsx";
import SettingsView from "./Components/Views/SettingsView.tsx";



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SettingsView />
        <PasswordView></PasswordView>
    </StrictMode>
)
