import React, { useState, Suspense, lazy } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import Navbar from './components/Navbar';
import { AlertTriangle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// Lazy loading pages untuk efisiensi bundle size & Clean Architecture
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentPage = lazy(() => import('./pages/StudentPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PublicVerifyPage = lazy(() => import('./pages/PublicVerifyPage'));

// Global Toast Notification for on-chain TX status
function TxToast() {
  const { txStatus, txMessage } = useWeb3();
  if (!txStatus) return null;

  const config = {
    pending: { bg: '#EEF2FF', border: '#818CF8', color: '#3730A3', Icon: Loader2, spin: true },
    success: { bg: '#D1FAE5', border: '#6EE7B7', color: '#065F46', Icon: CheckCircle2, spin: false },
    error:   { bg: '#FEE2E2', border: '#FCA5A5', color: '#991B1B', Icon: AlertCircle, spin: false },
  }[txStatus];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999,
      background: config.bg,
      border: `1px solid ${config.border}`,
      color: config.color,
      padding: '1rem 1.4rem',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      maxWidth: '380px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
      animation: 'fadeIn 0.25s ease',
      fontSize: '0.9rem',
      fontWeight: 600,
    }}>
      <config.Icon size={20} style={config.spin ? { animation: 'spin 1s linear infinite' } : {}} />
      {txMessage}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Network mismatch banner
function NetworkBanner() {
  const { networkError } = useWeb3();
  if (!networkError) return null;

  return (
    <div style={{
      background: '#FEF2F2',
      borderBottom: '1px solid #FECACA',
      color: '#B91C1C',
      padding: '0.6rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.6rem',
      fontSize: '0.88rem',
      fontWeight: 600,
    }}>
      <AlertTriangle size={18} />
      Jaringan MetaMask tidak sesuai. Harap ganti ke Sepolia Testnet atau Localhost 8545!
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NetworkBanner />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1 }}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader2 size={36} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        }>
          {activeTab === 'landing'  && <LandingPage setActiveTab={setActiveTab} />}
          {activeTab === 'student'  && <StudentPage setActiveTab={setActiveTab} />}
          {activeTab === 'admin'    && <AdminPage setActiveTab={setActiveTab} />}
          {activeTab === 'verify'   && <PublicVerifyPage setActiveTab={setActiveTab} />}
        </Suspense>
      </main>

      <footer style={{
        background: 'white',
        borderTop: '1px solid var(--border)',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>EduPayChain</span> © {new Date().getFullYear()}. Secured by IPFS & Sepolia Ethereum Blockchain.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Proyek Tugas Akhir Blockchain</span>
          </div>
        </div>
      </footer>

      {/* Global TX status toast */}
      <TxToast />
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
