import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SettingsView from "./Components/Views/SettingsView.tsx";
import LoginView from './Components/Views/LoginView.tsx'
import "./styles.css"
import ListView from "./Components/Views/ListView.tsx";
import {Folder} from "./Model/Folder.ts";
import {Entry} from "./Model/Entry.ts";




const root = new Folder("krasser Titel", "123", new Date(), new Date())
const entry = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
const entry3 = new Entry("Name3", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
const entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
root.addItem(entry);
root.addItem(entry2);
root.addItem(entry3);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
          <LoginView />
          <SettingsView />
      <ListView item={root}></ListView>
  </StrictMode>,
)
