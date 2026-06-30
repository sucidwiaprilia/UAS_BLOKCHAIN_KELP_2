import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ArrowRight, Wallet, CloudUpload, Shield, CheckCircle2, Lock, Cpu } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const { payments, setIsAdmin } = useWeb3();

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
          gap: '6px',
          background: '#D1FAE5',
          color: '#065F46',
          padding: '4px 14px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          marginBottom: '1.5rem',
          textTransform: 'uppercase'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#059669',
            display: 'inline-block'
          }} />
          SEPOLIA TESTNET LIVE
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1.15',
          marginBottom: '1.2rem',
          color: 'var(--text-main)'
        }}>
          Sistem Pembayaran UKT<br />
          <span style={{ color: 'var(--secondary)' }}>Berbasis Blockchain</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
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

      {/* Network Preview Box */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto 3.5rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '3rem 2.5rem 1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          position: 'relative',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.05) 0%, transparent 60%)'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Cpu size={48} style={{ opacity: 0.3, color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Smart Contract Interconnected</span>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', letterSpacing: '0.5px' }}>NETWORK STATUS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Block Height: 18,245,902
            </div>
          </div>
        </div>
      </div>

      {/* 4 Aggregate Stats Cards */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto 5rem',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem'
      }}>
        <div className="card-soft" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
              <Wallet size={20} />
            </div>
            <span style={{ fontSize: '0.75rem', background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
              +12% vs last sem
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total Payments</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalPayments}</div>
        </div>

        <div className="card-soft" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '10px', borderRadius: '12px' }}>
              <Lock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Pending Transactions</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{pendingCount}</div>
        </div>

        <div className="card-soft" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#D1FAE5', color: '#059669', padding: '10px', borderRadius: '12px' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Verified on Chain</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{verifiedCount}</div>
        </div>

        <div className="card-soft" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '12px' }}>
              <Shield size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Rejected/Failed</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{rejectedCount}</div>
        </div>
      </section>

      {/* Langkah Pembayaran Section */}
      <section style={{
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
                transition: 'all 0.2s'
              }}
            >
              Buka Dashboard
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '0.8rem 2rem',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Lihat Panduan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
