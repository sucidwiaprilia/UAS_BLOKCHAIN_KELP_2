# EduPayChain — Frontend Architecture & UI/UX Documentation

[![GitHub Repository](https://img.shields.io/badge/GitHub-UAS__BLOKCHAIN__KELP__2-4F46E5?style=for-the-badge&logo=github)](https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2)
[![React Version](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite Build](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

Modul ini berisi antarmuka pengguna (*Frontend*) untuk DApp **EduPayChain**, sistem verifikasi pembayaran UKT terdesentralisasi yang dikembangkan oleh **Kelompok 2**.

🔗 **Repositoy GitHub:** [https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2](https://github.com/sucidwiaprilia/UAS_BLOKCHAIN_KELP_2)

---

## ⚡ Fitur Utama Frontend

- **Blazing Fast Vite Build & Code-Splitting:**  
  Menggunakan `React.lazy()` dan `Suspense` untuk memecah berkas halaman secara dinamis. Bundel utama berada di bawah batas optimal 500 kB, menjamin waktu muat super cepat.
- **Glassmorphic & Premium UI Aesthetics:**  
  Desain antarmuka berkelas dengan palet warna biru-indigo modern, gradien halus, efek kaca (*glassmorphism*), dan animasi konfeti saat pembayaran terverifikasi.
- **Segmented Interactive Navbar:**  
  Navigasi berbentuk kapsul (*pills*) dengan tombol kembali eksplisit (**← Beranda**) di setiap halaman.
- **Ethers.js v6 Web3 Service Layer:**  
  Lapisan abstraksi `BlockchainService` yang bersinggungan langsung dengan dompet **MetaMask** dan Smart Contract Ethereum Sepolia.

---

## 📦 Panduan Instalasi & Menjalankan Frontend

1. **Masuk ke direktori frontend:**
   ```bash
   cd frontend
   ```

2. **Pasang seluruh dependensi NPM:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (*Development Server*):**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

4. **Verifikasi Kualitas Kode & Build Produksi:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🏗️ Struktur Folder `src/`

```
src/
├── config/
│   └── contract.js          # Konfigurasi alamat Smart Contract, ABI, & Mock Data
├── services/
│   └── blockchainService.js # Abstraksi komunikasi Ethers.js v6 & MetaMask
├── context/
│   └── Web3Context.jsx      # Global State Management (Wallet, Transactions, Alerts)
├── utils/
│   └── formatters.js        # Fungsi pemformatan ETH/IDR, IPFS Gateway URL, & waktu
├── components/
│   ├── Navbar.jsx           # Navigasi utama bergaya Segmented Pills modern
│   └── IpfsProofModal.jsx   # Modal pratinjau bukti bayar (JPG/PNG/PDF) ergonomis
└── pages/
    ├── LandingPage.jsx      # Halaman utama & panduan 3 langkah
    ├── StudentPage.jsx      # Portal mahasiswa untuk submit pembayaran UKT
    ├── AdminPage.jsx        # Portal verifikasi & penolakan oleh Pihak Sekolah
    └── PublicVerifyPage.jsx # Portal audit independen tanpa login
```
