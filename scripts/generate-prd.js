const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumberElement, PageBreak, LevelFormat,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');
const path = require('path');

const BLUE_DARK   = "1A3A6B";
const BLUE_MID    = "2E6DB4";
const BLUE_LIGHT  = "D6E4F7";
const ACCENT      = "E8A020";
const GRAY_BG     = "F4F6FA";
const GRAY_TEXT   = "555555";
const WHITE       = "FFFFFF";

const border = (color = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color });
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const borders = (color) => ({ top: border(color), bottom: border(color), left: border(color), right: border(color) });
const noBorders = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE_MID, space: 6 } },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: BLUE_DARK })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: BLUE_MID })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: BLUE_DARK })]
  });
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 276 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: options.color || "222222", bold: options.bold || false })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: "333333" })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: "333333" })]
  });
}

function space(before = 100) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [new TextRun("")] });
}

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2500, type: WidthType.DXA },
        borders: borders("DDDDDD"),
        shading: { fill: GRAY_BG, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: BLUE_DARK })] })]
      }),
      new TableCell({
        width: { size: 6860, type: WidthType.DXA },
        borders: borders("DDDDDD"),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: value, font: "Arial", size: 20 })] })]
      })
    ]
  });
}

function headerRow(cols, widths) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((col, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: borders(BLUE_MID),
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: col, font: "Arial", size: 20, bold: true, color: WHITE })]
      })]
    }))
  });
}

function dataRow(cells, widths, shade = false) {
  return new TableRow({
    children: cells.map((cell, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: borders("CCCCCC"),
      shading: { fill: shade ? GRAY_BG : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })]
    }))
  });
}

function featureCard(id, name, priority, desc) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 800, type: WidthType.DXA },
        borders: borders("CCCCCC"),
        shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: id, font: "Arial", size: 18, bold: true, color: BLUE_DARK })] })]
      }),
      new TableCell({
        width: { size: 2400, type: WidthType.DXA },
        borders: borders("CCCCCC"),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: name, font: "Arial", size: 20, bold: true })] })]
      }),
      new TableCell({
        width: { size: 1200, type: WidthType.DXA },
        borders: borders("CCCCCC"),
        shading: {
          fill: priority === "High" ? "FDECEA" : priority === "Medium" ? "FFF8E1" : "E8F5E9",
          type: ShadingType.CLEAR
        },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: priority,
            font: "Arial", size: 18, bold: true,
            color: priority === "High" ? "C62828" : priority === "Medium" ? "E65100" : "2E7D32"
          })]
        })]
      }),
      new TableCell({
        width: { size: 4960, type: WidthType.DXA },
        borders: borders("CCCCCC"),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: desc, font: "Arial", size: 19, color: GRAY_TEXT })] })]
      })
    ]
  });
}

