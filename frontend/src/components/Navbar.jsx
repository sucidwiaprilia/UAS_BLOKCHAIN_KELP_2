import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/formatters';
import { Bell, Wallet, ShieldCheck, UserCheck, Radio, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { account, isAdmin, isAuthorizedAdmin, isDemoMode, loading, toggleRole, connectWallet } = useWeb3();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      padding: '0.8rem 2rem',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand & Optional Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div
            onClick={() => setActiveTab('landing')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}>
              E
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              EduPayChain
            </span>
          </div>

          {activeTab !== 'landing' && (
            <button
              onClick={() => setActiveTab('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#334155',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Kembali ke Halaman Utama"
            >
              <ArrowLeft size={14} /> Beranda
            </button>
          )}
        </div>

        {/* Modern Interactive Nav Pills */}
        <nav style={{
          display: 'flex',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0',
          gap: '4px'
        }}>
          {[
            { label: 'Beranda', tab: 'landing', icon: Home, match: ['landing'] },
            { label: 'Dashboard', tab: isAdmin ? 'admin' : 'student', icon: LayoutDashboard, match: ['student', 'admin'] },
            { label: 'Public Verification', tab: 'verify', icon: ShieldCheck, match: ['verify'] },
          ].map(({ label, tab, icon: Icon, match }) => {
            const isActive = match.includes(activeTab);
            return (
              <button
                key={label}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: isActive ? 'white' : 'transparent',
                  border: isActive ? '1px solid #CBD5E1' : '1px solid transparent',
                  borderRadius: '9999px',
                  padding: '0.45rem 1.2rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? 'var(--primary)' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary)' : '#64748B'} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Live / Demo Mode indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: isDemoMode ? '#FEF3C7' : '#D1FAE5',
            border: `1px solid ${isDemoMode ? '#FDE68A' : '#A7F3D0'}`,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isDemoMode ? '#92400E' : '#065F46',
          }}>
            <Radio size={11} />
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </div>

          {/* Role Toggle */}
          <button
            onClick={toggleRole}
            style={{
              background: isAdmin ? '#FEF3C7' : '#EEF2FF',
              color: isAdmin ? '#D97706' : '#4F46E5',
              border: `1px solid ${isAdmin ? '#FDE68A' : '#C7D2FE'}`,
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: (!isDemoMode && account && !isAuthorizedAdmin) ? 'not-allowed' : 'pointer',
              opacity: (!isDemoMode && account && !isAuthorizedAdmin) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
            title={(!isDemoMode && account && !isAuthorizedAdmin) ? "Akses Admin Terkunci: Wallet bukan otorisasi Pihak Sekolah" : "Klik untuk ganti portal (Mahasiswa / Admin)"}
          >
            {isAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
            {isAdmin ? 'Admin Portal' : 'Student Portal'}
          </button>

          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Bell size={20} />
          </button>

          {/* Wallet Connect Button — clearly shows connection state */}
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{
              background: account ? '#EEF2FF' : 'var(--primary)',
              color: account ? 'var(--primary)' : 'white',
              border: account ? '1px solid #C7D2FE' : 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              boxShadow: account ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Wallet size={16} />
            {loading ? 'Connecting...' : account ? formatAddress(account) : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}
