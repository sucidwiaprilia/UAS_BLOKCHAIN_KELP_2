import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { ipfsUrl } from '../utils/formatters';

export default function PublicVerifyPage() {
  const { payments } = useWeb3();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    if (!query || !query.trim()) {
      setResult(null);
      return;
    }

    const cleaned = query.replace('#', '').trim();

    // 1. Prioritas Utama: Exact ID Match (Jika user ketik #3 atau 3, cari ID = 3)
    const exactIdMatch = payments.find(p => p.id.toString() === cleaned);
    if (exactIdMatch) {
      setResult(exactIdMatch);
      return;
    }

    // 2. Prioritas Kedua: Exact NIM atau Wallet Address Match
    const nimOrWalletMatch = payments.find(p => 
      (p.nim && p.nim === cleaned) || 
      (p.student && p.student.toLowerCase() === cleaned.toLowerCase())
    );
    if (nimOrWalletMatch) {
      setResult(nimOrWalletMatch);
      return;
    }

    // 3. Prioritas Ketiga: Substring hash/NIM hanya jika input spesifik (panjang >= 4 digit)
    if (cleaned.length >= 4) {
      const hashMatch = payments.find(p => 
        (p.nimHash && p.nimHash.toLowerCase().includes(cleaned.toLowerCase())) || 
        (p.proofHash && p.proofHash.toLowerCase().includes(cleaned.toLowerCase())) ||
        (p.nim && p.nim.includes(cleaned))
      );
      setResult(hashMatch || null);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: '#EEF2FF',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.2rem'
        }}>
          <ShieldCheck size={36} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>
          Verifikasi Publik Blockchain
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Portal verifikasi independen EduPayChain. Masukkan Payment ID (#1, #2...) atau NIM Hash untuk memverifikasi keaslian pembayaran UKT langsung dari smart contract.
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan Payment ID (cth: 1 atau 2) atau Hash..."
            style={{
              width: '100%',
              padding: '1.1rem 1.5rem 1.1rem 3.5rem',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              fontSize: '1rem',
              background: 'white',
              boxShadow: 'var(--shadow-md)',
              outline: 'none'
            }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0 2.2rem', fontSize: '1rem' }}
        >
          Cek Status
        </button>
      </form>

      {searched && (
        result ? (
          <div className="card-soft animate-fade-in" style={{ padding: '2.5rem', border: '1px solid #C7D2FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAYMENT RECORD</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 className="mono" style={{ fontSize: '1.8rem', fontWeight: 800 }}>#{result.id}</h2>
                  {result.isRealTx ? (
                    <span style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>⚡ LIVE METAMASK</span>
                  ) : (
                    <span style={{ background: '#F1F5F9', color: '#64748B', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem' }}>📋 SAMPEL DEMO</span>
                  )}
                </div>
              </div>

              <div>
                {result.status === 0 && (
                  <span style={{ background: '#FEF3C7', color: '#D97706', padding: '6px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> PENDING VALIDATION
                  </span>
                )}
                {result.status === 1 && (
                  <span style={{ background: '#D1FAE5', color: '#059669', padding: '6px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> VERIFIED ON-CHAIN ✅
                  </span>
                )}
                {result.status === 2 && (
                  <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '6px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> REJECTED / INVALID
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEMESTER</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{result.semester}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>NOMINAL PEMBAYARAN</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>{result.amountEth} ETH ({result.amountIdr})</div>
              </div>
            </div>

            <div style={{ background: '#F8F9FF', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>NIM HASH (KECCAK256 PRIVACY) & WALLET</div>
              <div className="mono" style={{ fontSize: '0.82rem', wordBreak: 'break-all' }}>
                Wallet: {result.student}<br />
                Hash: {result.nimHash}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: result.fileDataUrl ? '1.5rem' : '0' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BUKTI BAYAR IPFS</div>
                <a href={ipfsUrl(result.proofHash)} target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {result.proofHash} <ExternalLink size={14} />
                </a>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Waktu Kirim: {result.timestamp}
              </div>
            </div>

            {result.fileDataUrl && (
              <div style={{ padding: '1rem', background: '#F8F9FF', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.8rem' }}>📸 DOKUMEN / SLIP TERLAMPIR</div>
                {result.fileDataUrl.startsWith('data:application/pdf') ? (
                  <div style={{ textAlign: 'center' }}>
                    <iframe src={result.fileDataUrl} title="PDF Bukti Bayar" style={{ width: '100%', height: '240px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white' }} />
                    <a href={result.fileDataUrl} download={`Bukti_Bayar_${result.id}.pdf`} style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>⬇ Unduh Dokumen PDF Asli</a>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <img src={result.fileDataUrl} alt="Slip Bukti Bayar" style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={result.fileDataUrl} download={`Bukti_Bayar_${result.id}.png`} style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>⬇ Unduh Foto Bukti Bayar Asli</a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="card-soft" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>Data Tidak Ditemukan</h3>
            <p>Pastikan Payment ID yang dimasukkan sesuai dengan riwayat pembayaran on-chain.</p>
          </div>
        )
      )}
    </div>
  );
}
