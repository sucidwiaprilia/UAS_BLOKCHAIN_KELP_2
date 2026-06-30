import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/formatters';
import { Bell, Wallet, ShieldCheck, UserCheck, Radio } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { account, isAdmin, isDemoMode, loading, toggleRole, connectWallet } = useWeb3();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0.8rem 2rem',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('landing')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
        >
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
          }}>
            E
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            EduPayChain
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {[
            { label: 'Dashboard', tab: isAdmin ? 'admin' : 'student', match: ['student', 'admin'] },
            { label: 'Public Verification', tab: 'verify', match: ['verify'] },
          ].map(({ label, tab, match }) => (
            <button
              key={label}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: match.includes(activeTab) ? '600' : '400',
                color: match.includes(activeTab) ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: match.includes(activeTab) ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </button>
          ))}
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
            title="Klik untuk ganti portal (Mahasiswa / Admin)"
          >
            {isAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
            {isAdmin ? 'Admin' : 'Student'}
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
