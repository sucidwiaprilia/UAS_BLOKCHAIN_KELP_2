# PENJELASAN APLIKASI: EDUPAYCHAIN
**Sistem Verifikasi Pembayaran Uang Kuliah Tunggal (UKT) Berbasis Blockchain Ethereum & IPFS**

---

## 🎯 1. TUJUAN APLIKASI

**EduPayChain** dirancang sebagai solusi teknologi terdesentralisasi (*Decentralized Application* / DApp) untuk memodernisasi dan mengamankan sistem pembayaran serta verifikasi administrasi keuangan perguruan tinggi.

### Masalah Utama yang Diselesaikan:
1. **Pencegahan Pemalsuan Bukti Bayar:** Dalam sistem konvensional, mahasiswa mengunggah bukti transfer (foto/PDF) ke portal akademik yang sangat mudah dipalsukan menggunakan perangkat lunak sunting gambar (seperti Photoshop). Dengan EduPayChain, bukti pembayaran divalidasi dan dicatat sidik jarinya (*hash*) di atas **Smart Contract Blockchain Ethereum**, sehingga bersifat **kekal, transparan, dan tidak dapat dimanipulasi (*immutable*)**.
2. **Efisiensi Rekonsiliasi Keuangan Kampus:** Mengeliminasi proses pencocokan manual berhari-hari oleh staf administrasi keuangan. Setiap transaksi tercatat secara *real-time* dengan penanda waktu (*timestamp*) yang pasti.
3. **Perlindungan Privasi Mahasiswa (*Privacy-Preserving*):** Data sensitif seperti Nomor Induk Mahasiswa (NIM) tidak disimpan secara telanjang (*plaintext*) di blockchain publik, melainkan diubah menjadi **NIM Hash (Keccak-256 / SHA-256)** sebelum dikirimkan ke smart contract.
4. **Efisiensi Biaya Gas (*Gas-Efficient Storage*):** Dokumen fisik slip pembayaran tidak disimpan langsung ke blockchain (yang membutuhkan biaya sangat mahal), melainkan disimpan dalam jaringan terdesentralisasi **IPFS (InterPlanetary File System)**. Blockchain hanya mencatat referensi unik **IPFS CID (Content Identifier)** sebagai bukti keabsahan dokumen.

---

## 🏗️ 2. ARSITEKTUR & TEKNOLOGI UTAMA

Aplikasi ini dibangun menggunakan prinsip **Clean Architecture** dan **Clean Code**, memisahkan lapisan logika blockchain, antarmuka pengguna, dan penyimpanan:

* **Smart Contract Layer (Solidity):** Berfungsi sebagai *State Machine* utama yang berjalan di atas jaringan Ethereum (Sepolia Testnet). Mengatur struktur data pembayaran, aturan verifikasi, serta memancarkan event (`PaymentSubmitted`, `PaymentVerified`, `PaymentRejected`).
* **Frontend Layer (React + Vite + Web3/Ethers.js):** Antarmuka pengguna visual modern dengan UI/UX premium yang responsif. Menghubungkan pengguna langsung ke blockchain melalui dompet kripto **MetaMask**.
* **Decentralized File Storage (IPFS):** Protokol penyimpanan berkas *peer-to-peer* untuk menjamin dokumen bukti bayar tidak akan pernah hilang atau bisa diubah sepihak (*tamper-proof*).
* **Persistent State Synchronization:** Sistem otomatis yang menjaga sinkronisasi memori peramban (*LocalStorage*) dengan status transaksi aktif sehingga riwayat transaksi *Live MetaMask* tidak hilang sewaktu halaman dimuat ulang (*refresh*).

---

## 🔄 3. ALUR KERJA SISTEM (WORKFLOW)

Secara garis besar, alur kerja EduPayChain terbagi menjadi 3 (tiga) pilar utama:

```
[ Mahasiswa / Student ] 
       │ (1. Hubungkan MetaMask & Upload Slip Bayar)
       ▼
[ IPFS Storage Layer ] ──(Hasilkan IPFS CID Bukti)──┐
                                                    ▼
[ Smart Contract Ethereum ] ◄──(Submit TX On-Chain)─┴── [ MetaMask Wallet ]
       │
       ├────────────────────────────────────────────┐
       ▼ (Event Emit)                               ▼ (Read On-Chain State)
[ Panel Admin Keuangan ]                  [ Portal Verifikasi Publik ]
  (Verifikasi / Tolak Bukti)              (Auditor / Orang Tua / Lembaga Beasiswa)
```

