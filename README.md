# Sistem Informasi Rumah Sakit Sederhana

## Overview

Sistem Informasi Rumah Sakit sederhana berbasis **Next.js** yang digunakan untuk mencatat pendaftaran pasien, kunjungan pasien, serta menyimpan riwayat rekam medis pasien.

Sistem ini memiliki 3 role pengguna:

* **Admin**
* **Pendaftaran**
* **Dokter**

---

## Fitur dan Hak Akses

### Admin

Admin memiliki akses penuh terhadap data sistem, yaitu:

* Manajemen User (CRUD)
* Manajemen Pasien (CRUD)
* Manajemen Kunjungan Pasien (CRUD)
* Melihat dan mengelola data yang tersedia di dalam sistem

### Pendaftaran

Role Pendaftaran memiliki akses untuk:

* Menambahkan pasien baru
* Menambahkan kunjungan pasien
* Mengedit data pasien
* Melihat riwayat kunjungan yang didaftarkan olehnya

### Dokter

Role Dokter memiliki akses untuk:

* Melihat kunjungan pasien yang ditujukan kepada dirinya
* Menambahkan rekam medis pasien
* Melihat riwayat rekam medis pasien

---

# Menjalankan Project di Local

## 1. Prasyarat

Pastikan beberapa aplikasi berikut sudah terinstall di komputer:

* **Node.js**
* **npm**
* **MySQL**
* **Git**

Untuk memastikan Node.js dan npm sudah tersedia, jalankan:

```bash
node -v
npm -v
```

Kemudian pastikan MySQL sudah berjalan.

---

## 2. Clone Repository

Clone repository project ke komputer lokal:

```bash
git clone <URL_REPOSITORY>
```

Masuk ke folder project:

```bash
cd <NAMA_PROJECT>
```

---

## 3. Buat Database di Local

Buat database baru pada MySQL.

Contoh:

```sql
CREATE DATABASE rumah_sakit;
```

Nama database dapat disesuaikan dengan konfigurasi yang digunakan pada file `.env`.

---

## 4. Install Dependency

Jalankan perintah berikut pada folder project:

```bash
npm install
```

Perintah ini digunakan untuk menginstall seluruh dependency yang dibutuhkan oleh project.

---

## 5. Konfigurasi Environment Variable

Buat atau ubah file `.env` pada root project.

Sesuaikan konfigurasi database dan JWT dengan database lokal yang telah dibuat.

Contoh:

```env
DATABASE_URL="mysql://root:@localhost:3306/rumah_sakit"

DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_NAME="rumah_sakit"

JWT_SECRET="your-secret-key"
```

Sesuaikan nilai berikut dengan konfigurasi MySQL pada komputer masing-masing:

* `DATABASE_URL`
* `DATABASE_HOST`
* `DATABASE_PORT`
* `DATABASE_USER`
* `DATABASE_PASSWORD`
* `DATABASE_NAME`
* `JWT_SECRET`

> **Catatan:** Jangan membagikan file `.env` ke repository public karena dapat berisi informasi sensitif seperti password database dan JWT secret.

---

## 6. Generate Prisma Client

Setelah konfigurasi `.env` selesai, jalankan:

```bash
npx prisma generate
```

Perintah ini digunakan untuk membuat Prisma Client berdasarkan schema Prisma yang digunakan oleh project.

---

## 7. Jalankan Prisma Migration

Jalankan migration database:

```bash
npx prisma migrate dev
```

Perintah ini akan membuat atau memperbarui struktur tabel database berdasarkan `schema.prisma`.

Jika Prisma meminta nama migration, masukkan nama migration sesuai kebutuhan, contoh:

```text
init
```

---

## 8. Jalankan Database Seeder

Setelah migration selesai, jalankan:

```bash
npx prisma db seed
```

Seeder digunakan untuk memasukkan data awal yang dibutuhkan oleh sistem, seperti data user atau data lainnya.

---

## 9. Jalankan Project

Setelah seluruh konfigurasi selesai, jalankan development server:

```bash
npm run dev
```

Jika berhasil, project biasanya dapat diakses melalui:

```text
http://localhost:3000
```

Buka alamat tersebut menggunakan browser.

---

# Urutan Singkat Menjalankan Project

Jika seluruh prasyarat dan konfigurasi sudah tersedia, urutannya adalah:

```bash
# Install dependency
npm install

# Generate Prisma Client
npx prisma generate

# Migration database
npx prisma migrate dev

# Seed database
npx prisma db seed

# Jalankan development server
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```
