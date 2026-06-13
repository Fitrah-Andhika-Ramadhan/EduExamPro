import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { tests, questions, options, testQuestions, settings, user } from '../lib/db/schema'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is missing')
  process.exit(1)
}

const client = postgres(connectionString, { prepare: false, max: 1 })
const db = drizzle(client)

async function seed() {
  console.log('🌱 Memulai proses seeding Supabase...')

  // 1. Dapatkan atau buat user admin untuk memiliki paket ini
  let adminUsers = await db.select().from(user).limit(1)
  let adminId = ''

  if (adminUsers.length === 0) {
    console.log('Tidak ada akun user ditemukan. Membuat akun admin default...')
    // Untuk menyederhanakan, seed script hanya butuh ID.
    // Jika auth system belum terdaftar, kita bisa bikin row user manual.
    // Tetapi lebih aman mengambil user pertama.
    const newUser = await db.insert(user).values({
      id: 'admin-seed-id-123',
      name: 'Admin System',
      email: 'admin@eduexam.pro',
      role: 'admin',
      plan: 'pro'
    }).returning()
    adminId = newUser[0].id
  } else {
    adminId = adminUsers[0].id
    console.log(`Menggunakan akun yang sudah ada (ID: ${adminId}) sebagai pemilik konten.`)
  }

  // 2. Data Tryout dan Pertanyaan
  // Helper to generate dummy questions
  const generateQuestions = (baseQuestions: any[], totalNeeded: number, category: string) => {
    const result = [...baseQuestions]
    for (let i = baseQuestions.length; i < totalNeeded; i++) {
      result.push({
        text: `<p><b>[${category} - Latihan Soal Ke-${i + 1}]</b><br/><br/>Ini adalah contoh simulasi soal ke-${i + 1}. Manakah dari pernyataan berikut yang paling tepat menggambarkan prinsip utama dari materi ini?</p>`,
        options: [
          { text: `Pernyataan A sangat tepat dan komprehensif`, isCorrect: true },
          { text: `Pernyataan B hanya mencakup sebagian kecil`, isCorrect: false },
          { text: `Pernyataan C tidak relevan sama sekali`, isCorrect: false },
          { text: `Pernyataan D menyimpang dari konteks utama`, isCorrect: false }
        ]
      })
    }
    return result
  }

  const testsData = [
    {
      title: 'SKD CPNS 2025 — Simulasi Lengkap CAT',
      description: 'Simulasi ujian SKD paling mirip aslinya: TWK + TIU + TKP dalam 100 menit. Sistem penilaian mengikuti standar BKN terbaru.',
      durationMinutes: 100,
      passingScore: 311,
      categoryId: 1,
      price: 99000,
      originalPrice: 159000,
      isPublished: true,
      questions: generateQuestions([
        {
          text: '<p><b>[TWK - Nasionalisme]</b><br/><br/>Perwujudan sila ke-3 Pancasila (Persatuan Indonesia) dalam kehidupan global saat ini yang paling relevan adalah...</p>',
          options: [
            { text: 'Menolak segala bentuk budaya asing yang masuk ke Indonesia.', isCorrect: false },
            { text: 'Menggunakan produk dalam negeri dan mempromosikannya ke kancah internasional.', isCorrect: true },
            { text: 'Menganggap bangsa Indonesia lebih unggul dari bangsa lain secara mutlak.', isCorrect: false },
            { text: 'Hanya mau berteman dengan sesama warga negara Indonesia di luar negeri.', isCorrect: false }
          ]
        }
      ], 110, 'SKD CPNS 2025')
    },
    {
      title: 'PPPK Guru 2025 — Paket Intensif',
      description: 'Latihan soal kompetensi teknis, pedagogik, dan manajerial khusus formasi Guru. Update kisi-kisi resmi 2025.',
      durationMinutes: 120,
      passingScore: 280,
      categoryId: 1,
      price: 129000,
      originalPrice: 249000,
      isPublished: true,
      questions: generateQuestions([
        {
          text: '<p><b>[Kompetensi Teknis Pedagogik]</b><br/><br/>Dalam menyusun RPP berdasarkan Kurikulum Merdeka, seorang guru harus menetapkan Tujuan Pembelajaran (TP) yang diturunkan dari...</p>',
          options: [
            { text: 'Silabus Nasional yang diterbitkan Kementerian.', isCorrect: false },
            { text: 'Capaian Pembelajaran (CP) yang dianalisis sesuai karakteristik peserta didik.', isCorrect: true },
            { text: 'Buku teks utama pelajaran.', isCorrect: false },
            { text: 'Instruksi langsung dari Kepala Sekolah.', isCorrect: false }
          ]
        }
      ], 145, 'PPPK Guru 2025')
    },
    {
      title: 'BUMN 2025 — Tes Core Values AKHLAK',
      description: 'Siapkan dirimu menghadapi Rekrutmen Bersama BUMN. Tryout berfokus pada TKD dan Core Values AKHLAK.',
      durationMinutes: 90,
      passingScore: 65,
      categoryId: 1,
      price: 79000,
      originalPrice: 149000,
      isPublished: true,
      questions: generateQuestions([
        {
          text: '<p><b>[AKHLAK - Adaptif]</b><br/><br/>Perusahaan Anda baru saja menerapkan sistem ERP baru yang cukup rumit. Anda terbiasa dengan sistem lama yang jauh lebih simpel. Sikap yang paling mencerminkan nilai Adaptif adalah...</p>',
          options: [
            { text: 'Menolak menggunakan sistem baru dan tetap pada metode manual.', isCorrect: false },
            { text: 'Mengkritik sistem baru di grup WhatsApp divisi.', isCorrect: false },
            { text: 'Proaktif mengikuti pelatihan ERP dan mencoba mencari panduan tambahan agar cepat mahir.', isCorrect: true },
            { text: 'Menunggu rekan lain mengajari Anda cara menggunakannya.', isCorrect: false }
          ]
        }
      ], 90, 'BUMN AKHLAK')
    },
    {
      title: 'Tryout Nasional — UTBK SNBT 2025',
      description: 'Latihan intensif TPS dan TKA Saintek untuk pejuang PTN.',
      durationMinutes: 195,
      passingScore: 0,
      categoryId: 1,
      price: 49000,
      originalPrice: 99000,
      isPublished: true,
      questions: generateQuestions([
        {
          text: '<p><b>[TPS - Penalaran Umum]</b><br/><br/>Sebuah studi nasional 2024 menunjukkan bahwa peningkatan konsumsi vitamin D berbanding lurus dengan penurunan risiko depresi musiman. Simpulan yang MUNGKIN BENAR adalah...</p>',
          options: [
            { text: 'Vitamin D adalah obat pasti untuk depresi.', isCorrect: false },
            { text: 'Orang yang kekurangan vitamin D pasti akan mengalami depresi.', isCorrect: false },
            { text: 'Suplemen vitamin D dapat menjadi salah satu upaya mitigasi pencegahan depresi musiman.', isCorrect: true },
            { text: 'Tidak ada hubungannya antara nutrisi dan kesehatan mental.', isCorrect: false }
          ]
        }
      ], 145, 'UTBK SNBT 2025')
    }
  ]

  console.log('Menyisipkan ujian simulasi ke tabel tests...')
  for (const t of testsData) {
    const [insertedTest] = await db.insert(tests).values({
      title: t.title,
      description: t.description,
      durationMinutes: t.durationMinutes,
      passingScore: t.passingScore,
      categoryId: 1, // Default fallback
      price: t.price,
      originalPrice: t.originalPrice,
      isPublished: t.isPublished,
      userId: adminId
    }).returning()

    for (let i = 0; i < t.questions.length; i++) {
      const q = t.questions[i]
      const [insertedQuestion] = await db.insert(questions).values({
        categoryId: 1,
        type: 'multiple-choice',
        questionText: q.text,
        userId: adminId
      }).returning()

      // Insert options
      for (let j = 0; j < q.options.length; j++) {
        const o = q.options[j]
        await db.insert(options).values({
          questionId: insertedQuestion.id,
          optionText: o.text,
          isCorrect: o.isCorrect,
          orderIndex: j
        })
      }

      // Link question to test
      await db.insert(testQuestions).values({
        testId: insertedTest.id,
        questionId: insertedQuestion.id,
        orderIndex: i
      })
    }
    console.log(`✓ Ujian disisipkan: ${t.title} (ID: ${insertedTest.id})`)
  }

  // 3. Data Kursus dengan Konten Materi Dinamis (Disimpan sebagai JSON di `settings`)
  const coursesData = [
    {
      id: 101,
      title: 'Masterclass TIU — Penalaran & Logika',
      description: 'Kuasai semua tipe soal Tes Intelegensia Umum: numerik, verbal, figural, dan silogisme. Dilengkapi 200+ soal latihan dengan pembahasan mendalam.',
      icon: '🧠',
      gradient: 'from-indigo-600 to-blue-700',
      features: ['Lebih dari 200 soal latihan', 'Video pembahasan tiap bab', 'Modul PDF siap cetak', 'Akses seumur hidup'],
      topics: [
        { 
          title: 'Konsep Dasar TIU Numerik & Analitik (Update 2025)', 
          type: 'doc', 
          duration: '12 menit',
          content: '<h2 class="text-2xl font-bold text-gray-900 mb-4">1. Konsep Dasar TIU Numerik & Analitik (Update 2025)</h2><p class="mb-6">Sesuai dengan keputusan Kemenpan RB terbaru, bobot soal TIU pada SKD difokuskan tidak hanya pada kecepatan berhitung, tetapi <b>kemampuan analisis logis</b> dalam memecahkan masalah.</p><div class="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6"><h3 class="text-lg font-bold text-blue-900 mb-2">Trik Cepat Silogisme</h3><ul class="list-disc pl-5 space-y-2 text-blue-800"><li>Gunakan diagram Venn untuk mengurai premis universal (Semua) dan partikular (Beberapa).</li><li>Aturan Emas: Jika premis pertama "Semua" dan premis kedua "Beberapa", maka kesimpulan HARUS "Beberapa".</li></ul></div>'
        },
        { title: 'Aritmatika & Barisan Bilangan', type: 'video', duration: '25 menit' }
      ]
    },
    {
      id: 102,
      title: 'Masterclass TWK — Kebangsaan & UUD 1945',
      description: 'Pahami Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, dan sejarah Indonesia secara sistematis.',
      icon: '🇮🇩',
      gradient: 'from-emerald-600 to-teal-700',
      features: ['150+ soal TWK terbaru', 'Rangkuman Pancasila & UUD', 'Infografis mudah dipahami', 'Update materi berkala'],
      topics: [
        { 
          title: 'Pendekatan Baru TWK: Studi Kasus', 
          type: 'doc', 
          duration: '15 menit baca',
          content: '<h2 class="text-2xl font-bold text-gray-900 mb-4">1. Pendekatan Baru TWK: Studi Kasus</h2><p class="mb-6">Tahun ini, BKN menekankan soal TWK (Tes Wawasan Kebangsaan) bukan lagi hafalan pasal UUD 1945 murni, melainkan <b>pengamalan dan implementasi</b> dalam konteks radikalisme, nasionalisme di era digital, dan bela negara.</p><div class="bg-red-50 border border-red-100 rounded-xl p-6 mb-6"><h3 class="text-lg font-bold text-red-900 mb-2">Bela Negara Non-Fisik</h3><ul class="list-disc pl-5 space-y-2 text-red-800"><li>Tidak menyebarkan hoaks terkait SARA di platform sosial media.</li><li>Mencintai produk dalam negeri dan menjaga stabilitas ekonomi mikro.</li><li>Berprestasi di tingkat internasional untuk mengharumkan nama bangsa.</li></ul></div>'
        }
      ]
    },
    {
      id: 103,
      title: 'Strategi TKP — Nilai Maksimal 5',
      description: 'Teknik menjawab soal TKP dengan strategi poin 5 di setiap soal.',
      icon: '⭐',
      gradient: 'from-violet-600 to-purple-700',
      features: ['Pola jawaban BerAKHLAK', '100+ soal TKP terklasifikasi', 'Simulasi ujian penuh', 'Tips anti salah pilih'],
      topics: [
        { 
          title: 'Core Values ASN BerAKHLAK', 
          type: 'doc', 
          duration: '12 menit baca',
          content: '<h2 class="text-2xl font-bold text-gray-900 mb-4">1. Core Values ASN BerAKHLAK</h2><p class="mb-6">Mulai seleksi tahun lalu, penilaian TKP mutlak mengacu pada SE Menteri PANRB tentang Core Values ASN BerAKHLAK (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif).</p><div class="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6"><h3 class="text-lg font-bold text-emerald-900 mb-2">Strategi Menjawab (Mencari Poin 5)</h3><ul class="list-disc pl-5 space-y-2 text-emerald-800"><li>Pilih jawaban yang paling menunjukkan sikap proaktif, bukan sekadar pasif atau menghindari konflik.</li><li>Untuk pelayanan publik, dahulukan SOP yang humanis, cepat, dan transparan.</li></ul></div>'
        }
      ]
    }
  ]

  console.log('Menyimpan konfigurasi kursus ke tabel settings...')
  // Cek apakah courses_config sudah ada
  const existingConfig = await db.select().from(settings).where(undefined) // Drizzle tidak mendukung eq(settings.id, 'courses_config') secara sederhana jika primary key text, tapi bisa menggunakan sql
  // Perbaiki:
  await client`INSERT INTO settings (id, value, "updatedAt") VALUES ('courses_config', ${JSON.stringify(coursesData)}, NOW()) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`

  console.log('✅ Seeding berhasil! Data sudah terhubung langsung ke Supabase.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error seeding:', err)
  process.exit(1)
})
