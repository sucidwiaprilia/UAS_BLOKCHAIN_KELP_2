import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  CreditCard, 
  History, 
  Plus, 
  CloudUpload, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getNextDueDate } from '../utils/formatters';
import IpfsProofModal from '../components/IpfsProofModal';

export default function StudentPage({ setActiveTab }) {
  const { account, isDemoMode, payments, submitNewPayment, loading } = useWeb3();
  const [activeSubTab, setActiveSubTab] = useState('form'); // 'form' | 'history'
  const [selectedProofPayment, setSelectedProofPayment] = useState(null);

  // Form State
  const [nim, setNim] = useState('21040120');
  const [semester, setSemester] = useState('Semester 4');
  const [amountIdrInput, setAmountIdrInput] = useState('12500000');
  const [fileName, setFileName] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null); // { status: 'success' | 'error', data?, message? }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Batasi maksimal 1.5MB untuk mencegah QuotaExceededError di browser localStorage
      if (file.size > 1.5 * 1024 * 1024) {
        alert('Ukuran file melebihi batas maksimal 1.5MB! Harap pilih file atau kompres dokumen terlebih dahulu.');
        e.target.value = null;
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nim || !semester || !amountIdrInput) {
      alert("Harap lengkapi semua field data pembayaran!");
      return;
    }

    const calculatedEth = (parseFloat(amountIdrInput || 0) / 28000000).toFixed(4);
    const formattedIdr = `Rp ${parseFloat(amountIdrInput || 0).toLocaleString('id-ID')}`;

    const res = await submitNewPayment({
      nim,
      semester,
      amountEth: calculatedEth,
      amountIdrDirect: formattedIdr,
      fileDataUrl
    });

    if (!res) return;

    setSubmissionResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (res.status === 'success') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Filter payments for the currently connected account.
  // Falls back to all demo payments when in demo mode.
  const myPayments = (!isDemoMode && account)
    ? payments.filter(p => p.student.toLowerCase() === account.toLowerCase())
    : payments;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', background: 'var(--bg-page)' }}>
      {/* Left Sidebar matching Student Portal.png */}
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
              background: account ? '#4F46E5' : '#3B82F6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)'
            }}>
              {account ? account.substring(2, 4).toUpperCase() : 'JD'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>EduPay Portal</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {account ? `${account.substring(0, 8)}...${account.slice(-4)}` : 'Demo Mode'}
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button
              onClick={() => setActiveSubTab('form')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: activeSubTab === 'form' ? '#EEF2FF' : 'transparent',
                color: activeSubTab === 'form' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeSubTab === 'form' ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.92rem'
              }}
            >
              <CreditCard size={18} />
              Payments
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
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
                fontSize: '0.92rem'
              }}
            >
              <History size={18} />
              Transaction History
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setActiveSubTab('form');
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem', padding: '0.75rem' }}
          >
            <Plus size={18} />
            New Payment
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem 3.5rem', maxWidth: '1200px' }}>
        {submissionResult ? (
          submissionResult.status === 'success' || submissionResult.data ? (
            /* Dedicated Official Receipt Page (Recommendation 2 - Success) */
            <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <button
                  onClick={() => { setSubmissionResult(null); setActiveSubTab('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}
                >
                  <ArrowLeft size={16} /> Kembali ke Form Pembayaran
                </button>
              </div>

              <div className="card-soft" style={{ padding: '3.5rem', borderRadius: '24px', background: 'white', border: '2px solid #A7F3D0', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 8px #ECFDF5' }}>
                    <CheckCircle2 size={46} />
                  </div>
                  <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '1rem' }}>
                    TRANSAKSI ON-CHAIN BERHASIL
                  </div>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem' }}>
                    Resi Pembayaran & Sertifikat IPFS
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
                    Uang Kuliah Tunggal (UKT) Anda telah dicatat dalam buku besar terdesentralisasi Ethereum Sepolia dan berkas dikunci secara permanen di IPFS.
                  </p>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '2rem', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} color="var(--primary)" /> Parameter Verifikasi Kriptografis
                  </h3>
                  <div style={{ display: 'grid', gap: '1.2rem', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Payment ID On-Chain:</span>
                      <span className="mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>#{submissionResult.data?.id || 'NEW'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status Smart Contract:</span>
                      <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 700 }}>
                        PENDING VERIFICATION (Pihak Sekolah)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>NIM & Semester:</span>
                      <span style={{ fontWeight: 700 }}>{submissionResult.data?.nim} ({submissionResult.data?.semester})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>NIM Hash (Privasi UU PDP):</span>
                      <code style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        {submissionResult.data?.nimHash || '-'}
                      </code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Nominal Pembayaran:</span>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>
                        {submissionResult.data?.amountIdr} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({submissionResult.data?.amountEth} ETH)</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>IPFS Content Identifier (CID):</span>
                      <button
                        onClick={() => setSelectedProofPayment(submissionResult.data)}
                        style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        {submissionResult.data?.proofHash ? `${submissionResult.data.proofHash.substring(0, 18)}...` : 'Lihat CID'} <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => { setSubmissionResult(null); setActiveSubTab('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="btn-primary"
                    style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
                  >
                    <History size={18} />
                    Lihat Riwayat Pembayaran
                  </button>
                  <button
                    onClick={() => { setSubmissionResult(null); setActiveSubTab('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="btn-secondary"
                    style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
                  >
                    Bayar Semester Lainnya
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated Error / Rejection Page (Recommendation 2 - Failure) */
            <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <button
                  onClick={() => { setSubmissionResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}
                >
                  <ArrowLeft size={16} /> Kembali ke Form Pembayaran
                </button>
              </div>

              <div className="card-soft" style={{ padding: '3.5rem', borderRadius: '24px', background: 'white', border: '2px solid #FECACA', boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.15)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 8px #FEF2F2' }}>
                  <XCircle size={46} />
                </div>
                <div style={{ display: 'inline-block', background: '#FEE2E2', color: '#991B1B', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '1rem' }}>
                  TRANSAKSI DIBATALKAN / GAGAL
                </div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#991B1B', marginBottom: '1rem' }}>
                  Pembayaran Tidak Tercatat
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                  Proses pencatatan transaksi UKT Anda ke smart contract Ethereum mengalami gangguan atau dibatalkan oleh pengguna.
                </p>

                <div style={{ background: '#FFF1F2', border: '1px solid #FFE4E6', borderRadius: '16px', padding: '1.5rem', color: '#BE123C', fontSize: '0.95rem', fontWeight: 600, marginBottom: '2.5rem', textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, marginBottom: '6px' }}>Detail Keterangan:</div>
                  <div>{submissionResult.message || 'Transaksi dibatalkan oleh pengguna di dalam dompet digital MetaMask atau terjadi gangguan koneksi jaringan Sepolia.'}</div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => { setSubmissionResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="btn-primary"
                    style={{ padding: '0.9rem 2.5rem', fontSize: '1rem', background: '#DC2626' }}
                  >
                    Coba Kirim Ulang Sekarang
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Header Title + Due date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
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
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
              Student Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '620px' }}>
              Manage your academic payments securely through blockchain verification and IPFS storage.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '0.8rem 1.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              NEXT DUE DATE
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
              {getNextDueDate()}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          <button
            onClick={() => { setActiveSubTab('form'); setSubmittedSuccess(false); }}
            style={{
              background: 'none',
              border: 'none',
              paddingBottom: '0.8rem',
              fontSize: '1rem',
              fontWeight: activeSubTab === 'form' ? 600 : 400,
              color: activeSubTab === 'form' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'form' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Form Pembayaran
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            style={{
              background: 'none',
              border: 'none',
              paddingBottom: '0.8rem',
              fontSize: '1rem',
              fontWeight: activeSubTab === 'history' ? 600 : 400,
              color: activeSubTab === 'history' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSubTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Riwayat Saya ({myPayments.length})
          </button>
        </div>

        {activeSubTab === 'form' ? (
          /* Form Layout matching Student Portal.png */
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 4fr', gap: '2.5rem' }}>
            {/* Left Form Box */}
              <form onSubmit={handleSubmit} className="card-soft" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      STUDENT ID (NIM)
                    </label>
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="e.g. 21040120"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-input)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      SEMESTER
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-input)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option>Semester 1</option>
                      <option>Semester 2</option>
                      <option>Semester 3</option>
                      <option>Semester 4</option>
                      <option>Semester 5</option>
                      <option>Semester 6</option>
                      <option>Semester 7</option>
                      <option>Semester 8</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    NOMINAL UKT YANG DIBAYARKAN (IDR)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#059669', fontWeight: 700, fontSize: '1rem' }}>
                      Rp
                    </span>
                    <input
                      type="number"
                      step="50000"
                      value={amountIdrInput}
                      onChange={(e) => setAmountIdrInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-input)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                      ✓ Terbilang: Rp {parseFloat(amountIdrInput || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      (Tercatat di Ethereum: ~{(parseFloat(amountIdrInput || 0) / 28000000).toFixed(4)} ETH)
                    </span>
                  </div>
                </div>

                {/* Upload Box */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    BUKTI PEMBAYARAN (IPFS ENCRYPTED)
                  </label>
                  <label style={{
                    display: 'block',
                    border: '2px dashed #A5B4FC',
                    background: '#F8F9FF',
                    borderRadius: '20px',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,.pdf" />
                    <CloudUpload size={36} style={{ color: 'var(--primary)', margin: '0 auto 0.8rem' }} />
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                      {fileName ? `File terpilih: ${fileName}` : 'Click to upload or drag and drop'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      PDF, PNG, JPG (max. 5MB). Files are automatically hashed and pinned to IPFS.
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', borderRadius: '16px', marginBottom: '1rem' }}
                >
                  {loading ? 'Processing Transaction...' : 'Submit Payment Record'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Lock size={14} /> Transactions are immutable and secured on-chain.
                </div>
              </form>

              {/* Right Box matching mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  background: '#EDE9FE',
                  borderRadius: '24px',
                  padding: '1.8rem',
                  border: '1px solid #DDD6FE'
                }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                    Payment Info
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Institution</span>
                    <span style={{ fontWeight: 700, textAlign: 'right' }}>Global Tech<br />University</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Billing Period</span>
                    <span style={{ fontWeight: 700 }}>{new Date().getMonth() >= 6 ? 'Semester Gasal ' : 'Semester Genap '}{new Date().getFullYear()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <span style={{ background: '#FEF08A', color: '#854D0E', padding: '3px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                      OPEN
                    </span>
                  </div>
                </div>

                {/* Campus Portal card */}
                <div style={{
                  borderRadius: '24px',
                  padding: '2rem',
                  background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)',
                  color: 'white',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(30, 27, 75, 0.3)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Campus Portal</div>
                  <div style={{ color: '#A5B4FC', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    View Academic Calendar <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            </div>
        ) : (
          /* History View */
          <div className="card-soft animate-fade-in" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8F9FF', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', width: '100px', letterSpacing: '0.5px' }}>PAYMENT ID</th>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>SEMESTER</th>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>NOMINAL</th>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>NIM HASH (PRIVACY)</th>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '1.1rem 1.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#4B5563', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>PROOF CID</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Belum ada riwayat transaksi pembayaran.
                    </td>
                  </tr>
                ) : (
                  myPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span className="mono" style={{ background: '#F1F5F9', color: '#334155', padding: '5px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-block' }}>
                          #{String(p.id).padStart(3, '0')}
                        </span>
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
                        <span className="mono" style={{ color: '#4F46E5', fontWeight: 700, fontSize: '0.88rem', background: '#EEF2FF', padding: '4px 10px', borderRadius: '8px', border: '1px solid #C7D2FE' }}>
                          {p.nimHash.substring(0, 14)}...
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        {p.status === 0 && (
                          <span style={{ background: '#FEF3C7', color: '#D97706', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid #FDE68A' }}>
                            <Clock size={14} /> Pending
                          </span>
                        )}
                        {p.status === 1 && (
                          <span style={{ background: '#D1FAE5', color: '#059669', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid #A7F3D0' }}>
                            <CheckCircle2 size={14} /> Verified
                          </span>
                        )}
                        {p.status === 2 && (
                          <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid #FECACA' }}>
                            <AlertCircle size={14} /> Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1.2rem 1.4rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => setSelectedProofPayment(p)}
                          className="mono"
                          style={{ background: '#F8F9FF', border: '1px solid #C7D2FE', color: '#4F46E5', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}
                        >
                          {p.proofHash.substring(0, 8)}... <ExternalLink size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
          </>
        )}
      </main>

      <IpfsProofModal 
        isOpen={Boolean(selectedProofPayment)} 
        onClose={() => setSelectedProofPayment(null)} 
        payment={selectedProofPayment} 
      />
    </div>
  );
}
