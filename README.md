# 🏭 QC Poisson Analytics Dashboard

Aplikasi berbasis web untuk **Quality Control (QC)** di manufaktur. Aplikasi ini mencatat data produksi harian dan menggunakan **Distribusi Poisson** untuk memprediksi probabilitas barang cacat pada batch produksi berikutnya.

Dirancang untuk Supervisor QC agar dapat mengambil keputusan berbasis data dengan tampilan visual yang mudah dipahami.

## ✨ Fitur Utama

* **Pencatatan Data Produksi:** Input tanggal, jumlah produksi, dan jumlah barang cacat.
* **Analisis Otomatis:** Menghitung rata-rata cacat ($\lambda$) secara real-time berdasarkan riwayat data.
* **Prediksi Poisson:** Menghitung peluang jumlah cacat (0, 1, 2, dst) untuk batch selanjutnya.
* **Indikator Visual Cerdas:**
    * 🟢 **Hijau (Aman):** Peluang *Zero Defect* (0 cacat) tinggi (>50%).
    * 🔴 **Merah (Bahaya):** Risiko cacat tinggi (>20%).
* **Manajemen Data (CRUD):** Fitur Edit dan Hapus data riwayat jika ada kesalahan input.
* **Data Seeding:** Fitur reset data dummy untuk keperluan testing/demo.

## 🛠️ Teknologi yang Digunakan

* **Backend:** Node.js, Express.js
* **Database:** SQLite (via Sequelize ORM)
* **Frontend:** EJS (Templating Engine), CSS Native
* **Math:** Statistik Distribusi Poisson

## 🚀 Cara Install & Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan aplikasi di komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username-anda/qc-poisson-dashboard.git](https://github.com/username-anda/qc-poisson-dashboard.git)
    cd qc-poisson-dashboard
    ```

2.  **Install Dependencies**
    Pastikan Node.js sudah terinstall, lalu jalankan:
    ```bash
    npm install
    ```

3.  **Jalankan Server**
    ```bash
    node server.js
    ```

4.  **Buka di Browser**
    Akses alamat berikut di browser Anda:
    `http://localhost:3000`

---

## 📖 Cara Penggunaan (User Guide)

### 1. Membaca Dashboard Utama
Dashboard terbagi menjadi dua panel untuk setiap produk:

* **Kiri (Riwayat Input):** Menampilkan log data produksi harian. Anda bisa melihat tren apakah cacat sering terjadi atau jarang.
* **Kanan (Prediksi Peluang):** "Bola kristal" statistik. Tabel ini memberitahu Anda probabilitas kejadian di masa depan.

### 2. Membaca Warna Indikator
Kami menggunakan psikologi warna agar mudah dipahami sekilas:

| Kolom | Warna | Arti | Tindakan |
| :--- | :--- | :--- | :--- |
| **0 Cacat** | 🟢 **HIJAU** | Peluang > 50% | **Aman.** Mesin berjalan sangat baik. Produksi lancar. |
| **1+ Cacat** | 🔴 **MERAH** | Peluang > 20% | **Waspada.** Risiko cacat tinggi. Siapkan tim perbaikan (rework). |
| **Angka Biasa** | ⚫ Hitam | Peluang Kecil | Kejadian yang jarang terjadi. |

### 3. Mengelola Data (Input/Edit/Hapus)
* **Input Baru:** Klik tombol biru **"📝 + Input Data Manual"** di atas untuk memasukkan laporan produksi hari ini.
* **Edit Data:** Jika salah input angka, klik ikon **Pensil (✏️)** pada tabel riwayat.
* **Hapus Data:** Jika data duplikat atau tidak valid, klik ikon **Sampah (🗑️)**.

### 4. Reset Data (Demo)
Gunakan tombol abu-abu **"🔄 Reset Data Dummy"** jika ingin mengembalikan aplikasi ke kondisi awal dengan data contoh.

---

## 🧮 Penjelasan Logika (Distribusi Poisson)

Aplikasi ini menggunakan rumus probabilitas Poisson:

$$P(x; \lambda) = \frac{e^{-\lambda} \lambda^x}{x!}$$

Dimana:
* **$\lambda$ (Lambda):** Rata-rata jumlah cacat per batch (dihitung dari total cacat dibagi total kejadian produksi).
* **$x$:** Jumlah cacat yang ingin diprediksi peluangnya (0, 1, 2, dst).
* **$P(x)$:** Persentase kemungkinan kejadian tersebut terjadi.

---

## 📂 Struktur Folder
├── views/              # File tampilan frontend (EJS)
│   ├── index.ejs       # Dashboard utama
│   ├── input.ejs       # Form input
│   └── edit.ejs        # Form edit
├── server.js           # Kode utama backend & logika Poisson
├── database.sqlite     # File database (dibuat otomatis)
├── package.json        # Daftar library/dependencies
└── README.md           # Dokumentasi ini