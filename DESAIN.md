# DESIGN.md
## EduPayChain — Design System & UI Specification (Cheerful & Comfortable Edition)

---

> **Version:** 1.1.0  
> **Date:** June 30, 2026  
> **Project:** EduPayChain Web3 DApp  
> **Theme:** Cheerful & Comfortable (Light Mode)

---

## 1. Filosofi Desain

### Konsep Visual
Berbeda dari estetika "Dark Web3 Premium" sebelumnya, versi ini mengadopsi **"Cheerful & Comfortable"**. Tujuannya adalah untuk membuat interaksi Web3 terasa kurang teknis dan lebih ramah pengguna (*user-friendly*), aman, dan terpercaya bagi institusi pendidikan dan mahasiswa.

### Prinsip Utama
- **Clarity:** Latar belakang putih bersih dengan kontras tinggi untuk keterbacaan maksimal.
- **Approachability:** Penggunaan warna pastel dan biru indigo yang menenangkan.
- **Softness:** Sudut yang membulat dan bayangan lembut (*soft shadows*) untuk menghilangkan kesan kaku.
- **Trust:** Status indikator yang jelas tanpa efek glow yang berlebihan.

---

## 2. Design Tokens

### 2.1 Palet Warna

#### Primary Palette
- **Primary:** `#4F46E5` (Indigo) -> Digunakan untuk tombol utama, ikon aktif, dan brand branding.
- **Secondary:** `#CBDBF5` (Soft Blue) -> Digunakan untuk surface sekunder dan aksen latar belakang.
- **Accent:** `#818CF8` -> Digunakan untuk hover states dan gradien lembut.

#### Background & Surface
- **Page Background:** `#F8F9FF` (Very Light Blue Tint)
- **Card Surface:** `#FFFFFF` (Pure White)
- **Input Surface:** `#F3F4F6` (Light Gray)
- **Muted Surface:** `#EFF4FF`

#### Status Colors (Light Mode Adjusted)
- **PENDING:** `#D97706` (Amber) | Bg: `#FEF3C7` | Border: `#FDE68A`
- **VERIFIED:** `#059669` (Emerald) | Bg: `#D1FAE5` | Border: `#A7F3D0`
- **REJECTED:** `#DC2626` (Red) | Bg: `#FEE2E2` | Border: `#FECACA`

---

### 2.2 Tipografi

#### Font Family
- **INTER:** Digunakan untuk seluruh teks UI. Memberikan kesan modern dan sangat terbaca.
- **JETBRAINS MONO:** Khusus untuk data teknis (Wallet Address, Tx Hash, Payment ID) agar tetap memiliki karakter teknologi namun tetap bersih.

#### Type Scale
- **Display:** 3.5rem (Bold) - Landing Hero
- **Heading 1:** 2.5rem (Extrabold) - Page Titles
- **Heading 2:** 1.5rem (Bold) - Section Titles
- **Body Large:** 1.125rem (Medium) - Subtitles / Lead text
- **Body Base:** 1rem (Regular) - Standard text
- **Caption:** 0.875rem (Regular) - Metadata, labels, hints

---

### 2.3 Spacing & Radius

- **Radius (Roundness):** `ROUND_EIGHT` (8px standard, 16px-24px for large cards)
- **Spacing:** Berbasis sistem 4px (4, 8, 16, 24, 32, 48, 64).
- **Shadows:** 
  - `sm`: 0 1px 2px rgba(0,0,0,0.05)
  - `md`: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
  - `lg`: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)

---

## 3. Sistem Komponen

### 3.1 Top Navigation Bar
- **Background:** White with `backdrop-blur-md` and `shadow-sm`.
- **Navigation Links:** Indigo for active, Slate for inactive.
- **CTA:** Primary Button "Connect Wallet".

### 3.2 Side Navigation (Student/Admin Portal)
- **Layout:** Fixed left, white background with subtle border-right.
- **Active Item:** Blue background tint with thick indigo border-right.
- **Footer:** Separated section for "Help" and "Logout".

### 3.3 Cards (Glassmorphism Lite)
- **Style:** White background, 1px subtle border (`#E5E7EB`), soft shadow.
- **Hover:** Slight scale up (1.01x) and increased shadow depth.

---

## 4. Struktur Halaman

### 4.1 Landing Page
- **Hero:** Typography-heavy dengan gradien teks biru ke ungu.
- **Stats:** Card horizontal yang menampilkan data agregat.
- **Process:** 3-step guide dengan ikon yang dilingkari.

### 4.2 Student Portal
- **Dashboard:** Fokus pada form input pembayaran di tengah.
- **Uploader:** Area drag-and-drop dengan garis putus-putus biru.
- **History:** List riwayat dengan status badge yang kontras.

### 4.3 Admin Dashboard
- **Metric Cards:** 4 kartu status utama (Total, Pending, Verified, Flagged).
- **Table:** Zebra-striped table dengan aksi "Detail" yang jelas.

### 4.4 Public Verification
- **Search Bar:** Besar dan terpusat di area hero.
- **Results:** Tampilan detail transaksi tunggal dalam card besar.

---

## 5. CSS Variables (Preview)

```css
:root {
  --color-primary: #4f46e5;
  --color-surface: #f8f9ff;
  --color-card: #ffffff;
  --color-text-main: #1f2937;
  --color-text-muted: #6b7280;
  --radius-standard: 12px;
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
}
```

---
*DESIGN.md v1.1 — EduPayChain (Cheerful Edition)*
*Kelompok 2, Sistem Informasi, FTE IT-PLN, 2026*