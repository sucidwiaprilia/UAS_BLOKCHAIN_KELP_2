import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import IpfsProofModal from '../components/IpfsProofModal';
import { 
  CreditCard, 
  History, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileText,
  TrendingUp,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPage({ setActiveTab }) {
  const { payments, verifyPaymentRecord, rejectPaymentRecord, loading, txStatus, account, isAuthorizedAdmin, isDemoMode } = useWeb3();
  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments' | 'history' | 'verification'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Pending' | 'Verified' | 'Rejected' | 'Live MetaMask'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedProofPayment, setSelectedProofPayment] = useState(null);

  const filteredPayments = payments.filter(p => {
    if (activeSubTab === 'verification' && p.status !== 0) return false;
    if (filterStatus === 'Pending' && p.status !== 0) return false;
    if (filterStatus === 'Verified' && p.status !== 1) return false;
    if (filterStatus === 'Rejected' && p.status !== 2) return false;
    if (filterStatus === 'Live MetaMask' && !p.isRealTx) return false;
    if (searchTerm && !p.nimHash.toLowerCase().includes(searchTerm.toLowerCase()) && !p.semester.toLowerCase().includes(searchTerm.toLowerCase()) && !(p.nim && p.nim.includes(searchTerm))) {
      return false;
    }
    return true;
  });

  const handleVerify = async (id) => {
    await verifyPaymentRecord(id);
    setSelectedTx(null);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleReject = async (id) => {
    await rejectPaymentRecord(id);
    setSelectedTx(null);
  };

  const pendingCount = payments.filter(p => p.status === 0).length;
  const verifiedCount = payments.filter(p => p.status === 1).length;
  const rejectedCount = payments.filter(p => p.status === 2).length;

  if (!isDemoMode && account && !isAuthorizedAdmin) {
    return (
      <div style={{ minHeight: 'calc(100vh - 65px)', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card-soft" style={{ maxWidth: '540px', padding: '3rem', textAlign: 'center', borderRadius: '24px', border: '2px solid #FECACA', background: 'white', boxShadow: '0 20px 40px -15px rgba(220, 38, 38, 0.15)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.8rem' }}>
            Akses Admin Ditolak (403)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Halaman Dasbor Admin dilindungi oleh otorisasi Smart Contract Ethereum. Wallet yang Anda hubungkan saat ini (<code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '6px', fontSize: '0.85rem' }}>{account}</code>) tidak terdaftar sebagai <strong>Pihak Sekolah (Contract Admin)</strong>.
          </p>
          <div style={{ background: '#FFFBEB', border: '1px solid #FEF08A', padding: '1rem', borderRadius: '12px', fontSize: '0.88rem', color: '#B45309', fontWeight: 600 }}>
            Silakan ganti akun MetaMask Anda ke alamat resmi Pihak Sekolah atau putuskan koneksi wallet untuk kembali ke Mode Demo interaktif.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: 'var(--bg-page)' }}>
      {/* Main Content (Full Width, Centered, Proportional & Responsive) */}
      <main style={{ width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '2.5rem 2.5rem' }}>
        {/* Top Title & Actions Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('landing')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowLeft size={14} /> Kembali ke Beranda
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                {activeSubTab === 'verification' ? 'Pending Verifications' : activeSubTab === 'history' ? 'Verified History' : 'Admin Dashboard'}
              </h1>
              <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> VERIFIED ADMIN
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
              Monitor, audit, and verify blockchain-secured student UKT payments cleanly without side clutter.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => alert("Mengekspor laporan verifikasi transaksi UKT ke PDF...")}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                padding: '0.7rem 1.4rem',
                borderRadius: '9999px',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              <Download size={16} style={{ color: 'var(--primary)' }} />
              Export PDF
            </button>

            <button 
              onClick={() => { setActiveSubTab('payments'); setFilterStatus('All'); setSearchTerm(''); }}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              title="Refresh / Reset Filter"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* 4 Interactive Metric Cards (Replaces Left Sidebar Navigation) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Total */}
          <div 
            onClick={() => { setActiveSubTab('payments'); setFilterStatus('All'); }}
            className="card-soft"
            style={{
              padding: '1.6rem',
              borderRadius: '20px',
              background: filterStatus === 'All' ? '#EEF2FF' : 'white',
              border: filterStatus === 'All' ? '2px solid #4F46E5' : '1px solid var(--border)',
              boxShadow: filterStatus === 'All' ? '0 10px 25px -5px rgba(79, 70, 229, 0.15)' : 'var(--shadow-sm)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: filterStatus === 'All' ? '#4F46E5' : 'var(--text-muted)', letterSpacing: '0.5px' }}>
                TOTAL TRANSACTIONS
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: filterStatus === 'All' ? '#4F46E5' : '#EEF2FF', color: filterStatus === 'All' ? 'white' : '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1E293B', marginBottom: '0.4rem', lineHeight: 1 }}>
              {payments.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
              <TrendingUp size={15} /> +12.5% vs last month
            </div>
          </div>

          {/* Card 2: Pending */}
          <div 
            onClick={() => { setActiveSubTab('verification'); setFilterStatus('Pending'); }}
            style={{
              padding: '1.6rem',
              borderRadius: '20px',
              background: filterStatus === 'Pending' ? '#FEFCE8' : '#FFFBEB',
              border: filterStatus === 'Pending' ? '2px solid #D97706' : '1px solid #FEF08A',
              boxShadow: filterStatus === 'Pending' ? '0 10px 25px -5px rgba(217, 119, 6, 0.15)' : 'var(--shadow-sm)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', letterSpacing: '0.5px' }}>
                PENDING REVIEW
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: filterStatus === 'Pending' ? '#D97706' : '#FEF3C7', color: filterStatus === 'Pending' ? 'white' : '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#D97706', marginBottom: '0.4rem', lineHeight: 1 }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700 }}>
              Click to verify pending items
            </div>
          </div>

          {/* Card 3: Verified */}
          <div 
            onClick={() => { setActiveSubTab('history'); setFilterStatus('Verified'); }}
            style={{
              padding: '1.6rem',
              borderRadius: '20px',
              background: filterStatus === 'Verified' ? '#ECFDF5' : '#F0FDF4',
              border: filterStatus === 'Verified' ? '2px solid #059669' : '1px solid #A7F3D0',
              boxShadow: filterStatus === 'Verified' ? '0 10px 25px -5px rgba(5, 150, 105, 0.15)' : 'var(--shadow-sm)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', letterSpacing: '0.5px' }}>
                VERIFIED ASSETS
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: filterStatus === 'Verified' ? '#059669' : '#D1FAE5', color: filterStatus === 'Verified' ? 'white' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#059669', marginBottom: '0.4rem', lineHeight: 1 }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 700 }}>
              Secured on IPFS & Blockchain
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div 
            onClick={() => { setActiveSubTab('payments'); setFilterStatus('Rejected'); }}
            style={{
              padding: '1.6rem',
              borderRadius: '20px',
              background: filterStatus === 'Rejected' ? '#FEF2F2' : '#FFF1F2',
              border: filterStatus === 'Rejected' ? '2px solid #DC2626' : '1px solid #FECACA',
              boxShadow: filterStatus === 'Rejected' ? '0 10px 25px -5px rgba(220, 38, 38, 0.15)' : 'var(--shadow-sm)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', letterSpacing: '0.5px' }}>
                FLAGGED / REJECTED
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: filterStatus === 'Rejected' ? '#DC2626' : '#FEE2E2', color: filterStatus === 'Rejected' ? 'white' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#DC2626', marginBottom: '0.4rem', lineHeight: 1 }}>
              {rejectedCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#991B1B', fontWeight: 700 }}>
              Disputed transactions
            </div>
          </div>
        </div>

        {/* Filter Pills and Responsive Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Status Pills */}
          <div style={{
            background: '#EFF4FF',
            padding: '6px',
            borderRadius: '9999px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            border: '1px solid #E0E7FF'
          }}>
            {['All', 'Pending', 'Verified', 'Rejected', 'Live MetaMask'].map((status) => (
              <button
                key={status}
                onClick={() => { 
                  setFilterStatus(status); 
                  if (status === 'Pending') setActiveSubTab('verification');
                  else if (status === 'Verified') setActiveSubTab('history');
                  else setActiveSubTab('payments');
                }}
                style={{
                  background: filterStatus === status ? 'var(--primary)' : 'transparent',
                  color: filterStatus === status ? 'white' : '#4F46E5',
                  fontWeight: filterStatus === status ? 800 : 600,
                  padding: '0.55rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  boxShadow: filterStatus === status ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '340px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by NIM Hash or Semester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                background: 'white',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border 0.2s'
              }}
            />
          </div>
        </div>

        {/* Table Box */}
        <div className="card-soft" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8F9FF', borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', width: '70px', letterSpacing: '0.5px' }}>NO</th>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>NIM HASH</th>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>SEMESTER</th>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>NOMINAL</th>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>STATUS</th>
                <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Tidak ada transaksi yang cocok dengan filter {filterStatus !== 'All' ? `"${filterStatus}"` : ''}.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB', transition: 'background 0.15s' }}>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap', width: '70px' }}>
                      <span className="mono" style={{ background: '#F1F5F9', color: '#334155', padding: '5px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-block' }}>
                        #{String(p.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                        <span className="mono" style={{ color: '#4F46E5', fontWeight: 700, fontSize: '0.88rem', background: '#EEF2FF', padding: '4px 10px', borderRadius: '8px', border: '1px solid #C7D2FE' }}>
                          {p.nimHash.substring(0, 14)}...
                        </span>
                        {p.isRealTx ? (
                          <span style={{ background: '#D1FAE5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid #A7F3D0' }}>⚡ LIVE</span>
                        ) : (
                          <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid #CBD5E1' }}>📋 DEMO</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '5px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', border: '1px solid #BFDBFE', display: 'inline-block' }}>
                        {p.semester}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1F293B', marginBottom: '2px' }}>{p.amountIdr}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>({p.amountEth} ETH)</div>
                    </td>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {p.status === 0 && (
                        <span style={{ background: '#FEF3C7', color: '#D97706', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #FDE68A' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706' }} /> Pending
                        </span>
                      )}
                      {p.status === 1 && (
                        <span style={{ background: '#D1FAE5', color: '#059669', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #A7F3D0' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} /> Verified
                        </span>
                      )}
                      {p.status === 2 && (
                        <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #FECACA' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} /> Rejected
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedTx(p)}
                          className="btn-secondary"
                          style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px' }}
                        >
                          Detail
                        </button>

                        {p.status === 0 && (
                          <button
                            onClick={() => handleVerify(p.id)}
                            disabled={loading}
                            style={{
                              background: '#059669',
                              color: 'white',
                              border: 'none',
                              padding: '0.45rem 1.2rem',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: loading ? 'wait' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                            }}
                            title="Klik untuk langsung verifikasi"
                          >
                            {loading && txStatus === 'pending' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{
            padding: '1.2rem 1.5rem',
            background: '#F8F9FF',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <span>Showing {filteredPayments.length} of {payments.length} results</span>
          </div>
        </div>
      </main>

      {/* Verification Modal when clicking Detail */}
      {selectedTx && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="card-soft animate-fade-in" style={{
            width: '580px',
            maxWidth: '95vw',
            maxHeight: '86vh',
            overflowY: 'auto',
            background: 'white',
            padding: '1.8rem',
            borderRadius: '20px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button
              onClick={() => setSelectedTx(null)}
              style={{
                position: 'sticky',
                float: 'right',
                top: 0,
                right: 0,
                background: '#F1F5F9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)',
                zIndex: 10
              }}
              title="Tutup Modal"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '12px', borderRadius: '16px' }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Verifikasi Pembayaran #{selectedTx.id}</h3>
                  {selectedTx.isRealTx ? (
                    <span style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>⚡ LIVE METAMASK</span>
                  ) : (
                    <span style={{ background: '#F1F5F9', color: '#64748B', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem' }}>📋 SAMPEL DEMO</span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {selectedTx.timestamp}</span>
              </div>
            </div>

            <div style={{ background: '#F8F9FF', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>SEMESTER</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selectedTx.semester}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>NOMINAL UKT</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>{selectedTx.amountEth} ETH</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedTx.amountIdr}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STUDENT WALLET / NIM HASH</div>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all', background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', marginTop: '4px' }}>
                  Wallet: {selectedTx.student}<br/>
                  Hash: {selectedTx.nimHash}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>BUKTI BAYAR IPFS CID</div>
                <button
                  onClick={() => setSelectedProofPayment(selectedTx)}
                  className="mono"
                  style={{ background: 'transparent', border: 'none', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginTop: '4px', cursor: 'pointer', padding: 0 }}
                >
                  {selectedTx.proofHash} ↗ (Buka Viewer IPFS)
                </button>

                {/* Visual Bank Receipt / Slip Preview */}
                <div style={{ marginTop: '1.2rem', padding: '1rem', background: '#F8F9FF', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📸 PREVIEW DOKUMEN / SLIP PEMBAYARAN</span>
                    <span style={{ color: 'var(--primary)' }}>{selectedTx.isRealTx ? '[⚡ UPLOAD ASLI USER]' : '[IPFS SIMULATED]'}</span>
                  </div>
                  {selectedTx.fileDataUrl ? (
                    selectedTx.fileDataUrl.startsWith('data:application/pdf') ? (
                      <div style={{ textAlign: 'center' }}>
                        <iframe src={selectedTx.fileDataUrl} title="PDF Bukti Bayar" style={{ width: '100%', height: '260px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white' }} />
                        <a href={selectedTx.fileDataUrl} download={`Bukti_Bayar_${selectedTx.id}.pdf`} style={{ display: 'inline-block', marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>⬇ Unduh File PDF Asli</a>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <img src={selectedTx.fileDataUrl} alt="Slip Bukti Bayar" style={{ maxWidth: '100%', maxHeight: '260px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
                        <div style={{ marginTop: '0.6rem' }}>
                          <a href={selectedTx.fileDataUrl} download={`Bukti_Bayar_${selectedTx.id}.png`} style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>⬇ Unduh Foto Bukti Bayar Asli</a>
                        </div>
                      </div>
                    )
                  ) : (
                    /* Official Simulated Bank Slip for Demo Records */
                    <div style={{ background: 'white', padding: '1.2rem', borderRadius: '8px', border: '1px dashed #CBD5E1', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontWeight: 700 }}>BANK KAMPUS (VA)</span>
                        <span style={{ color: '#059669', fontWeight: 700 }}>✓ SUKSES TRANSFER</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span>NIM Mahasiswa:</span>
                        <span style={{ fontWeight: 600 }}>{selectedTx.nim}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span>Periode:</span>
                        <span>{selectedTx.semester}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span>Jumlah Bayar:</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedTx.amountIdr}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                        <span>Ref Hash: {selectedTx.proofHash.substring(0, 16)}...</span>
                        <span>{selectedTx.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedTx.status === 0 ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleVerify(selectedTx.id)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: '#059669',
                    color: 'white',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading && txStatus === 'pending' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Memproses di MetaMask...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Verifikasi On-Chain
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleReject(selectedTx.id)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <AlertCircle size={18} /> Tolak Bukti
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', background: '#F3F4F6', borderRadius: '14px', fontWeight: 600 }}>
                Transaksi ini telah diproses dengan status: {selectedTx.status === 1 ? 'VERIFIED ✅' : 'REJECTED ❌'}
              </div>
            )}
          </div>
        </div>
      )}

      <IpfsProofModal
        isOpen={Boolean(selectedProofPayment)}
        onClose={() => setSelectedProofPayment(null)}
        payment={selectedProofPayment}
      />
    </div>
  );
}