// Cover page
const coverSection = [
  space(1400),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "YAYASAN EDUKASI BANGSA UNGGUL", font: "Arial", size: 28, bold: true, color: BLUE_DARK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400 },
    children: [new TextRun({ text: "Mencerdaskan Bangsa, Membangun Generasi Unggul", font: "Arial", size: 22, italics: true, color: GRAY_TEXT })]
  }),
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [9000],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: border(BLUE_DARK), bottom: border(BLUE_DARK), left: border(BLUE_DARK), right: border(BLUE_DARK) },
            shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
            margins: { top: 400, bottom: 400, left: 300, right: 300 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "PRODUCT REQUIREMENTS DOCUMENT", font: "Arial", size: 36, bold: true, color: WHITE })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120 },
                children: [new TextRun({ text: "Platform Tryout Online Pendidikan", font: "Arial", size: 28, italics: true, color: "A8C8F0" })]
              })
            ]
          })
        ]
      })
    ]
  }),
  space(400),
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [2500, 6500],
    rows: [
      infoRow("Dokumen", "PRD – Platform Tryout Online"),
      infoRow("Versi", "1.0.0"),
      infoRow("Tanggal", "Juni 2025"),
      infoRow("Status", "Draft – Untuk Review"),
      infoRow("Dibuat oleh", "Tim Produk – Yayasan Edukasi Bangsa Unggul"),
      infoRow("Kategori Produk", "Web Application – Edukasi & Ujian Online"),
    ]
  }),
];

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
        ]
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
        ]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE_MID },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [
    // Cover
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        ...coverSection,
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // Content
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE_MID, space: 4 } },
              children: [
                new TextRun({ text: "Yayasan Edukasi Bangsa Unggul  |  PRD Platform Tryout Online", font: "Arial", size: 18, color: GRAY_TEXT }),
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE_MID, space: 4 } },
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: "Versi 1.0  |  Confidential", font: "Arial", size: 17, color: GRAY_TEXT }),
                new TextRun({ text: "\t", font: "Arial", size: 17 }),
                new TextRun({ text: "Hal. ", font: "Arial", size: 17, color: GRAY_TEXT }),
                new PageNumberElement()
              ]
            })
          ]
        })
      },
      children: [

        // 1. RINGKASAN EKSEKUTIF
        h1("1. Ringkasan Eksekutif"),
        para("Dokumen ini merupakan Product Requirements Document (PRD) untuk Platform Tryout Online milik Yayasan Edukasi Bangsa Unggul. Platform ini dirancang sebagai solusi digital terpadu untuk membantu peserta didik mempersiapkan diri menghadapi berbagai ujian kompetitif nasional, meliputi:"),
        space(60),
        bullet("UTBK-SNBT (Ujian Tulis Berbasis Komputer – Seleksi Nasional Berdasarkan Tes)"),
        bullet("CPNS / SKD-SKB (Seleksi Kompetensi Dasar dan Seleksi Kompetensi Bidang)"),
        bullet("Ujian Pendidikan Non-Formal (Paket A, B, C; Sertifikasi Profesi)"),
        bullet("Ujian Kedinasan (IPDN, STAN, Politeknik Ilmu Pelayaran, dll.)"),
        bullet("Ujian Masuk Perguruan Tinggi Swasta dan Ujian Mandiri"),
        space(100),
        para("Platform ini akan menjadi ekosistem belajar dan berlatih yang komprehensif, memadukan teknologi ujian adaptif, analitik performa mendalam, serta konten berkualitas tinggi yang dikurasi oleh tim pengajar berpengalaman."),
        space(200),

        // 2. LATAR BELAKANG & MASALAH
        h1("2. Latar Belakang & Pernyataan Masalah"),
        h2("2.1 Latar Belakang"),
        para("Indonesia memiliki lebih dari 3 juta calon mahasiswa yang mengikuti UTBK setiap tahun, ditambah jutaan pelamar CPNS serta peserta ujian kesetaraan non-formal. Persaingan yang ketat menuntut persiapan yang terstruktur, terukur, dan efisien. Namun mayoritas platform tryout yang ada saat ini masih memiliki keterbatasan signifikan."),
        space(100),

        h2("2.2 Permasalahan yang Diatasi"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 3000, 5960],
          rows: [
            headerRow(["No", "Masalah", "Dampak pada Pengguna"], [400, 3000, 5960]),
            dataRow(["1", "Soal tidak update / tidak sesuai kisi-kisi terbaru", "Persiapan tidak relevan, hasil ujian kurang optimal"], [400, 3000, 5960]),
            dataRow(["2", "Tidak ada analitik performa mendalam", "Peserta tidak tahu kelemahan spesifik untuk diperbaiki"], [400, 3000, 5960], true),
            dataRow(["3", "Antarmuka tidak ramah pengguna / lambat", "Pengalaman belajar tidak menyenangkan, drop-off tinggi"], [400, 3000, 5960]),
            dataRow(["4", "Tidak ada simulasi kondisi ujian nyata", "Peserta tidak terbiasa dengan tekanan waktu dan format ujian"], [400, 3000, 5960], true),
            dataRow(["5", "Konten berserakan, tidak terintegrasi", "Peserta harus berpindah-pindah platform, tidak efisien"], [400, 3000, 5960]),
            dataRow(["6", "Tidak ada pembahasan video / penjelasan mendalam", "Peserta salah paham konsep tanpa bisa dikoreksi"], [400, 3000, 5960], true),
          ]
        }),
        space(200),

        // 3. TUJUAN PRODUK
        h1("3. Tujuan Produk"),
        h2("3.1 Tujuan Bisnis"),
        bullet("Menjadi platform tryout online #1 yang dipercaya di Indonesia dengan target 500.000 pengguna aktif pada tahun pertama"),
        bullet("Mencapai tingkat kepuasan pengguna (NPS) di atas 60 dalam 12 bulan pertama operasional"),
        bullet("Menghasilkan pendapatan berulang (recurring revenue) melalui model langganan premium"),
        bullet("Membangun reputasi Yayasan Edukasi Bangsa Unggul sebagai institusi edukasi digital terkemuka"),
        space(100),

        h2("3.2 Tujuan Produk"),
        bullet("Menyediakan bank soal berkualitas tinggi dengan minimal 50.000 soal tervalidasi pada peluncuran"),
        bullet("Memberikan simulasi ujian yang semirip mungkin dengan kondisi ujian sesungguhnya"),
        bullet("Menghadirkan analitik performa personal yang actionable dan mudah dipahami"),
        bullet("Memfasilitasi jalur belajar yang terstruktur dan adaptif sesuai kebutuhan masing-masing pengguna"),
        bullet("Memastikan aksesibilitas platform di berbagai perangkat dengan performa optimal"),
        space(200),

        // 4. TARGET PENGGUNA
        h1("4. Target Pengguna & Persona"),
        h2("4.1 Segmen Pengguna Utama"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2000, 2500, 2430, 2430],
          rows: [
            headerRow(["Segmen", "Profil", "Kebutuhan Utama", "Pain Point"], [2000, 2500, 2430, 2430]),
            dataRow(["Calon Mahasiswa (SMA/K Kelas 12)", "Usia 17-19 th, native digital, kompetitif", "Latihan UTBK, prediksi skor, analisis kelemahan", "Panik soal baru, tidak tahu benchmark"], [2000, 2500, 2430, 2430]),
            dataRow(["Pencari Kerja Pemerintah", "Usia 20-35 th, beragam latar belakang pendidikan", "Simulasi SKD/SKB, materi TWK/TIU/TKP", "Kuota terbatas, persaingan sangat ketat"], [2000, 2500, 2430, 2430], true),
            dataRow(["Peserta Ujian Non-Formal", "Usia 15-50 th, tidak mengenyam pendidikan formal", "Ujian Paket A/B/C, sertifikasi profesi", "Kurang percaya diri, butuh panduan step-by-step"], [2000, 2500, 2430, 2430]),
            dataRow(["Siswa Ujian Kedinasan", "Usia 18-25 th, target spesifik (IPDN, STAN, dll.)", "Soal khusus per instansi, wawancara simulasi", "Informasi tercecer, tidak ada platform spesifik"], [2000, 2500, 2430, 2430], true),
          ]
        }),
        space(200),

        // 5. FITUR & REQUIREMENTS
        h1("5. Fitur Produk & Functional Requirements"),
        h2("5.1 Ringkasan Fitur"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [800, 2400, 1200, 4960],
          rows: [
            headerRow(["ID", "Fitur", "Prioritas", "Deskripsi"], [800, 2400, 1200, 4960]),
            featureCard("F-01", "Manajemen Akun & Profil", "High", "Registrasi, login (email/SSO Google/Apple), profil belajar, riwayat ujian, pengaturan notifikasi"),
            featureCard("F-02", "Bank Soal & Kurikulum", "High", "Soal terstruktur berdasarkan jenis ujian, mata pelajaran, topik, sub-topik, tingkat kesulitan, dan tahun"),
            featureCard("F-03", "Tryout Simulasi Ujian", "High", "Simulasi penuh sesuai format asli: timer, tata letak, navigasi soal, penanda ragu-ragu"),
            featureCard("F-04", "Tryout Latihan Harian", "High", "Sesi latihan singkat (10-30 soal) berdasarkan topik atau kelemahan teridentifikasi"),
            featureCard("F-05", "Analitik & Laporan Performa", "High", "Dashboard skor, grafik perkembangan, analisis per topik, perbandingan dengan rata-rata pengguna"),
            featureCard("F-06", "Pembahasan & Solusi", "High", "Pembahasan teks per soal, video pembahasan untuk soal sulit, referensi materi terkait"),
            featureCard("F-07", "Manajemen Konten (CMS)", "High", "Panel admin untuk input, edit, validasi soal; manajemen paket tryout; pengaturan jadwal ujian terjadwal"),
            featureCard("F-08", "Notifikasi & Pengingat", "Medium", "Notifikasi ujian terjadwal, reminder latihan harian, update soal baru via email/push notification"),
            featureCard("F-09", "Leaderboard & Gamifikasi", "Medium", "Peringkat nasional dan per wilayah, lencana pencapaian, streak belajar harian"),
            featureCard("F-10", "Paket & Pembayaran", "High", "Manajemen paket langganan (gratis/premium), integrasi payment gateway (Midtrans/Xendit)"),
            featureCard("F-11", "Forum & Diskusi", "Medium", "Ruang tanya jawab per soal, forum per kategori ujian, mentoring dari tutor"),
            featureCard("F-12", "Laporan Institusi", "Low", "Dashboard untuk lembaga/sekolah yang mendaftarkan siswa secara kolektif"),
          ]
        }),
        space(200),

        h2("5.2 Detail Fitur Utama"),

        h3("F-01: Manajemen Akun & Profil"),
        bullet("Registrasi via email dengan verifikasi OTP, atau SSO Google / Apple ID"),
        bullet("Profil mencakup: nama, foto, target ujian, kota asal, sekolah/instansi asal"),
        bullet("Dashboard profil menampilkan: total sesi tryout, rata-rata skor, streak belajar"),
        bullet("Pengaturan privasi: pilihan visibilitas nama di leaderboard"),
        bullet("Fitur lupa password dengan reset via email"),
        space(120),

        h3("F-02: Bank Soal & Kurikulum"),
        bullet("Kategorisasi soal: Jenis Ujian > Mata Pelajaran/Subtes > Topik > Sub-topik"),
        bullet("Metadata tiap soal: tingkat kesulitan (Mudah/Sedang/Sulit), tahun sumber, kisi-kisi terkait"),
        bullet("Format soal yang didukung: pilihan ganda tunggal, pilihan ganda kompleks (HOTS), benar/salah, menjodohkan, isian singkat"),
        bullet("Dukungan soal dengan gambar, tabel, dan rumus matematika (LaTeX/MathJax)"),
        bullet("Validasi soal berlapis: Pembuat -> Reviewer -> Admin final"),
        space(120),

        h3("F-03: Tryout Simulasi Ujian"),
        bullet("Mode Simulasi Penuh: waktu, jumlah soal, dan urutan subtes persis seperti ujian asli"),
        bullet("Timer countdown per sesi/subtes dengan peringatan di 5 dan 1 menit terakhir"),
        bullet("Navigasi soal: panel navigasi grid, tombol tandai soal (flag/bookmark)"),
        bullet("Auto-submit saat waktu habis; konfirmasi sebelum submit manual"),
        bullet("Hasil langsung setelah submit: skor, persentil, breakdown per subtes"),
        bullet("Mode Tryout Terjadwal: ujian diadakan pada waktu tertentu layaknya ujian nasional"),
        space(120),

        h3("F-04: Latihan Harian"),
        bullet("Mode Smart Practice: sistem merekomendasikan topik berdasarkan kelemahan dari riwayat"),
        bullet("Mode Free Practice: pengguna pilih sendiri kategori, jumlah soal, dan tingkat kesulitan"),
        bullet("Mode Maraton: latihan soal tanpa batas waktu untuk fokus pemahaman konsep"),
        bullet("Mode Sprint: latihan cepat berbatas waktu untuk melatih kecepatan"),
        space(120),

        h3("F-05: Analitik & Laporan Performa"),
        bullet("Grafik perkembangan skor dari waktu ke waktu per jenis ujian"),
        bullet("Heatmap kekuatan dan kelemahan per topik"),
        bullet("Estimasi skor ujian nyata berdasarkan performa tryout (prediktif)"),
        bullet("Persentil dibandingkan semua pengguna platform yang mengerjakan paket yang sama"),
        bullet("Waktu rata-rata per soal vs. benchmark platform"),
        bullet("Ekspor laporan dalam format PDF"),
        space(200),

        // 6. NON-FUNCTIONAL REQUIREMENTS
        h1("6. Non-Functional Requirements"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2200, 3800, 3360],
          rows: [
            headerRow(["Kategori", "Requirement", "Target / Kriteria Penerimaan"], [2200, 3800, 3360]),
            dataRow(["Performa", "Waktu muat halaman utama", "< 2 detik pada koneksi 4G"], [2200, 3800, 3360]),
            dataRow(["Performa", "Waktu muat soal (dengan gambar)", "< 3 detik"], [2200, 3800, 3360], true),
            dataRow(["Ketersediaan", "Uptime sistem", ">= 99.5% per bulan"], [2200, 3800, 3360]),
            dataRow(["Ketersediaan", "Maintenance window", "Hanya di luar jam puncak (02.00-05.00 WIB)"], [2200, 3800, 3360], true),
            dataRow(["Skalabilitas", "Concurrent users saat tryout massal", "Mampu menangani 50.000 pengguna bersamaan"], [2200, 3800, 3360]),
            dataRow(["Keamanan", "Autentikasi", "JWT + Refresh Token, HTTPS wajib"], [2200, 3800, 3360], true),
            dataRow(["Keamanan", "Enkripsi data sensitif", "AES-256 untuk data PII dan riwayat ujian"], [2200, 3800, 3360]),
            dataRow(["Keamanan", "Anti-kecurangan dasar", "Disable copy-paste, deteksi tab switching saat ujian"], [2200, 3800, 3360], true),
            dataRow(["Aksesibilitas", "Browser support", "Chrome 90+, Firefox 88+, Safari 14+, Edge 90+"], [2200, 3800, 3360]),
            dataRow(["Aksesibilitas", "Responsivitas", "Optimal di desktop, tablet, dan mobile (min. 320px)"], [2200, 3800, 3360], true),
            dataRow(["Kepatuhan Data", "Regulasi", "Patuh UU PDP (Perlindungan Data Pribadi) Indonesia"], [2200, 3800, 3360]),
          ]
        }),
        space(200),

        // 7. ARSITEKTUR SISTEM
        h1("7. Arsitektur Sistem (High-Level)"),
        h2("7.1 Stack Teknologi yang Direkomendasikan"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2000, 3680, 3680],
          rows: [
            headerRow(["Layer", "Teknologi", "Alasan Pemilihan"], [2000, 3680, 3680]),
            dataRow(["Frontend Web", "Next.js 14 (React) + TypeScript", "SSR/SSG untuk SEO, performa optimal, ekosistem luas"], [2000, 3680, 3680]),
            dataRow(["Mobile App", "React Native (iOS & Android)", "Code sharing dengan web, komunitas besar"], [2000, 3680, 3680], true),
            dataRow(["Backend API", "Node.js (Fastify) + TypeScript", "Performa tinggi, non-blocking I/O untuk concurrent users"], [2000, 3680, 3680]),
            dataRow(["Database Utama", "PostgreSQL", "Relasional, ACID-compliant, JSON support untuk soal"], [2000, 3680, 3680], true),
            dataRow(["Cache & Session", "Redis", "Sesi ujian, leaderboard real-time, rate limiting"], [2000, 3680, 3680]),
            dataRow(["Storage Media", "AWS S3 / GCS + CDN", "Gambar soal, video pembahasan, CDN untuk latensi rendah"], [2000, 3680, 3680], true),
            dataRow(["Search Engine", "Elasticsearch", "Pencarian soal cepat, filter multi-dimensi"], [2000, 3680, 3680]),
            dataRow(["Hosting", "AWS / GCP (Auto-scaling)", "Elastisitas untuk traffic puncak tryout massal"], [2000, 3680, 3680], true),
            dataRow(["Payment", "Midtrans + Xendit", "Mendukung semua metode pembayaran lokal Indonesia"], [2000, 3680, 3680]),
          ]
        }),
        space(200),

        // 8. MODEL BISNIS
        h1("8. Model Bisnis & Paket Layanan"),
        h2("8.1 Struktur Paket"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1800, 1800, 1920, 1920, 1920],
          rows: [
            headerRow(["Fitur", "Gratis", "Basic (Rp 49.000/bln)", "Premium (Rp 99.000/bln)", "Institusi (Custom)"], [1800, 1800, 1920, 1920, 1920]),
            dataRow(["Tryout Gratis Terbatas", "3x/bln", "Unlimited", "Unlimited", "Unlimited"], [1800, 1800, 1920, 1920, 1920]),
            dataRow(["Bank Soal Latihan", "Terbatas (500 soal)", "10.000 soal", "50.000+ soal", "50.000+ soal"], [1800, 1800, 1920, 1920, 1920], true),
            dataRow(["Pembahasan Video", "Tidak", "Tidak", "Ya", "Ya"], [1800, 1800, 1920, 1920, 1920]),
            dataRow(["Analitik Mendalam", "Dasar", "Dasar", "Lengkap + Prediksi", "Lengkap + Laporan Grup"], [1800, 1800, 1920, 1920, 1920], true),
            dataRow(["Tryout Terjadwal", "Tidak", "Ya", "Ya (prioritas)", "Ya (Private)"], [1800, 1800, 1920, 1920, 1920]),
            dataRow(["Forum & Diskusi", "Tidak", "Ya", "Ya + Mentoring", "Ya"], [1800, 1800, 1920, 1920, 1920], true),
            dataRow(["Ekspor Laporan PDF", "Tidak", "Tidak", "Ya", "Ya (Bulk)"], [1800, 1800, 1920, 1920, 1920]),
            dataRow(["Support", "FAQ saja", "Email", "Priority Email + Chat", "Dedicated AM"], [1800, 1800, 1920, 1920, 1920], true),
          ]
        }),
        space(200),

        // 9. USER JOURNEY
        h1("9. User Journey Utama"),
        h2("9.1 Journey: Calon Mahasiswa (UTBK)"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [600, 2800, 2980, 2980],
          rows: [
            headerRow(["#", "Tahap", "Aksi Pengguna", "Respons Sistem"], [600, 2800, 2980, 2980]),
            dataRow(["1", "Penemuan & Registrasi", "Menemukan platform via iklan/rekomendasi, mendaftar akun gratis", "Kirim email verifikasi OTP, redirect ke onboarding wizard"], [600, 2800, 2980, 2980]),
            dataRow(["2", "Onboarding", "Pilih target ujian (UTBK), tentukan universitas & prodi impian", "Set up profil belajar, tampilkan roadmap yang dipersonalisasi"], [600, 2800, 2980, 2980], true),
            dataRow(["3", "Diagnostic Test", "Kerjakan tes diagnostik awal 40 soal", "Identifikasi level awal dan kelemahan, generate rekomendasi belajar"], [600, 2800, 2980, 2980]),
            dataRow(["4", "Latihan Harian", "Kerjakan latihan topik yang direkomendasikan 30 menit/hari", "Update progress, beri poin dan streak, rekomendasikan topik berikutnya"], [600, 2800, 2980, 2980], true),
            dataRow(["5", "Tryout Mingguan", "Ikut tryout simulasi penuh UTBK setiap minggu", "Hitung skor, tampilkan persentil, analisis mendalam per subtes"], [600, 2800, 2980, 2980]),
            dataRow(["6", "Review & Perbaikan", "Baca pembahasan soal yang salah, tonton video penjelasan", "Track soal yang sudah dipahami, remove dari rekomendasi"], [600, 2800, 2980, 2980], true),
            dataRow(["7", "Upgrade Premium", "Tertarik fitur analitik mendalam, upgrade ke Premium", "Aktifkan akses penuh, kirim email konfirmasi & panduan fitur baru"], [600, 2800, 2980, 2980]),
          ]
        }),
        space(200),

        // 10. ROADMAP
        h1("10. Roadmap Pengembangan"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1800, 2000, 5560],
          rows: [
            headerRow(["Fase", "Timeline", "Deliverable"], [1800, 2000, 5560]),
            dataRow(["Fase 0 - Discovery", "Bulan 1-2", "Research pengguna, competitive analysis, validasi konsep, wireframe low-fidelity"], [1800, 2000, 5560]),
            dataRow(["Fase 1 - MVP", "Bulan 3-5", "Registrasi/login, bank soal 5.000 soal (UTBK), tryout dasar, hasil skor, CMS admin dasar"], [1800, 2000, 5560], true),
            dataRow(["Fase 2 - Core", "Bulan 6-8", "Analitik performa, pembahasan teks, paket langganan, payment gateway, notifikasi email"], [1800, 2000, 5560]),
            dataRow(["Fase 3 - Growth", "Bulan 9-11", "Soal CPNS & Non-Formal, video pembahasan, leaderboard, gamifikasi, tryout terjadwal"], [1800, 2000, 5560], true),
            dataRow(["Fase 4 - Scale", "Bulan 12-14", "Mobile app (React Native), fitur institusi, AI-powered recommendation, ekspansi soal kedinasan"], [1800, 2000, 5560]),
            dataRow(["Fase 5 - Optimize", "Bulan 15+", "Adaptive learning engine, marketplace pembuat soal, API untuk mitra institusi"], [1800, 2000, 5560], true),
          ]
        }),
        space(200),

        // 11. KPI & SUCCESS METRICS
        h1("11. KPI & Metrik Keberhasilan"),
        h2("11.1 Metrik Produk"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3000, 2200, 2080, 2080],
          rows: [
            headerRow(["Metrik", "Baseline (M3)", "Target M6", "Target M12"], [3000, 2200, 2080, 2080]),
            dataRow(["Monthly Active Users (MAU)", "5.000", "50.000", "500.000"], [3000, 2200, 2080, 2080]),
            dataRow(["Rata-rata sesi/pengguna/minggu", "2 sesi", "4 sesi", "5 sesi"], [3000, 2200, 2080, 2080], true),
            dataRow(["Free-to-Paid Conversion Rate", "-", "3%", "8%"], [3000, 2200, 2080, 2080]),
            dataRow(["Churn Rate Bulanan (Premium)", "-", "< 10%", "< 5%"], [3000, 2200, 2080, 2080], true),
            dataRow(["Net Promoter Score (NPS)", "-", "> 40", "> 60"], [3000, 2200, 2080, 2080]),
            dataRow(["Completion Rate Tryout Penuh", "-", "> 70%", "> 80%"], [3000, 2200, 2080, 2080], true),
            dataRow(["Jumlah Soal Tervalidasi", "5.000", "20.000", "50.000"], [3000, 2200, 2080, 2080]),
            dataRow(["App Store Rating", "-", ">= 4.2", ">= 4.5"], [3000, 2200, 2080, 2080], true),
          ]
        }),
        space(200),

        // 12. RISIKO
        h1("12. Risiko & Mitigasi"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 1400, 1400, 3760],
          rows: [
            headerRow(["Risiko", "Probabilitas", "Dampak", "Strategi Mitigasi"], [2800, 1400, 1400, 3760]),
            dataRow(["Perubahan format ujian oleh pemerintah (BSNP/BKN)", "Tinggi", "Tinggi", "Tim konten dedicated memantau regulasi; update soal dalam 7 hari kerja"], [2800, 1400, 1400, 3760]),
            dataRow(["Server down saat tryout massal", "Sedang", "Sangat Tinggi", "Auto-scaling cloud, load testing berkala, disaster recovery plan, SLA 99.5%"], [2800, 1400, 1400, 3760], true),
            dataRow(["Kebocoran soal ujian asli ke platform", "Rendah", "Tinggi", "Audit konten berkala, kebijakan zero-tolerance, mekanisme pelaporan"], [2800, 1400, 1400, 3760]),
            dataRow(["Persaingan dari pemain besar (Ruangguru, Zenius, dll.)", "Tinggi", "Sedang", "Diferensiasi pada kedalaman analitik, kemitraan yayasan, harga kompetitif"], [2800, 1400, 1400, 3760], true),
            dataRow(["Kualitas soal tidak konsisten dari kontributor", "Sedang", "Tinggi", "Proses validasi berlapis, rubrik penilaian soal, incentive untuk reviewer"], [2800, 1400, 1400, 3760]),
            dataRow(["Rendahnya literasi digital target pengguna non-formal", "Sedang", "Sedang", "Onboarding interaktif, tutorial video, dukungan via WhatsApp"], [2800, 1400, 1400, 3760], true),
          ]
        }),
        space(200),

        // 13. ASUMSI & KETERGANTUNGAN
        h1("13. Asumsi & Ketergantungan"),
        h2("13.1 Asumsi"),
        numbered("Tim konten tersedia untuk mengisi bank soal minimal 5.000 soal sebelum soft launch"),
        numbered("Infrastruktur cloud tersedia dan dapat di-scale-up sesuai kebutuhan"),
        numbered("Pengguna memiliki akses internet minimal 3G stabil untuk mengakses platform"),
        numbered("Regulasi pemerintah terkait ujian nasional tidak berubah secara drastis dalam 12 bulan pertama"),
        numbered("Mitra payment gateway (Midtrans/Xendit) mampu menangani volume transaksi yang diproyeksikan"),
        space(100),

        h2("13.2 Ketergantungan Eksternal"),
        bullet("Kisi-kisi resmi UTBK dari SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru)"),
        bullet("Silabus SKD/SKB terbaru dari BKN (Badan Kepegawaian Negara)"),
        bullet("API payment gateway: Midtrans dan/atau Xendit"),
        bullet("Layanan cloud provider (AWS / GCP) untuk hosting dan storage"),
        bullet("MathJax atau KaTeX library untuk rendering rumus matematika"),
        space(200),

        // 14. GLOSSARY
        h1("14. Glosarium"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2500, 6860],
          rows: [
            headerRow(["Istilah", "Definisi"], [2500, 6860]),
            dataRow(["UTBK", "Ujian Tulis Berbasis Komputer - tes masuk perguruan tinggi negeri"], [2500, 6860]),
            dataRow(["SNBT", "Seleksi Nasional Berdasarkan Tes - jalur seleksi PTN berbasis nilai UTBK"], [2500, 6860], true),
            dataRow(["CPNS", "Calon Pegawai Negeri Sipil - pelamar jabatan di lingkungan pemerintahan"], [2500, 6860]),
            dataRow(["SKD", "Seleksi Kompetensi Dasar - ujian awal CPNS (TWK, TIU, TKP)"], [2500, 6860], true),
            dataRow(["SKB", "Seleksi Kompetensi Bidang - ujian lanjutan CPNS sesuai jabatan"], [2500, 6860]),
            dataRow(["Paket A/B/C", "Program pendidikan kesetaraan setara SD/SMP/SMA untuk non-formal"], [2500, 6860], true),
            dataRow(["MAU", "Monthly Active Users - jumlah pengguna unik yang aktif dalam sebulan"], [2500, 6860]),
            dataRow(["NPS", "Net Promoter Score - metrik kepuasan dan loyalitas pengguna"], [2500, 6860], true),
            dataRow(["SSO", "Single Sign-On - login sekali untuk akses banyak layanan (contoh: Google)"], [2500, 6860]),
            dataRow(["PRD", "Product Requirements Document - dokumen spesifikasi kebutuhan produk ini"], [2500, 6860], true),
          ]
        }),
        space(300),

        // PENUTUP
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE_MID, space: 8 } },
          spacing: { before: 400, after: 120 },
          children: [new TextRun({ text: "Dokumen ini bersifat CONFIDENTIAL dan hanya untuk keperluan internal", font: "Arial", size: 19, italics: true, color: GRAY_TEXT })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Yayasan Edukasi Bangsa Unggul  |  Platform Tryout Online  |  PRD v1.0  |  2025", font: "Arial", size: 18, color: BLUE_DARK })]
        }),
      ]
    }
  ]
});

// Output ke folder proyek
const outputPath = path.join(__dirname, '..', '..', 'PRD_Platform_Tryout_Bangsa_Unggul.docx');

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputPath, buf);
  console.log("✅ Dokumen berhasil dibuat!");
  console.log("📄 File tersimpan di: " + outputPath);
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
