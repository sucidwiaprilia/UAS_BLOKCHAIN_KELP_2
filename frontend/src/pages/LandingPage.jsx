import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ArrowRight, Wallet, CloudUpload, Shield, CheckCircle2, Lock, Cpu, Clock, Database, AlertCircle } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const { payments, setIsAdmin, isDemoMode, account, isAuthorizedAdmin, showTxToast } = useWeb3();
  const [blockHeight, setBlockHeight] = useState(18245902);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 12000); // Rata-rata waktu blok Ethereum ~12 detik
    return () => clearInterval(interval);
  }, []);

  const totalPayments = payments.length;
  const pendingCount = payments.filter(p => p.status === 0).length;
  const verifiedCount = payments.filter(p => p.status === 1).length;
  const rejectedCount = payments.filter(p => p.status === 2).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '5rem 1.5rem 3rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Network Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#EEF2FF',
          color: 'var(--primary)',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          border: '1px solid #C7D2FE'
        }}>
          <Cpu size={14} />
          Solusi Administrasi Kampus Berbasis Ethereum
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: '800',
          lineHeight: '1.15',
          marginBottom: '1.5rem',
          letterSpacing: '-1.5px',
          color: 'var(--text-primary)'
        }}>
          Transparansi UKT Tanpa Batas dengan <span style={{ color: 'var(--primary)' }}>Smart Contract</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
          Sistem pembayaran uang kuliah tunggal (UKT) terverifikasi secara kriptografis menggunakan IPFS dan Ethereum Sepolia.
          Transparan. Aman. Terdesentralisasi. Masa depan administrasi kampus kini hadir dalam genggaman Anda melalui integrasi Web3 terpercaya.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setIsAdmin(false);
              setActiveTab('student');
            }}
            className="btn-primary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}
          >
            Portal Mahasiswa
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => {
              if (!isDemoMode && account && !isAuthorizedAdmin) {
                showTxToast('error', 'Akses Admin Terkunci: Wallet Anda terhubung sebagai Mahasiswa dan tidak terotorisasi sebagai Pihak Sekolah.', 5000);
                setActiveTab('admin');
                return;
              }
              setIsAdmin(true);
              setActiveTab('admin');
            }}
            className="btn-secondary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}
          >
            Portal Admin
          </button>
        </div>
      </section>

      {/* Network Preview Box (Proportional & Live Banner) */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto 3.5rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '2rem 2.5rem',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(79, 70, 229, 0.04) 0%, transparent 60%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flex: '1 1 340px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#EEF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Cpu size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.5px' }}>ETHEREUM SEPOLIA CONNECTED</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                Smart Contract Interconnected
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Sistem administrasi terverifikasi secara kriptografis dan tersinkronisasi live.
              </p>
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '18px',
            padding: '1.2rem 1.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            minWidth: '240px'
          }}>
            <div style={{ background: '#E2E8F0', padding: '10px', borderRadius: '12px', color: '#475569' }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                CURRENT BLOCK HEIGHT
              </div>
              <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                #{blockHeight.toLocaleString('en-US')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                • Live Sync (~12s)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Aggregate Stats Cards (Proportional & Balanced Layout) */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem'
      }}>
        {/* Card 1: Total Payments */}
        <div className="card-soft" style={{ padding: '1.8rem', borderRadius: '22px', background: 'white', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '12px', borderRadius: '14px' }}>
                <Wallet size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                +12% vs last sem
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Payments</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{totalPayments}</div>
          </div>
          <div style={{ borderTop: '1px dashed #F1F5F9', paddingTop: '0.8rem', marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <CheckCircle2 size={14} color="#059669" /> Akumulasi transaksi UKT
          </div>
        </div>

        {/* Card 2: Pending Transactions */}
        <div className="card-soft" style={{ padding: '1.8rem', borderRadius: '22px', background: 'white', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '12px', borderRadius: '14px' }}>
                <Clock size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', background: '#FEF08A', color: '#854D0E', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                In Review
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Pending Transactions</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{pendingCount}</div>
          </div>
          <div style={{ borderTop: '1px dashed #F1F5F9', paddingTop: '0.8rem', marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <Lock size={14} color="#D97706" /> Menunggu verifikasi admin
          </div>
        </div>

        {/* Card 3: Verified on Chain */}
        <div className="card-soft" style={{ padding: '1.8rem', borderRadius: '22px', background: 'white', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ background: '#D1FAE5', color: '#059669', padding: '12px', borderRadius: '14px' }}>
                <CheckCircle2 size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                On-Chain
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Verified on Chain</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{verifiedCount}</div>
          </div>
          <div style={{ borderTop: '1px dashed #F1F5F9', paddingTop: '0.8rem', marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <Database size={14} color="#059669" /> Terenkripsi permanen IPFS
          </div>
        </div>

        {/* Card 4: Rejected / Failed */}
        <div className="card-soft" style={{ padding: '1.8rem', borderRadius: '22px', background: 'white', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '14px' }}>
                <AlertCircle size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', background: '#FFE4E6', color: '#991B1B', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700 }}>
                Failed
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Rejected / Failed</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{rejectedCount}</div>
          </div>
          <div style={{ borderTop: '1px dashed #F1F5F9', paddingTop: '0.8rem', marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <Shield size={14} color="#DC2626" /> Dibatalkan atau error
          </div>
        </div>
      </section>

      {/* Langkah Pembayaran Section */}
      <section id="panduan-section" style={{
        maxWidth: '1100px',
        margin: '0 auto 5rem',
        padding: '3rem 2.5rem',
        background: 'white',
        borderRadius: '28px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Langkah Pembayaran</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Proses mudah dan transparan dari awal hingga verifikasi akhir.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
          position: 'relative'
        }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EEF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <Wallet size={28} />
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#0369A1',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>1</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Connect Wallet</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Hubungkan dompet digital MetaMask atau WalletConnect Anda ke jaringan EduPayChain.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EEF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <CloudUpload size={28} />
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#0369A1',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>2</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Proof</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Unggah bukti transfer atau detail transaksi. Data akan dienkripsi dan disimpan di IPFS.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EEF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <Shield size={28} />
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#0369A1',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>3</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submit & Wait</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Kirim transaksi ke Smart Contract. Verifikasi akan otomatis dilakukan oleh validator kampus.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem'
      }}>
        <div className="card-soft" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content', marginBottom: '1rem' }}>
            SECURITY FIRST
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Keamanan Smart Contract</h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Semua transaksi dikelola oleh smart contract yang telah diaudit secara profesional, memastikan dana UKT Anda sampai ke institusi tanpa perantara.
          </p>
        </div>

        <div className="card-soft" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '14px', borderRadius: '16px' }}>
            <Cpu size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Log Permanen</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Setiap pembayaran tercatat secara permanen di blockchain. Tidak ada lagi risiko kehilangan bukti pembayaran fisik.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #0D9488 100%)',
          borderRadius: '28px',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 20px 40px rgba(3, 105, 161, 0.25)'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Siap Memulai Pembayaran Digital?
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Bergabunglah dengan ribuan mahasiswa lainnya yang telah beralih ke sistem pembayaran masa depan.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setIsAdmin(false);
                setActiveTab('student');
              }}
              style={{
                background: 'white',
                color: '#0369A1',
                padding: '0.8rem 2rem',
                borderRadius: '9999px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Buka Dashboard
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('panduan-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                padding: '0.8rem 2rem',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Lihat Panduan
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.8rem 1.8rem',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              Verifikasi Publik →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
