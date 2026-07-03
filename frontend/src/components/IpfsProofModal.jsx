import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Database,
  Hash,
  Award
} from 'lucide-react';
import { ipfsUrl, getStatusConfig } from '../utils/formatters';

export default function IpfsProofModal({ isOpen, onClose, payment }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !payment) return null;

  const statusConfig = getStatusConfig(payment.status);

  const handleCopyCid = () => {
    if (payment.proofHash) {
      navigator.clipboard.writeText(payment.proofHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isImageFile = payment.fileDataUrl && payment.fileDataUrl.startsWith('data:image/');
  const isPdfFile = payment.fileDataUrl && payment.fileDataUrl.startsWith('data:application/pdf');

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="card-soft"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '20px',
          border: '2px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#4F46E5', color: '#fff', display: 'flex', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#1F2937' }}>IPFS Merkle DAG Storage Viewer</h3>
              <span style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>Decentralized Content-Addressed Document System</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '8px', color: '#4B5563', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Box CID & Status Pinning */}
        <div style={{ background: '#F8F9FF', padding: '1.25rem', borderRadius: '14px', border: '2px solid #CBD5E1', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Hash size={16} color="#4F46E5" /> IPFS Content Identifier (CID SHA-256):
            </span>
            <span style={{ background: '#D1FAE5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #A7F3D0' }}>
              <CheckCircle2 size={14} /> Pinned 3 Nodes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #94A3B8' }}>
            <span className="mono" style={{ fontSize: '0.85rem', color: '#4F46E5', wordBreak: 'break-all', flex: 1, fontWeight: 700 }}>
              {payment.proofHash}
            </span>
            <button
              onClick={handleCopyCid}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', fontWeight: 700, border: '1px solid #4F46E5', background: '#EEF2FF' }}
            >
              {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              {copied ? 'Disalin!' : 'Salin CID'}
            </button>
          </div>
        </div>

        {/* Bukti Pembayaran Render Area */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#4F46E5" /> Pratinjau Dokumen Bukti Pembayaran:
          </h4>

          {isImageFile ? (
            <div style={{ textAlign: 'center', border: '2px solid #CBD5E1', borderRadius: '14px', padding: '1rem', background: '#F8F9FF' }}>
              <img 
                src={payment.fileDataUrl} 
                alt="Bukti Pembayaran UKT" 
                style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              />
            </div>
          ) : isPdfFile ? (
            <div style={{ border: '2px solid #CBD5E1', borderRadius: '14px', overflow: 'hidden', height: '420px', background: '#FFFFFF' }}>
              <iframe 
                src={payment.fileDataUrl} 
                title="Bukti Pembayaran PDF" 
                width="100%"  
                height="100%" 
                style={{ border: 'none' }}
              />
            </div>
          ) : (
            /* Digital Official Receipt Certificate (Untuk Mock / Demo tanpa upload file) */
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: '#f8fafc', 
                padding: '2rem', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
                <Award size={220} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                    UNIVERSITAS / EDUPAYCHAIN
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                    SLIP BUKTI PEMBAYARAN UKT
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: statusConfig.bg, color: statusConfig.text, padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block' }}>
                    {statusConfig.label.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                    ID: #{String(payment.id).padStart(3, '0')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>NIM Mahasiswa:</span>
                  <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{payment.nim || '21040120'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Periode Akademik:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{payment.semester}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Nominal Dibayarkan:</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>{payment.amountIdr}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>({payment.amountEth} ETH)</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Waktu Pencatatan:</span>
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{payment.timestamp}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#38bdf8" /> Integritas Blockchain (NIM Hash - UU PDP):
                </div>
                <div className="mono" style={{ fontSize: '0.75rem', color: '#e2e8f0', wordBreak: 'break-all' }}>
                  {payment.nimHash || '0x8f72a9c31b8e4f5a112233445566778899aabbccddeeff001122334455667788'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #E5E7EB', paddingTop: '1.25rem' }}>
          <a
            href={ipfsUrl(payment.proofHash)}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, border: '2px solid #4F46E5' }}
          >
            <ExternalLink size={15} /> Buka di Gateway Eksternal (ipfs.io)
          </a>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '0.65rem 2rem', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
