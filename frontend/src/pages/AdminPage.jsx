import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ipfsUrl } from '../utils/formatters';
import { 
  CreditCard, 
  History, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  FileText,
  TrendingUp,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPage() {
  const { payments, verifyPaymentRecord, rejectPaymentRecord, loading, txStatus } = useWeb3();
  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments' | 'history' | 'verification'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Pending' | 'Verified' | 'Rejected' | 'Live MetaMask'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

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

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', background: 'var(--bg-page)' }}>
      {/* Left Sidebar matching Admin Dashboard.png */}
      <aside style={{
        width: '260px',
        background: 'white',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem'
      }}>
        <div>
          {/* User Profile Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.5rem 0.8rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#EEF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>EduPay Portal</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', letterSpacing: '0.5px' }}>VERIFIED ADMIN</div>
            </div>
          </div>

          {/* Nav Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button
              onClick={() => { setActiveSubTab('payments'); setFilterStatus('All'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: activeSubTab === 'payments' ? '#EEF2FF' : 'transparent',
                color: activeSubTab === 'payments' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'payments' ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.92rem',
                transition: 'all 0.2s'
              }}
            >
              <CreditCard size={18} />
              All Payments ({payments.length})
            </button>

            <button
              onClick={() => { setActiveSubTab('verification'); setFilterStatus('Pending'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: activeSubTab === 'verification' ? '#EEF2FF' : 'transparent',
                color: activeSubTab === 'verification' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'verification' ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.92rem',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShieldCheck size={18} />
                Needs Verification
              </div>
              {pendingCount > 0 && (
                <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveSubTab('history'); setFilterStatus('Verified'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: activeSubTab === 'history' ? '#EEF2FF' : 'transparent',
                color: activeSubTab === 'history' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'history' ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.92rem',
                transition: 'all 0.2s'
              }}
            >
              <History size={18} />
              Verified History
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem 3.5rem', maxWidth: '1250px' }}>
        {/* Top Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              {activeSubTab === 'verification' ? 'Pending Verifications' : activeSubTab === 'history' ? 'Verified History' : 'Admin Dashboard'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Monitor, audit, and verify blockchain-secured student UKT payments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => alert("Mengekspor laporan verifikasi transaksi UKT ke PDF...")}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Download size={16} style={{ color: 'var(--primary)' }} />
              Export PDF
            </button>

            <button 
              onClick={() => { setFilterStatus('All'); setSearchTerm(''); }}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Refresh / Reset Filter"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1 */}
          <div 
            onClick={() => { setActiveSubTab('payments'); setFilterStatus('All'); }}
            className="card-soft" 
            style={{ padding: '1.6rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: filterStatus === 'All' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              TOTAL TRANSACTIONS
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {payments.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
              <TrendingUp size={14} /> +12.5% vs last month
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => { setActiveSubTab('verification'); setFilterStatus('Pending'); }}
            style={{
              background: '#FEFCE8',
              border: filterStatus === 'Pending' ? '2px solid #D97706' : '1px solid #FEF08A',
              borderRadius: '20px',
              padding: '1.6rem',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A16207', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              PENDING REVIEW
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#D97706', marginBottom: '0.5rem' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#A16207', fontWeight: 500 }}>
              Click to verify pending items
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => { setActiveSubTab('history'); setFilterStatus('Verified'); }}
            style={{
              background: '#ECFDF5',
              border: filterStatus === 'Verified' ? '2px solid #059669' : '1px solid #A7F3D0',
              borderRadius: '20px',
              padding: '1.6rem',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              VERIFIED ASSETS
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 500 }}>
              Secured on IPFS
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => setFilterStatus('Rejected')}
            style={{
              background: '#FEF2F2',
              border: filterStatus === 'Rejected' ? '2px solid #DC2626' : '1px solid #FECACA',
              borderRadius: '20px',
              padding: '1.6rem',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B91C1C', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              FLAGGED/REJECTED
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.5rem' }}>
              {rejectedCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#B91C1C', fontWeight: 500 }}>
              Disputed transactions
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Status Pills */}
          <div style={{
            background: '#EFF4FF',
            padding: '4px',
            borderRadius: '9999px',
            display: 'flex',
            gap: '4px'
          }}>
            {['All', 'Pending', 'Verified', 'Rejected', 'Live MetaMask'].map((status) => (
              <button
                key={status}
                onClick={() => { setFilterStatus(status); if(status==='Pending') setActiveSubTab('verification'); }}
                style={{
                  background: filterStatus === status ? 'white' : 'transparent',
                  color: filterStatus === status ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: filterStatus === status ? 700 : 500,
                  padding: '0.5rem 1.4rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  boxShadow: filterStatus === status ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search by NIM Hash or Semester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem 0.7rem 2.8rem',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
        </div>

        {/* Table Box */}
        <div className="card-soft" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8F9FF', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>#</th>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>NIM HASH</th>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>SEMESTER</th>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>NOMINAL</th>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>STATUS</th>
                <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTION</th>
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
                  <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' }}>
                    <td className="mono" style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>{p.id < 10 ? `00${p.id}` : p.id}</td>
                    <td className="mono" style={{ padding: '1.2rem 1.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {p.nimHash.substring(0, 16)}...
                      {p.isRealTx ? (
                        <span style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, marginLeft: '8px' }}>⚡ LIVE</span>
                      ) : (
                        <span style={{ background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', marginLeft: '8px' }}>📋 DEMO</span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 600 }}>{p.semester}</td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <span style={{ fontWeight: 700 }}>{p.amountIdr}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({p.amountEth} ETH)</div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      {p.status === 0 && (
                        <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} /> Pending
                        </span>
                      )}
                      {p.status === 1 && (
                        <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Verified
                        </span>
                      )}
                      {p.status === 2 && (
                        <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} /> Rejected
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <button
                        onClick={() => setSelectedTx(p)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
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
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Klik untuk langsung verifikasi"
                        >
                          {loading && txStatus === 'pending' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                          Verify
                        </button>
                      )}
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
                <a
                  href={ipfsUrl(selectedTx.proofHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="mono"
                  style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}
                >
                  {selectedTx.proofHash} ↗
                </a>

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
    </div>
  );
}
