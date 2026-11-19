import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LandingPage } from './pages/public/LandingPage'
import { AuthPage } from './pages/auth/AuthPage'
import { MarketplacePage } from './pages/marketplace/MarketplacePage'
import { AuctionsPage } from './pages/auctions/AuctionsPage'
import { MandiRatesPage } from './pages/mandi/MandiRatesPage'
import { ColdStoragePage } from './pages/coldstorage/ColdStoragePage'
import { TransportPage } from './pages/transport/TransportPage'
import { TrackingPage } from './pages/tracking/TrackingPage'
import { SchemesPage } from './pages/schemes/SchemesPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { FreshnessScannerPage } from './pages/freshness/FreshnessScannerPage'
import { SupportPage } from './pages/support/SupportPage'
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage'
import { DashboardWrapper } from './pages/dashboard/DashboardWrapper'
import { AIChatbox } from './components/common/AIChatbox'
import { VoiceSpeakingBar } from './components/common/VoiceSpeakingBar'

// Helper to scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf7]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/mandi-rates" element={<MandiRatesPage />} />
          <Route path="/cold-storage" element={<ColdStoragePage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/freshness-scanner" element={<FreshnessScannerPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <AIChatbox />
      <VoiceSpeakingBar />
      <Footer />
    </div>
  )
}

export default App
