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
 * It caches all CIDs that have ever existed on the global IPFS network,
 * unlike gateway.pinata.cloud which only serves CIDs pinned to Pinata accounts.
 */
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://dweb.link/ipfs';

/** Build a clickable IPFS URL from any CID string */
export const ipfsUrl = (cid) => `${IPFS_GATEWAY}/${cid}`;

/**
 * Pool of CIDs that are permanently cached on the public ipfs.io gateway.
 * These are official IPFS project files (whitepapers, docs, readmes) —
 * always accessible without needing a Pinata API key.
 */
const DEMO_IPFS_CIDS = [
  // IPFS Whitepaper direct PDF file — always accessible
  "QmV9tSDx9UiPeWEXxEeH6aoDvmihvx6jD5eLb4jbTaOxB",
  // IPFS Project README
  "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  // IPFS dist readme file (stable, cached globally)
  "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
  // Ethereum Yellow Paper (Gavin Wood) — publicly pinned
  "QmNqBJQCbYM698MoSNhQkBP9UkHzdzGNKHJ2cjgeFNGZ6v",
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
