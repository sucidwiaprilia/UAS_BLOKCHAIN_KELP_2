/**
 * Domain & Utility Layer - Formatters and Generators
 * Follows Clean Architecture by separating pure domain transformations from UI and State.
 */

export const formatAddress = (addr) => {
  if (!addr) return "Connect Wallet";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export const formatEthToIdr = (ethAmount, rate = 28000000) => {
  const parsed = parseFloat(ethAmount || 0);
  if (isNaN(parsed)) return "Rp 0";
  return `Rp ${(parsed * rate).toLocaleString('id-ID')}`;
};


/**
 * IPFS public gateway — ipfs.io is the official Protocol Labs gateway.
 * Menghindari dweb.link (Service Worker gateway) yang sering timeout/500.
 * ipfs.io langsung serve file tanpa Service Worker intermediary.
 */
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs';

/** Daftar gateway publik untuk fallback jika gateway utama tidak tersedia */
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
  'https://gateway.pinata.cloud/ipfs',
];

/** Build a clickable IPFS URL from any CID string (atau CID/path untuk direktori) */
export const ipfsUrl = (cid) => `${IPFS_GATEWAY}/${cid}`;

/** Menghasilkan array URL dari semua gateway untuk UI fallback links */
export const ipfsGatewayUrls = (cid) =>
  IPFS_GATEWAYS.map(gw => ({ url: `${gw}/${cid}`, name: new URL(gw).hostname }));

/**
 * Pool CID demo yang mengarah ke SINGLE FILE (bukan direktori DAG).
 *
 * PENTING: CID `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG` yang lama
 * adalah DIREKTORI, sehingga gateway menampilkan halaman "Index of /ipfs/...".
 * Sekarang menggunakan path langsung ke file di dalam direktori, atau CID file tunggal.
 *
 * Semua CID di bawah telah diverifikasi accessible via ipfs.io gateway.
 */
const DEMO_IPFS_CIDS = [
  // IPFS Welcome readme (single file dari dalam direktori resmi IPFS)
  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme",
  // IPFS About document (deskripsi lengkap proyek IPFS — file tunggal)
  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/about",
  // IPFS Quick-start guide (panduan singkat — file tunggal)
  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/quick-start",
  // IPFS Security notes (catatan keamanan — file tunggal)
  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/security-notes",
  // IPFS dist welcome page (single file, terverifikasi CIDv0)
  "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
  // "Hello World" — file tunggal paling sederhana di jaringan IPFS
  "QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u",
];

export const generateMockCid = () => {
  const idx = Math.floor(Math.random() * DEMO_IPFS_CIDS.length);
  return DEMO_IPFS_CIDS[idx];
};

export const generateNimHash = () => {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

export const formatCurrentDateTime = () => {
  const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} ${timeStr} WIB`;
};

/** Get dynamic real-time recent date formatted for mock data */
export const formatRecentDateTime = (daysAgo = 0, hourStr = "14:30") => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${dateStr} ${hourStr} WIB`;
};

/** Get dynamic academic semester due date based on real current system year */
export const getNextDueDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  // Semester Gasal batas bayar: 15 Agustus
  // Semester Genap batas bayar: 15 Februari
  if (now.getMonth() < 1 || (now.getMonth() === 1 && now.getDate() <= 15)) {
    return `15 Feb ${year}`;
  } else if (now.getMonth() < 7 || (now.getMonth() === 7 && now.getDate() <= 15)) {
    return `15 Agu ${year}`;
  } else {
    return `15 Feb ${year + 1}`;
  }
};

export const getStatusConfig = (status) => {
  switch (status) {
    case 0:
      return { label: 'Pending', bg: '#FEF3C7', text: '#D97706', dot: '#D97706' };
    case 1:
      return { label: 'Verified', bg: '#D1FAE5', text: '#059669', dot: '#059669' };
    case 2:
      return { label: 'Rejected', bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' };
    default:
      return { label: 'Unknown', bg: '#F3F4F6', text: '#6B7280', dot: '#6B7280' };
  }
};
