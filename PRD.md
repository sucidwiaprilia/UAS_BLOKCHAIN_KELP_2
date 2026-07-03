# Product Requirements Document (PRD)
## EduPayChain — Web3 DApp Pembayaran UKT Berbasis Blockchain

---

> **Versi:** 2.0.0
> **Tanggal:** 30 Juni 2026
> **Tim:** Kelompok 2 — Institut Teknologi PLN
> **Mata Kuliah:** Teknologi Blockchain
> **Dosen Pengampu:** Riani Saputri Abadi, ST., M.Kom
> **GitHub:** https://github.com/keziasiahaan/uts-blockchain-kelompok2

---

## 1. Tim Pengembang

| Nama | NIM | Peran |
|------|-----|-------|
| Elfira Risa Hidayat | 202332017 | Analisis Sistem & Kebutuhan |
| Fahira Shinda | 202332020 | Kajian Literatur & Riset |
| Suci Dwi Aprilia | 202332027 | Desain UI/UX & Frontend |
| Helen Kezia Nofitri Siahaan | 202332035 | Smart Contract & Dokumentasi |

---

## 2. Ringkasan Proyek

**EduPayChain** adalah aplikasi Web3 (DApp) berbasis blockchain untuk sistem pembayaran UKT (Uang Kuliah Tunggal) di perguruan tinggi. Sistem ini dibangun sebagai Proof of Concept (PoC) menggunakan smart contract Solidity yang di-deploy di Ethereum Sepolia Testnet, dengan antarmuka website modern berbasis **React.js + Vite**.

### Masalah yang Diselesaikan
- Transparansi rendah: mahasiswa tidak dapat melacak status pembayaran UKT secara real-time
- Manipulasi data: basis data terpusat rentan terhadap perubahan ilegal
- Ketergantungan bank: gangguan sinkronisasi pihak ketiga menghambat KRS
- Tidak ada audit trail yang permanen dan dapat diverifikasi publik

### Solusi
DApp dengan dua portal (Mahasiswa & Admin) yang terhubung langsung ke smart contract `EduPayChain.sol` melalui MetaMask dan Ethers.js, dengan bukti pembayaran tersimpan di IPFS.

---

## 3. Tech Stack

| Lapisan | Teknologi | Keterangan |
|---------|-----------|------------|
| **Smart Contract** | Solidity ^0.8.20 | Di-deploy di Ethereum Sepolia Testnet |
| **Frontend Framework** | React.js 18 + Vite | SPA modern, hot reload, build cepat |
| **Styling** | CSS Modules / Tailwind CSS | Komponen styling yang terorganisir |
| **Web3 Library** | Ethers.js v6 | Interaksi dengan smart contract |
| **Wallet** | MetaMask | Autentikasi berbasis kriptografi |
| **Off-Chain Storage** | IPFS via Pinata | Penyimpanan file bukti bayar |
| **State Management** | React Context API | Wallet state & contract state |
| **Routing** | React Router v6 | Navigasi antar halaman |
| **Build Tool** | Vite | Dev server & bundler |
| **Blockchain** | Ethereum Sepolia Testnet | Chain ID: 11155111 |
| **Explorer** | Etherscan Sepolia | Verifikasi publik event log |
| **IDE Contract** | Remix IDE | Kompilasi & deploy smart contract |

---

## 4. Arsitektur Sistem

### Diagram 5 Lapisan

```
+-------------------------------------------------------------+
|              LAPISAN 1: REACT + VITE (FRONTEND)             |
|   /                  -> Landing Page                        |
|   /student           -> Portal Mahasiswa                    |
|   /admin             -> Portal Admin (restricted)           |
|   /verify            -> Verifikasi Publik                   |
+----------------------------+--------------------------------+
                             |
+----------------------------v--------------------------------+
|              LAPISAN 2: AUTENTIKASI                         |
|       MetaMask Wallet (Private Key & Signature)             |
|       Ethers.js BrowserProvider                             |
+-------------+-------------------------------+--------------+
              |                               |
+-------------v-----------+   +--------------v--------------+
|  LAPISAN 3: IPFS        |   |   LAPISAN 4: BLOCKCHAIN      |
|  Pinata SDK             |   |   Ethereum Sepolia Testnet   |
|  Upload file -> CID     |   |   EduPayChain.sol            |
|                         |   |   submitPayment()            |
|  Gateway: Pinata/IPFS   |   |   verifyPayment()            |
+-------------------------+   |   rejectPayment()            |
                              |   checkStatus()              |
                              |   getStudentPayments()       |
                              +--------------+---------------+
                                             |
                          +------------------v--------------+
                          |  LAPISAN 5: ETHERSCAN SEPOLIA   |
                          |  Event Log Publik & Transparan  |
                          +---------------------------------+
```

