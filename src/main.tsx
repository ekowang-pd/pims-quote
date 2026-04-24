import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { MobileApp } from './pages/MobileApp.tsx'
import VanityCabinetConfigurator from './components/VanityCabinetConfigurator'

// 独立的浴室柜页面
function VanityPage() {
  return <VanityCabinetConfigurator />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mobile" element={<MobileApp />} />
        <Route path="/pims-quote/" element={<App />} />
        <Route path="/pims-quote/mobile" element={<MobileApp />} />
        <Route path="/vanity" element={<VanityPage />} />
        <Route path="/pims-quote/vanity" element={<VanityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
