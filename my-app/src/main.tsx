import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserAuthProvider from './contexts/UserAuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <UserAuthProvider>
    <App />
  </UserAuthProvider>
)