---

## 5. Smart Contract — EduPayChain.sol

### State Variables & Struct

```solidity
// NIM di-hash untuk privasi (UU PDP No.27/2022)
struct Payment {
    bytes32 nimHash;    // keccak256(NIM) - bukan plaintext
    string semester;
    uint256 amount;
    string proofHash;   // CID IPFS (min. 46 karakter)
    address student;
    Status status;      // Pending | Verified | Rejected
}

mapping(uint256 => Payment) public payments;
mapping(address => uint256[]) public studentPayments; // index by wallet
```

### Fungsi Utama

| Fungsi | Akses | Deskripsi |
|--------|-------|-----------|
| `submitPayment(nim, semester, amount, proofHash)` | Mahasiswa | Kirim pembayaran, CID divalidasi (>=46 char) |
| `verifyPayment(id)` | Admin only | Ubah status ke Verified |
| `rejectPayment(id)` | Admin only | Ubah status ke Rejected |
| `checkStatus(id)` | Publik (view) | Cek status transaksi, gas-free |
| `getPayment(id)` | Publik (view) | Detail lengkap transaksi |
| `getStudentPayments(address)` | Publik (view) | Semua ID transaksi milik satu mahasiswa |

### Perbaikan yang Diterapkan (v2)
1. **[FIX #1] NIM di-hash** — `keccak256(abi.encodePacked(_nim))` sebelum disimpan on-chain
2. **[FIX #2] `external` + `calldata`** — semua fungsi yang hanya dipanggil luar menggunakan `external` dan parameter `calldata` (lebih hemat gas)
3. **[FIX #3] Validasi CID IPFS** — `require(bytes(_proofHash).length >= 46)` agar tidak bisa diisi string palsu

---

## 6. Struktur Proyek React + Vite

```
eduPayChain-frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env                          # VITE_CONTRACT_ADDRESS, VITE_PINATA_KEY
├── public/
│   └── favicon.ico
└── src/
    ├── main.jsx                  # Entry point React
    ├── App.jsx                   # Router setup
    ├── index.css                 # Global styles
    │
    ├── config/
    │   ├── contract.js           # ABI + Contract Address + Chain ID
    │   └── pinata.js             # Pinata API config
    │
    ├── context/
    │   └── Web3Context.jsx       # Wallet state global (provider, signer, address)
    │
    ├── hooks/
    │   ├── useWallet.js          # Hook: connect/disconnect MetaMask
    │   ├── useContract.js        # Hook: interaksi smart contract
    │   └── useIPFS.js            # Hook: upload file ke Pinata
    │
    ├── pages/
    │   ├── LandingPage.jsx       # /  -> Hero + statistik publik
    │   ├── StudentPage.jsx       # /student -> Form submit + riwayat
    │   ├── AdminPage.jsx         # /admin -> Dashboard + tabel verifikasi
    │   └── VerifyPage.jsx        # /verify -> Cek status publik
    │
    └── components/
        ├── Navbar.jsx            # Navigasi + wallet connect button
        ├── WalletButton.jsx      # Connect/disconnect MetaMask
        ├── StatusBadge.jsx       # Badge: Pending/Verified/Rejected
        ├── PaymentCard.jsx       # Card satu transaksi
        ├── PaymentForm.jsx       # Form submit pembayaran mahasiswa
        ├── AdminTable.jsx        # Tabel transaksi untuk admin
        ├── IPFSUploader.jsx      # Drag & drop upload bukti bayar
        ├── ConfirmModal.jsx      # Modal konfirmasi sebelum transaksi
        ├── LoadingSpinner.jsx    # Loading state saat tx diproses
        └── NetworkAlert.jsx      # Alert jika salah jaringan
```

---

## 7. Halaman & Fitur Website

### 7.1 Landing Page (`/`)

**Tujuan:** Halaman utama pengenalan sistem

**Konten:**
- Hero section: nama sistem, deskripsi singkat, tombol CTA
- Tombol "Connect Wallet" (MetaMask)
- Kartu statistik on-chain: Total Transaksi, Total Verified, Total Pending
- Penjelasan singkat cara kerja sistem (3 langkah)
- Link navigasi ke Portal Mahasiswa, Portal Admin, Verifikasi

---

### 7.2 Portal Mahasiswa (`/student`)

**Akses:** Semua pengguna dengan MetaMask terhubung

#### Form Submit Pembayaran

**Input:**
| Field | Tipe | Validasi |
|-------|------|---------|
| NIM | text | Tidak boleh kosong |
| Semester | text | Tidak boleh kosong |
| Nominal UKT | number | > 0 |
| Bukti Bayar | file (jpg/png/pdf) | Wajib diupload sebelum submit |

**Alur:**
1. Connect MetaMask -> deteksi wallet address
2. Upload file bukti bayar -> Pinata SDK upload ke IPFS -> dapatkan CID
3. Isi form (NIM, Semester, Nominal)
4. Klik "Submit" -> MetaMask minta signature -> transaksi ke blockchain
5. Status awal: **Pending** -> tampilkan Payment ID + Tx Hash

#### Riwayat Pembayaran Saya
- Memanggil `getStudentPayments(walletAddress)` -> dapatkan semua ID
- Tampilkan list kartu transaksi dengan status terkini

---

### 7.3 Portal Admin (`/admin`)

**Akses:** Hanya wallet address yang terdaftar sebagai `admin` di smart contract

**Proteksi Route:**
```jsx
// Cek address saat mount, redirect jika bukan admin
const isAdmin = walletAddress?.toLowerCase() === CONTRACT_ADMIN?.toLowerCase();
if (!isAdmin) return <Navigate to="/" />;
```

#### Dashboard
- 4 kartu statistik: Total, Pending, Verified, Rejected
- Filter tabel: Semua | Pending | Verified | Rejected

#### Tabel Transaksi
| # | NIM Hash | Semester | Nominal | Status | Aksi |
|---|---------|---------|---------|--------|------|

**Aksi (hanya untuk Pending):**
- Klik **Verifikasi** -> ConfirmModal -> MetaMask sign -> `verifyPayment(id)`
- Klik **Tolak** -> ConfirmModal -> MetaMask sign -> `rejectPayment(id)`

---

### 7.4 Halaman Verifikasi Publik (`/verify`)

**Akses:** Semua orang, tanpa perlu wallet

**Fitur:**
- Search box: masukkan Payment ID
- Tampilkan detail transaksi + status badge
- Link ke Etherscan Sepolia untuk verifikasi publik
- Tabel semua transaksi (read-only, gas-free)

---

## 8. Desain UI/UX

### Palet Warna

```css
:root {
  --primary:       #6C63FF;             /* Tombol utama, aksen */
  --secondary:     #00D4FF;             /* Link, highlight */
  --bg-dark:       #0A0A1A;             /* Background halaman */
  --bg-card:       rgba(255,255,255,0.05); /* Card glassmorphism */
  --success:       #00E676;             /* Status Verified */
  --warning:       #FFD600;             /* Status Pending */
  --danger:        #FF5252;             /* Status Rejected */
  --text-primary:  #FFFFFF;
  --text-muted:    rgba(255,255,255,0.55);
  --border:        rgba(255,255,255,0.1);
  --radius:        12px;
}
```

### Tipografi
- **Font Utama:** Inter (Google Fonts)
- **Font Kode/Hash:** JetBrains Mono

### Prinsip Desain
- Dark mode premium dengan gradient ungu-biru
- Glassmorphism pada card (`backdrop-filter: blur`)
- Micro-animation pada hover dan transisi status
- Responsive: mobile-first layout

---

## 9. Konfigurasi Teknis

### Environment Variables (`.env`)

```env
VITE_CONTRACT_ADDRESS=0x...   # Address smart contract di Sepolia
VITE_CHAIN_ID=11155111        # Sepolia Testnet
VITE_PINATA_API_KEY=...       # API Key Pinata
VITE_PINATA_SECRET_KEY=...    # Secret Key Pinata
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### Contract Config (`src/config/contract.js`)

```js
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID);
export const ABI = [ /* ... ABI dari artifacts/EduPayChain.json ... */ ];
```

### Hook: useWallet (`src/hooks/useWallet.js`)

```js
export function useWallet() {
  const connect = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    // simpan ke context
  };

  const switchToSepolia = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia hex
    });
  };

  return { connect, switchToSepolia };
}
```

### Hook: useContract (`src/hooks/useContract.js`)

```js
export function useContract() {
  const submitPayment = async (nim, semester, amount, proofHash) => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const nimHash = ethers.keccak256(ethers.toUtf8Bytes(nim)); // hash di front-end juga
    const tx = await contract.submitPayment(nim, semester, amount, proofHash);
    return await tx.wait();
  };

  const verifyPayment = async (id) => { ... };
  const rejectPayment = async (id) => { ... };
  const checkStatus   = async (id) => { ... };
  const getPayment    = async (id) => { ... };

  return { submitPayment, verifyPayment, rejectPayment, checkStatus, getPayment };
}
```

---

## 10. Alur Data

### Mahasiswa Submit Pembayaran
```
[Mahasiswa buka /student]
  -> Connect MetaMask
  -> Pilih file bukti bayar
     -> Upload ke Pinata IPFS
     -> Dapat CID hash (>= 46 char)
  -> Isi NIM, Semester, Nominal
  -> Klik "Submit Pembayaran"
     -> MetaMask popup: sign transaction
     -> Panggil submitPayment() di smart contract
     -> Event PaymentSubmitted di-emit
     -> Status on-chain: PENDING
  -> Tampilkan Payment ID + Tx Hash + link Etherscan
