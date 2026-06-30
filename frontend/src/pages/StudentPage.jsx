import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { 
  CreditCard, 
  History, 
  ShieldCheck, 
  Plus, 
  CloudUpload, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ipfsUrl, getNextDueDate } from '../utils/formatters';

export default function StudentPage() {
  const { account, payments, submitNewPayment, loading } = useWeb3();
  const [activeSubTab, setActiveSubTab] = useState('form'); // 'form' | 'history'

  // Form State
  const [nim, setNim] = useState('21040120');
  const [semester, setSemester] = useState('Semester 4');
  const [amountIdrInput, setAmountIdrInput] = useState('12500000');
  const [fileName, setFileName] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
      file: fileName,
      fileDataUrl
    });

    setLastSubmitted(res);
    setSubmittedSuccess(true);
    
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Filter payments for the currently connected account.
  // Falls back to all demo payments when in demo mode (account === null).
  const myPayments = account
    ? payments.filter(p => p.student.toLowerCase() === account.toLowerCase())
    : payments.filter(p => p.student === '0xDemoMode' || p.student.startsWith('0x71C8'));

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
        {/* Header Title + Due date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
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
          submittedSuccess ? (
            /* Success View */
            <div className="card-soft animate-fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Pembayaran UKT Berhasil Dikirim!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Transaksi Anda telah dicatat di smart contract EduPayChain dan file bukti bayar dienkripsi ke IPFS.
              </p>

              <div style={{ background: '#F8F9FF', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment ID:</span>
                  <span className="mono" style={{ fontWeight: 700 }}>#{lastSubmitted?.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status On-Chain:</span>
                  <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                    PENDING REVIEW
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>NIM Hash (Privasi UU PDP):</span>
                  <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                    {lastSubmitted?.nimHash.substring(0, 16)}...
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>IPFS CID Proof:</span>
                  <span className="mono" style={{ fontSize: '0.8rem' }}>
                    {lastSubmitted?.proofHash.substring(0, 16)}...
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setActiveSubTab('history')}
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem' }}
                >
                  Lihat Riwayat Pembayaran
                </button>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 2rem' }}
                >
                  Bayar Semester Lainnya
                </button>
              </div>
            </div>
          ) : (
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
          )
        ) : (
          /* History View */
          <div className="card-soft animate-fade-in" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8F9FF', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAYMENT ID</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>SEMESTER</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>NOMINAL</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>NIM HASH (PRIVACY)</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>STATUS</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROOF CID</th>
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
                    <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td className="mono" style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>#{p.id}</td>
                      <td style={{ padding: '1.2rem 1.5rem', fontWeight: 600 }}>{p.semester}</td>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <span style={{ fontWeight: 700 }}>{p.amountEth} ETH</span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.amountIdr}</div>
                      </td>
                      <td className="mono" style={{ padding: '1.2rem 1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {p.nimHash.substring(0, 14)}...
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        {p.status === 0 && (
                          <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> Pending
                          </span>
                        )}
                        {p.status === 1 && (
                          <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Verified
                          </span>
                        )}
                        {p.status === 2 && (
                          <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={13} /> Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <a 
                          href={ipfsUrl(p.proofHash)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mono"
                          style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                        >
                          {p.proofHash.substring(0, 8)}... <ExternalLink size={13} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
