import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import PasswordManagerView from './Components/Views/PasswodManagerView.tsx'
import "./styles.css"
import {LoadingScreenProvider} from "./Components/Views/LoadingScreenProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LoadingScreenProvider>
            <PasswordManagerView/>
        </LoadingScreenProvider>
    </StrictMode>,
)