```

### Admin Verifikasi
```
[Admin buka /admin]
  -> Connect MetaMask (wallet admin)
  -> Cek: msg.sender == admin address
  -> Dashboard tampil semua transaksi Pending
  -> Admin klik salah satu -> lihat detail
     -> Preview bukti bayar dari IPFS
  -> Klik "Verifikasi" atau "Tolak"
     -> ConfirmModal muncul
     -> MetaMask sign
     -> verifyPayment(id) atau rejectPayment(id)
     -> Status on-chain: VERIFIED / REJECTED
  -> Tabel ter-refresh otomatis
```

---

## 11. Kebutuhan Fungsional

| ID | Fitur | Prioritas | Kriteria Terima |
|----|-------|-----------|----------------|
| FR-01 | Connect MetaMask | Must Have | Wallet address tampil, Sepolia terdeteksi |
| FR-02 | Upload IPFS via Pinata | Must Have | File ter-upload, CID tampil, preview tersedia |
| FR-03 | Submit Pembayaran | Must Have | Tx berhasil, Payment ID muncul, status Pending |
| FR-04 | Verifikasi (Admin) | Must Have | Status berubah Verified, event ter-emit |
| FR-05 | Penolakan (Admin) | Must Have | Status berubah Rejected, event ter-emit |
| FR-06 | Cek Status | Must Have | Tampil Pending/Verified/Rejected by Payment ID |
| FR-07 | Riwayat Mahasiswa | Should Have | List transaksi by wallet address |
| FR-08 | Dashboard Admin | Should Have | Statistik + tabel dengan filter status |
| FR-09 | Link Etherscan | Should Have | Link ke tx hash yang benar |
| FR-10 | Alert Jaringan Salah | Must Have | Alert + tombol switch ke Sepolia |
| FR-11 | Protected Route Admin | Must Have | Non-admin diredirect ke home |

---

## 12. Kebutuhan Non-Fungsional

| Kategori | Requirement |
|----------|-------------|
| **Keamanan** | NIM di-hash keccak256 sebelum simpan on-chain; private key tidak pernah ke frontend |
| **Privasi** | Sesuai UU PDP No.27/2022: data identitas minimal on-chain |
| **Performa** | Page load < 3 detik; view call instan (gas-free) |
| **Responsif** | Mobile-friendly, minimal 320px lebar layar |
| **Kompatibilitas** | Chrome/Firefox/Edge + ekstensi MetaMask |
| **Transparansi** | Semua transaksi verifiable di Etherscan Sepolia |

---

## 13. Rencana Implementasi

### Fase 1 — Smart Contract [SELESAI]
- [x] Tulis `EduPayChain.sol` (Solidity 0.8.20)
- [x] Kompilasi di Remix IDE
- [x] FIX #1: Hash NIM dengan keccak256
- [x] FIX #2: `external` + `calldata` untuk efisiensi gas
- [x] FIX #3: Validasi panjang CID IPFS (>= 46 char)
- [ ] Deploy ke Ethereum Sepolia Testnet
- [ ] Salin Contract Address ke `.env`

### Fase 2 — Setup Proyek React + Vite
- [ ] `npm create vite@latest eduPayChain-frontend -- --template react`
- [ ] Install dependencies: `ethers`, `react-router-dom`, `@pinata/sdk`
- [ ] Setup `.env` dengan contract address & Pinata keys
- [ ] Buat `Web3Context` untuk state wallet global
- [ ] Buat `useWallet`, `useContract`, `useIPFS` hooks

### Fase 3 — Halaman & Komponen
- [ ] Buat komponen: Navbar, WalletButton, StatusBadge, LoadingSpinner, NetworkAlert
- [ ] Landing Page (`/`) + statistik on-chain
- [ ] Student Page (`/student`): form submit + riwayat
- [ ] Admin Page (`/admin`): dashboard + tabel + aksi verifikasi
- [ ] Verify Page (`/verify`): search by ID + tabel publik

### Fase 4 — Styling & Polish
- [ ] Implementasi design system (CSS variables / Tailwind)
- [ ] Dark mode + glassmorphism pada card
- [ ] Micro-animation pada transisi status
- [ ] Responsivitas mobile

### Fase 5 — Testing & Deploy
- [ ] Test end-to-end di Sepolia (submit -> verify flow)
- [ ] Deploy frontend ke Vercel / GitHub Pages
- [ ] Dokumentasi cara penggunaan

---

## 14. Analisis Risiko (Disederhanakan)

| Risiko | Mitigasi |
|--------|---------|
| MetaMask tidak terinstall | Deteksi `window.ethereum`; tampilkan instruksi install |
| Wallet di jaringan salah | `NetworkAlert` + tombol auto-switch ke Sepolia |
| IPFS gateway lambat | Gunakan Pinata (lebih stabil dari public gateway) |
| ETH Sepolia habis | Dokumentasikan link faucet Sepolia |
| Contract belum di-deploy | Gunakan address placeholder di `.env` sampai deploy selesai |

---

## 15. Referensi

1. Annisa Hasan, S., et al. (2024). *Implementasi Teknologi Blockchain dalam Pengamanan Sistem Keuangan pada Perguruan Tinggi*. Jurnal MENTARI, 3(1). https://doi.org/10.33050/mentari.v3i1
2. Liu, Z. (2024). *Research on the method to enhance the transparency of financial transactions by integrating blockchain and smart contracts*. Applied Mathematics and Nonlinear Sciences. https://doi.org/10.2478/amns-2024-2674
3. Ethers.js v6 Docs. https://docs.ethers.org/v6/
4. Vite Documentation. https://vitejs.dev/guide/
5. React Router v6. https://reactrouter.com/en/main
6. Pinata IPFS SDK. https://docs.pinata.cloud/
7. MetaMask Docs. https://docs.metamask.io/
8. Ethereum Sepolia Testnet. https://sepolia.etherscan.io/

---

*Dokumen ini dibuat berdasarkan analisis source code `EduPayChain.sol` (v2 — setelah 3 perbaikan), metadata contract, konfigurasi Remix IDE, dan laporan akademik Kelompok 2.*

**Kelompok 2 — Sistem Informasi, Fakultas Telematika Energi, Institut Teknologi PLN — 2026**
