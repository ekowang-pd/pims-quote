import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { MobileApp } from './pages/MobileApp.tsx'
import { VanityCabinetConfigurator } from './components/VanityCabinetConfigurator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mobile" element={<MobileApp />} />
        <Route path="/pims-quote/" element={<App />} />
        <Route path="/pims-quote/mobile" element={<MobileApp />} />
        <Route path="/vanity" element={<VanityStandalone />} />
        <Route path="/pims-quote/vanity" element={<VanityStandalone />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)

// 独立版：纯配置器页面（无顶部导航）
function VanityStandalone() {
  return <VanityCabinetConfigurator onAdd={() => {}} onClose={() => window.close()} />;
}
