# EduPayChain — Sistem Pembayaran UKT Terdesentralisasi (UAS Blockchain Kelompok 2)

[![GitHub Repository](https://img.shields.io/badge/GitHub-UAS__BLOKCHAIN__KELP__2-4F46E5?logo=github)](https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2)
[![Smart Contract Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-059669?logo=ethereum)](https://sepolia.etherscan.io/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-0369A1)](#arsitektur-proyek)

**EduPayChain** adalah portal pembayaran Uang Kuliah Tunggal (UKT) berbasis blockchain dan penyimpanan terenkripsi IPFS. Proyek ini dibangun untuk memenuhi Tugas Akhir (UAS) mata kuliah Blockchain oleh **Kelompok 2**.

🔗 **Link Repositori Resmi:** [https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2](https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2)

---

## ✨ Fitur Utama

1. **Student Portal (Mahasiswa):**
   - Mengisi form pembayaran UKT (NIM, Semester, Jumlah IDR/ETH).
   - Mengunggah berkas bukti transaksi secara otomatis terenkripsi dan disimpan permanen di jaringan **IPFS**.
   - Pelacakan riwayat pembayaran (*Pending, Verified, Rejected*) secara *real-time*.

2. **Admin Portal (Pihak Sekolah):**
   - Dilengkapi proteksi **Role-Based Access Control (RBAC)** on-chain. Hanya dompet digital otorisasi sekolah yang dapat memverifikasi atau menolak pembayaran.
   - Dasbor pemantauan analitik (*Total, Pending, Verified, Rejected Assets*).

3. **Public Verification Portal:**
   - Portal penelusuran publik independen berdasarkan Payment ID (`#1`, `#2`), NIM, atau Hash transaksi.
   - Memastikan transparansi penuh dan auditabilitas tanpa perantara.

---

## 🏗️ Arsitektur Proyek (*Clean Architecture*)

Proyek ini dipisahkan menjadi lapisan modular yang bersih dan efisien:

```
frontend/src/
├── config/        # Konfigurasi Smart Contract & ABI (contract.js)
├── services/      # Lapisan Infrastruktur Blockchain & Ethers.js v6 (blockchainService.js)
├── context/       # State Management & React Context API (Web3Context.jsx)
├── utils/         # Fungsi Utilitas Murni & Formatters (formatters.js)
├── components/    # Komponen UI Reusable (Navbar.jsx, IpfsProofModal.jsx)
└── pages/         # Lazy-loaded Page Bundles (LandingPage, StudentPage, AdminPage, PublicVerifyPage)
```

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2.git
   cd UAS_BlockChain_Kelompok2/frontend
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan:**
   ```bash
   npm run dev
   ```

4. **Verifikasi Kualitas Kode (Linter & Build):**
   ```bash
   npm run lint
   npm run build
   ```

---

## 👥 Kontributor — Kelompok 2
* **Suci Dwi Aprilia** (Repository Owner) & Tim Kelompok 2