### A. Alur Mahasiswa (*Student Workflow*)
1. **Koneksi Dompet:** Mahasiswa membuka portal mahasiswa dan menghubungkan dompet kripto **MetaMask**.
2. **Pengisian Data:** Mahasiswa memasukkan NIM (sistem otomatis menghitung nilai Keccak-256 Hash demi privasi), memilih semester yang dibayar, serta nominal pembayaran.
3. **Unggah Bukti Fisik:** Mahasiswa mengunggah berkas slip pembayaran bank (format JPG/PNG/PDF). Sistem memproses berkas tersebut untuk mendapatkan **IPFS CID Hash**.
4. **Tanda Tangan Transaksi (*Transaction Signing*):** Mahasiswa menekan tombol submit dan menyetujui transaksi melalui jendela konfirmasi MetaMask.
5. **Pencatatan Berhasil:** Transaksi masuk ke dalam blockchain dengan status awal **Pending (0)** dan mahasiswa mendapatkan nomor referensi *Payment ID*. Transaksi asli ditandai dengan lencana **`⚡ LIVE METAMASK`**.

### B. Alur Admin Keuangan Kampus (*Admin Workflow*)
1. **Akses Panel Khusus:** Admin masuk ke dasbor manajemen keuangan kampus.
2. **Penyaringan Data (*Smart Filtering*):** Admin dapat melihat statistik total transaksi dan menyaring tabel berdasarkan status (`All`, `Pending`, `Verified`, `Rejected`, atau tab khusus `Live MetaMask` untuk melihat transaksi nyata pengguna).
3. **Pemeriksaan Bukti Fisik:** Admin menekan tombol **Detail** pada tabel. Jendela *Modal Detail* ergonomis akan terbuka, menampilkan:
   * Alamat Wallet MetaMask pengirim & NIM Hash.
   * Semester & Nominal UKT.
   * **Preview Langsung Dokumen Slip Bayar:** Jika berupa foto (PNG/JPG), gambar langsung ditampilkan di layar modal. Jika berupa PDF, sistem menyediakan pratinjau dokumen beserta tombol **Unduh File Asli**.
4. **Keputusan Verifikasi On-Chain:**
   * Jika bukti sah, Admin menekan tombol **Verifikasi On-Chain**. MetaMask admin akan meminta konfirmasi, dan status transaksi diubah menjadi **Verified (1)**.
   * Jika bukti tidak valid/palsu, Admin menekan tombol **Tolak Bukti**, mengubah status menjadi **Rejected (2)**.

### C. Alur Verifikasi Publik (*Public Verification Workflow*)
1. **Akses Terbuka Tanpa Login:** Portal ini dapat diakses oleh siapa saja (orang tua mahasiswa, lembaga pemberi beasiswa, auditor kampus, atau perusahaan tempat mahasiswa melamar kerja) tanpa perlu menghubungkan dompet MetaMask.
2. **Pencarian Presisi Tinggi:** Pengguna memasukkan nomor **Payment ID** (contoh: `#1` atau `1`) atau **NIM Hash** pada kolom pencarian.
3. **Algoritma Prioritas Pencarian:** Sistem menggunakan pencarian bertingkat (*Hierarchical Matching*) sehingga ketikan nomor pendek mutlak mencocokkan ID transaksi tanpa bentrok dengan deretan angka acak di dalam string hash.
4. **Validasi Keaslian:** Halaman verifikasi menampilkan bukti keabsahan transaksi (*Verified On-Chain ✅*), waktu pengiriman, alamat dompet pengirim, serta menyediakan tautan langsung dan pratinjau dokumen asli yang tersimpan di IPFS.

---

## 💡 4. DAFTAR FITUR & FUNGSI UTAMA

| Fitur Utama | Fungsi & Kegunaan |
| :--- | :--- |
| **MetaMask Web3 Integration** | Memungkinkan interaksi langsung antara antarmuka peramban dengan jaringan blockchain Ethereum untuk pengiriman transaksi dan verifikasi kriptografis. |
| **Live MetaMask TX Tagging** | Penanda otomatis (`⚡ LIVE METAMASK`) yang membedakan transaksi nyata dari dompet pengguna dengan data sampel/demo bawaan sistem. |
| **Privacy Keccak-256 Hashing** | Melindungi identitas mahasiswa dengan mengubah NIM menjadi string hash kriptografi sebelum dicatat di buku besar publik blockchain. |
| **Multi-Format Document Preview** | Memungkinkan Admin dan pihak pemverifikasi mempratinjau serta mengunduh bukti transfer fisik (JPG/PNG/PDF) secara langsung di dalam panel aplikasi. |
| **Ergonomic Modal Layout** | Jendela detail transaksi dengan pembatas tinggi otomatis (`maxHeight: 86vh`) dan tombol tutup *sticky*, mencegah tampilan terpotong pada layar laptop. |
| **Hierarchical Search Protection** | Menjamin keakuratan hasil pencarian pada portal publik dengan memprioritaskan pencarian ID presisi di atas pencarian substring hash. |
| **Persistent Local Synchronization** | Menyimpan riwayat penambahan transaksi baru secara permanen di dalam penyimpanan peramban sehingga tidak hilang sewaktu halaman diperbarui (*refresh*). |
