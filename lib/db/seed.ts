import { db } from './index'
import { user, categories, questions, options, tests, testQuestions } from './schema'
// @ts-ignore
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding EduBangsa Assessment Center database...')

  // 1. Seed Admin User
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123456', 10)
  await db.insert(user).values({
    id: 'user_admin_001',
    name: 'Admin EduBangsa',
    email: 'admin@edubangsa.id',
    password: hashedPassword,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing()

  // Demo student
  const studentPassword = await bcrypt.hash('student123', 10)
  await db.insert(user).values({
    id: 'user_student_001',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    password: studentPassword,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing()

  // 2. Seed Categories
  console.log('📂 Creating categories...')
  const categoryData = [
    { name: 'TIU - Tes Intelegensi Umum', slug: 'tiu-cpns', description: 'Soal CPNS Tes Intelegensi Umum: Penalaran, Matematika, dan Verbal', userId: 'user_admin_001' },
    { name: 'TWK - Tes Wawasan Kebangsaan', slug: 'twk-cpns', description: 'Soal CPNS Tes Wawasan Kebangsaan: Pancasila, UUD 1945, NKRI, Bhineka Tunggal Ika', userId: 'user_admin_001' },
    { name: 'TKP - Tes Karakteristik Pribadi', slug: 'tkp-cpns', description: 'Soal CPNS Tes Karakteristik Pribadi: Perilaku dan Situasional', userId: 'user_admin_001' },
    { name: 'UTBK TPS - Penalaran Umum', slug: 'tps-penalaran-umum', description: 'Soal UTBK TPS Penalaran Umum untuk Saintek dan Soshum', userId: 'user_admin_001' },
    { name: 'UTBK TPS - Literasi Bahasa Indonesia', slug: 'tps-literasi-id', description: 'Soal UTBK TPS Literasi Bahasa Indonesia', userId: 'user_admin_001' },
    { name: 'UTBK TPS - Literasi Bahasa Inggris', slug: 'tps-literasi-en', description: 'Soal UTBK TPS Literasi Bahasa Inggris', userId: 'user_admin_001' },
    { name: 'UTBK TPS - Penalaran Matematika', slug: 'tps-penalaran-mtk', description: 'Soal UTBK TPS Penalaran Matematika', userId: 'user_admin_001' },
    { name: 'TKA Saintek - Matematika', slug: 'tka-saintek-mtk', description: 'Soal UTBK TKA Saintek Matematika', userId: 'user_admin_001' },
    { name: 'TKA Saintek - Fisika', slug: 'tka-saintek-fisika', description: 'Soal UTBK TKA Saintek Fisika', userId: 'user_admin_001' },
    { name: 'TKA Soshum - Sejarah', slug: 'tka-soshum-sejarah', description: 'Soal UTBK TKA Soshum Sejarah', userId: 'user_admin_001' },
  ]
  const insertedCategories = await db.insert(categories).values(categoryData).returning()
  const catMap: Record<string, number> = {}
  insertedCategories.forEach(c => { catMap[c.slug!] = c.id })
  console.log(`✅ Created ${insertedCategories.length} categories`)

  // 3. Seed Questions per category
  console.log('📝 Creating questions and options...')

  // ---- TIU Questions ----
  const tiuQuestions = [
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Jika 3x + 7 = 22, maka nilai x adalah...',
      explanation: 'Dari 3x + 7 = 22, kita kurangi 7 dari kedua sisi: 3x = 15, lalu x = 5.',
      opts: [{ text: '3', correct: false }, { text: '4', correct: false }, { text: '5', correct: true }, { text: '6', correct: false }, { text: '7', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Deret angka berikut: 2, 4, 8, 16, 32, ... Angka berikutnya adalah...',
      explanation: 'Deret ini adalah deret geometri dengan rasio 2 (setiap suku dikali 2). 32 × 2 = 64.',
      opts: [{ text: '48', correct: false }, { text: '56', correct: false }, { text: '60', correct: false }, { text: '64', correct: true }, { text: '68', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Rata-rata nilai 5 siswa adalah 75. Jika satu siswa dengan nilai 60 keluar dan diganti siswa baru, rata-rata menjadi 78. Nilai siswa baru adalah...',
      explanation: 'Total awal = 5 × 75 = 375. Setelah siswa 60 keluar: 375 - 60 = 315. Total baru = 5 × 78 = 390. Nilai siswa baru = 390 - 315 = 75... Tunggu. 4 siswa lama + 1 baru = 5. Rata-rata baru 78, total = 390. Total 4 siswa = 315. Nilai baru = 390 - 315 = 75. Jawaban: 75.',
      opts: [{ text: '85', correct: false }, { text: '90', correct: false }, { text: '75', correct: true }, { text: '80', correct: false }, { text: '95', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Sinonim kata "Acuan" adalah...',
      explanation: 'Acuan berarti sesuatu yang dijadikan dasar atau patokan dalam melakukan sesuatu, sinonimnya adalah Patokan.',
      opts: [{ text: 'Penyimpangan', correct: false }, { text: 'Patokan', correct: true }, { text: 'Perbedaan', correct: false }, { text: 'Kesamaan', correct: false }, { text: 'Hipotesis', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'KUDA : KANDANG = HARIMAU : ...',
      explanation: 'Kuda tinggal di kandang, sedangkan harimau tinggal di sarang. Ini adalah analogi hubungan hewan dengan tempat tinggalnya.',
      opts: [{ text: 'Hutan', correct: false }, { text: 'Gua', correct: false }, { text: 'Sarang', correct: true }, { text: 'Liang', correct: false }, { text: 'Lubang', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapakah luas persegi panjang tersebut?',
      explanation: 'Luas persegi panjang = panjang × lebar = 12 × 8 = 96 cm².',
      opts: [{ text: '80 cm²', correct: false }, { text: '84 cm²', correct: false }, { text: '90 cm²', correct: false }, { text: '96 cm²', correct: true }, { text: '100 cm²', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Semua pengusaha adalah orang yang gigih. Beberapa orang yang gigih adalah atlet. Kesimpulan yang paling tepat adalah...',
      explanation: 'Dengan silogisme: Semua pengusaha gigih, beberapa gigih adalah atlet. Maka kita tidak bisa menyimpulkan bahwa semua pengusaha adalah atlet, tapi ada kemungkinan beberapa pengusaha adalah atlet.',
      opts: [
        { text: 'Semua pengusaha adalah atlet', correct: false },
        { text: 'Semua atlet adalah pengusaha', correct: false },
        { text: 'Beberapa pengusaha mungkin adalah atlet', correct: true },
        { text: 'Tidak ada atlet yang pengusaha', correct: false },
        { text: 'Semua gigih adalah pengusaha', correct: false },
      ],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Antonim kata "Eksplisit" adalah...',
      explanation: 'Eksplisit berarti jelas, terang, tidak tersembunyi. Antonimnya adalah Implisit (tersembunyi/tersirat).',
      opts: [{ text: 'Nyata', correct: false }, { text: 'Implisit', correct: true }, { text: 'Konkret', correct: false }, { text: 'Jelas', correct: false }, { text: 'Tegas', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Jika A lebih tinggi dari B, C lebih rendah dari B, dan D lebih tinggi dari A, maka urutan dari yang tertinggi ke terendah adalah...',
      explanation: 'Diketahui: D > A > B > C. Maka urutan dari tertinggi adalah D, A, B, C.',
      opts: [{ text: 'A, D, B, C', correct: false }, { text: 'D, A, C, B', correct: false }, { text: 'D, A, B, C', correct: true }, { text: 'A, D, C, B', correct: false }, { text: 'D, B, A, C', correct: false }],
    },
    {
      categoryId: catMap['tiu-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Sebuah toko memberikan diskon 20% untuk sepatu seharga Rp500.000. Berapa harga setelah diskon?',
      explanation: 'Diskon = 20% × 500.000 = 100.000. Harga setelah diskon = 500.000 - 100.000 = 400.000.',
      opts: [{ text: 'Rp350.000', correct: false }, { text: 'Rp400.000', correct: true }, { text: 'Rp420.000', correct: false }, { text: 'Rp450.000', correct: false }, { text: 'Rp480.000', correct: false }],
    },
  ]

  // ---- TWK Questions ----
  const twkQuestions = [
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Pancasila sebagai dasar negara Indonesia ditetapkan pada tanggal...',
      explanation: 'Pancasila ditetapkan sebagai dasar negara pada tanggal 18 Agustus 1945 oleh PPKI (Panitia Persiapan Kemerdekaan Indonesia).',
      opts: [{ text: '17 Agustus 1945', correct: false }, { text: '18 Agustus 1945', correct: true }, { text: '1 Juni 1945', correct: false }, { text: '29 Mei 1945', correct: false }, { text: '22 Juni 1945', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'UUD 1945 pasal berapa yang mengatur tentang hak setiap warga negara untuk mendapat pendidikan?',
      explanation: 'Hak mendapat pendidikan diatur dalam UUD 1945 Pasal 31 ayat (1) yang berbunyi "Setiap warga negara berhak mendapat pendidikan."',
      opts: [{ text: 'Pasal 27', correct: false }, { text: 'Pasal 28', correct: false }, { text: 'Pasal 31', correct: true }, { text: 'Pasal 33', correct: false }, { text: 'Pasal 34', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Semboyan "Bhinneka Tunggal Ika" berasal dari kitab...',
      explanation: 'Bhinneka Tunggal Ika berasal dari Kakawin Sutasoma karya Mpu Tantular dari Kerajaan Majapahit.',
      opts: [{ text: 'Negarakertagama', correct: false }, { text: 'Sutasoma', correct: true }, { text: 'Pararaton', correct: false }, { text: 'Arjunawiwaha', correct: false }, { text: 'Ramayana', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Dalam sistem pemerintahan Indonesia, lembaga yang berwenang menguji undang-undang terhadap UUD 1945 adalah...',
      explanation: 'Mahkamah Konstitusi (MK) adalah lembaga yang berwenang menguji undang-undang terhadap Undang-Undang Dasar (judicial review).',
      opts: [{ text: 'Mahkamah Agung', correct: false }, { text: 'Dewan Perwakilan Rakyat', correct: false }, { text: 'Mahkamah Konstitusi', correct: true }, { text: 'Badan Pemeriksa Keuangan', correct: false }, { text: 'Komisi Yudisial', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'NKRI berdasarkan Pasal 1 Ayat 1 UUD 1945 adalah negara yang berbentuk...',
      explanation: 'Pasal 1 Ayat (1) UUD 1945 berbunyi "Negara Indonesia ialah Negara Kesatuan, yang berbentuk Republik."',
      opts: [{ text: 'Kerajaan', correct: false }, { text: 'Federal', correct: false }, { text: 'Kesatuan berbentuk Republik', correct: true }, { text: 'Konfederasi', correct: false }, { text: 'Demokrasi Liberal', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Nilai persatuan dalam Pancasila sila ke-3 "Persatuan Indonesia" mengandung prinsip...',
      explanation: 'Sila ke-3 mengandung prinsip Nasionalisme, yang menekankan rasa cinta tanah air dan kesatuan bangsa Indonesia.',
      opts: [{ text: 'Internasionalisme', correct: false }, { text: 'Nasionalisme', correct: true }, { text: 'Chauvinisme', correct: false }, { text: 'Egoisme', correct: false }, { text: 'Komunisme', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal 17 Agustus 1945 di...',
      explanation: 'Proklamasi Kemerdekaan Indonesia dibacakan oleh Soekarno di Jalan Pegangsaan Timur No. 56, Jakarta.',
      opts: [{ text: 'Istana Negara, Jakarta', correct: false }, { text: 'Jalan Pegangsaan Timur No. 56, Jakarta', correct: true }, { text: 'Lapangan Banteng, Jakarta', correct: false }, { text: 'Gedung Joang 45, Jakarta', correct: false }, { text: 'Monas, Jakarta', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Asas "Negara Hukum" (Rechtsstaat) tercermin dalam UUD 1945 Pasal...',
      explanation: 'Pasal 1 Ayat (3) UUD 1945 berbunyi "Negara Indonesia adalah negara hukum." Ini adalah dasar asas Rechtsstaat Indonesia.',
      opts: [{ text: 'Pasal 1 Ayat 1', correct: false }, { text: 'Pasal 1 Ayat 2', correct: false }, { text: 'Pasal 1 Ayat 3', correct: true }, { text: 'Pasal 2 Ayat 1', correct: false }, { text: 'Pasal 3 Ayat 1', correct: false }],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Fungsi utama ASN (Aparatur Sipil Negara) berdasarkan UU No. 5 Tahun 2014 adalah...',
      explanation: 'Berdasarkan UU ASN No. 5 Tahun 2014, fungsi ASN adalah sebagai pelaksana kebijakan publik, pelayan publik, dan perekat serta pemersatu bangsa.',
      opts: [
        { text: 'Pembuat kebijakan negara', correct: false },
        { text: 'Pelaksana kebijakan publik, pelayan publik, dan perekat bangsa', correct: true },
        { text: 'Pengawas keuangan negara', correct: false },
        { text: 'Pembuat undang-undang', correct: false },
        { text: 'Penegak hukum', correct: false },
      ],
    },
    {
      categoryId: catMap['twk-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Tujuan Negara Indonesia sebagaimana tercantum dalam Pembukaan UUD 1945 alinea ke-4 adalah, kecuali...',
      explanation: 'Tujuan negara dalam Pembukaan UUD 1945 alinea ke-4: melindungi segenap bangsa, memajukan kesejahteraan umum, mencerdaskan kehidupan bangsa, dan ikut melaksanakan ketertiban dunia. "Memperluas wilayah" bukan salah satunya.',
      opts: [
        { text: 'Melindungi segenap bangsa Indonesia', correct: false },
        { text: 'Memperluas wilayah Indonesia', correct: true },
        { text: 'Memajukan kesejahteraan umum', correct: false },
        { text: 'Mencerdaskan kehidupan bangsa', correct: false },
        { text: 'Ikut melaksanakan ketertiban dunia', correct: false },
      ],
    },
  ]

  // ---- TKP Questions ----
  const tkpQuestions = [
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Anda adalah ASN baru di sebuah instansi. Atasan Anda meminta melakukan tugas yang menurut Anda bertentangan dengan peraturan. Apa yang Anda lakukan?',
      explanation: 'Jawaban terbaik adalah berkomunikasi secara profesional dengan atasan, menyampaikan keberatan secara konstruktif, dan mencari jalan tengah yang sesuai aturan.',
      opts: [
        { text: 'Langsung menolak tanpa penjelasan', correct: false },
        { text: 'Melakukan tugas tanpa pikir panjang', correct: false },
        { text: 'Berdiskusi dengan atasan, sampaikan keberatan secara profesional dan cari solusi', correct: true },
        { text: 'Mengadu ke atasan yang lebih tinggi tanpa bicara dengan atasan langsung', correct: false },
        { text: 'Menunda tugas sampai ada kejelasan', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Rekan kerja Anda sering datang terlambat sehingga mengganggu produktivitas tim. Sikap Anda adalah...',
      explanation: 'Pendekatan yang baik adalah dengan komunikasi langsung dan empatik dengan rekan tersebut sebelum melibatkan pihak lain.',
      opts: [
        { text: 'Melaporkan langsung ke atasan', correct: false },
        { text: 'Membiarkan saja karena bukan urusan Anda', correct: false },
        { text: 'Menegur di depan umum agar jera', correct: false },
        { text: 'Berbicara secara empat mata dan menanyakan alasannya dengan empati', correct: true },
        { text: 'Menggunakan media sosial untuk menyindir perilaku tersebut', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Saat bekerja, Anda mendapat tugas tambahan yang memerlukan keahlian yang belum Anda miliki. Respon Anda adalah...',
      explanation: 'Menunjukkan inisiatif untuk belajar dan meminta bimbingan adalah karakteristik pegawai yang proaktif dan berkomitmen untuk berkembang.',
      opts: [
        { text: 'Menolak tugas tersebut karena tidak sesuai kompetensi', correct: false },
        { text: 'Menerima dan berusaha belajar mandiri sambil meminta bimbingan yang diperlukan', correct: true },
        { text: 'Melimpahkan tugas ke rekan yang lebih kompeten', correct: false },
        { text: 'Pura-pura mampu dan mengerjakan semampunya', correct: false },
        { text: 'Meminta perpanjangan deadline tanpa mencoba', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Anda menemukan data yang tidak akurat dalam laporan resmi instansi yang sudah disetujui atasan. Apa yang Anda lakukan?',
      explanation: 'Integritas mengharuskan kita melaporkan data yang tidak akurat meskipun sudah disetujui, namun dengan cara yang profesional dan melalui jalur yang tepat.',
      opts: [
        { text: 'Diam saja karena sudah disetujui atasan', correct: false },
        { text: 'Langsung mengubah data tanpa sepengetahuan atasan', correct: false },
        { text: 'Melaporkan temuan tersebut kepada atasan secara profesional dengan bukti yang jelas', correct: true },
        { text: 'Membocorkan informasi ke media massa', correct: false },
        { text: 'Menunggu sampai ada yang bertanya tentang data tersebut', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Tim Anda sedang menghadapi deadline ketat, namun salah satu anggota tim tiba-tiba sakit. Sebagai koordinator, langkah prioritas Anda adalah...',
      explanation: 'Sebagai koordinator yang baik, prioritas adalah memastikan keselamatan anggota tim yang sakit, kemudian segera mengatur ulang distribusi tugas agar deadline tetap bisa dipenuhi.',
      opts: [
        { text: 'Tetap memaksa anggota yang sakit untuk hadir', correct: false },
        { text: 'Memastikan anggota yang sakit tertangani, lalu redistribusi tugas dan komunikasikan dengan atasan', correct: true },
        { text: 'Langsung melaporkan kegagalan deadline ke atasan', correct: false },
        { text: 'Mengerjakan semua tugas sendirian', correct: false },
        { text: 'Meminta penundaan deadline tanpa tindakan lain', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Seorang warga datang ke kantor Anda dengan cara yang kasar dan marah-marah karena pelayanan yang lambat. Sikap Anda sebagai pegawai pelayan publik adalah...',
      explanation: 'Pelayan publik yang baik tetap tenang menghadapi warga yang marah, mendengarkan keluhannya, berempati, dan berusaha menyelesaikan masalahnya dengan cepat dan profesional.',
      opts: [
        { text: 'Membalas dengan nada yang sama agar warga mengerti batasannya', correct: false },
        { text: 'Mengusir warga karena berlaku tidak sopan', correct: false },
        { text: 'Tetap tenang, dengarkan keluhannya dengan empati, dan bantu selesaikan masalahnya', correct: true },
        { text: 'Meminta rekan lain yang menangani dan pergi', correct: false },
        { text: 'Memanggil satpam untuk mengeluarkan warga tersebut', correct: false },
      ],
    },
    {
      categoryId: catMap['tkp-cpns'], type: 'multiple_choice', difficulty: 'easy', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Ketika menghadapi masalah pekerjaan yang kompleks, pendekatan yang paling baik adalah...',
      explanation: 'Pendekatan sistematis dengan mengidentifikasi akar masalah, menganalisis, dan mencari solusi alternatif adalah cara terbaik dalam problem solving.',
      opts: [
        { text: 'Langsung mengambil keputusan berdasarkan intuisi', correct: false },
        { text: 'Meminta orang lain yang menyelesaikan', correct: false },
        { text: 'Mengidentifikasi akar masalah, menganalisis opsi, lalu memilih solusi terbaik', correct: true },
        { text: 'Menunggu masalah selesai sendiri', correct: false },
        { text: 'Mengikuti cara lama yang sudah biasa dilakukan', correct: false },
      ],
    },
  ]

  // ---- UTBK TPS Penalaran Umum ----
  const tpsQuestions = [
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Semua mahasiswa universitas X wajib mengikuti KKN. Reza adalah mahasiswa universitas Y. Kesimpulan yang tepat adalah...',
      explanation: 'Dari premis tersebut, kita tidak bisa menyimpulkan apakah Reza wajib KKN atau tidak, karena informasi hanya berlaku untuk mahasiswa universitas X.',
      opts: [
        { text: 'Reza wajib mengikuti KKN', correct: false },
        { text: 'Reza tidak wajib mengikuti KKN', correct: false },
        { text: 'Tidak dapat disimpulkan apakah Reza wajib KKN', correct: true },
        { text: 'Reza adalah mahasiswa universitas X', correct: false },
        { text: 'Semua mahasiswa wajib KKN', correct: false },
      ],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Perhatikan pola berikut: 1, 1, 2, 3, 5, 8, 13, ... Angka selanjutnya adalah...',
      explanation: 'Ini adalah deret Fibonacci di mana setiap suku adalah jumlah dua suku sebelumnya. 8 + 13 = 21.',
      opts: [{ text: '18', correct: false }, { text: '20', correct: false }, { text: '21', correct: true }, { text: '24', correct: false }, { text: '25', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Jika p → q benar, dan q → r benar, maka kesimpulan yang PASTI benar adalah...',
      explanation: 'Ini adalah silogisme hipotetis. Jika p → q dan q → r, maka p → r (Modus Barbara/Transitifitas).',
      opts: [
        { text: 'r → p', correct: false },
        { text: 'p → r', correct: true },
        { text: 'q → p', correct: false },
        { text: '~p → ~r', correct: false },
        { text: 'r → q', correct: false },
      ],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Suatu kelompok terdiri dari 30 orang. 18 orang suka musik, 15 orang suka olahraga, dan 8 orang suka keduanya. Berapa orang yang tidak suka keduanya?',
      explanation: 'Yang suka musik atau olahraga = 18 + 15 - 8 = 25 orang. Yang tidak suka keduanya = 30 - 25 = 5 orang.',
      opts: [{ text: '3', correct: false }, { text: '4', correct: false }, { text: '5', correct: true }, { text: '6', correct: false }, { text: '7', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Jika harga 1 kg apel adalah Rp24.000 dan harga 1 kg jeruk adalah Rp18.000, berapa total harga 3 kg apel dan 2 kg jeruk?',
      explanation: 'Total = (3 × 24.000) + (2 × 18.000) = 72.000 + 36.000 = 108.000.',
      opts: [{ text: 'Rp96.000', correct: false }, { text: 'Rp102.000', correct: false }, { text: 'Rp108.000', correct: true }, { text: 'Rp114.000', correct: false }, { text: 'Rp120.000', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Perhatikan tabel: Senin=120, Selasa=150, Rabu=130, Kamis=180, Jumat=160. Berapa rata-rata penjualan per hari?',
      explanation: 'Rata-rata = (120+150+130+180+160) / 5 = 740 / 5 = 148.',
      opts: [{ text: '140', correct: false }, { text: '145', correct: false }, { text: '148', correct: true }, { text: '150', correct: false }, { text: '152', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Grafik menunjukkan pertumbuhan penduduk kota A: 2019=500rb, 2020=550rb, 2021=610rb, 2022=680rb. Jika tren ini berlanjut, perkiraan penduduk 2023 adalah...',
      explanation: 'Pertumbuhan: 50rb, 60rb, 70rb (naik 10rb per tahun). Perkiraan kenaikan 2023 = 80rb. 680rb + 80rb = 760rb.',
      opts: [{ text: '720.000', correct: false }, { text: '740.000', correct: false }, { text: '750.000', correct: false }, { text: '760.000', correct: true }, { text: '780.000', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Dinda berangkat dari kota A pukul 07.00 dengan kecepatan 60 km/jam. Dika berangkat dari kota A yang sama pukul 08.00 dengan kecepatan 90 km/jam menuju arah yang sama. Pukul berapa Dika akan menyusul Dinda?',
      explanation: 'Pada pukul 08.00, Dinda sudah berjalan 1 jam = 60 km lebih dulu. Selisih kecepatan = 90-60 = 30 km/jam. Waktu untuk menyusul = 60/30 = 2 jam dari pukul 08.00 = pukul 10.00.',
      opts: [{ text: '09.00', correct: false }, { text: '09.30', correct: false }, { text: '10.00', correct: true }, { text: '10.30', correct: false }, { text: '11.00', correct: false }],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Bacaan: "Tingkat literasi keuangan masyarakat Indonesia masih tergolong rendah dibandingkan negara ASEAN lain. Survei menunjukkan hanya 38% yang melek finansial." Apa yang bisa disimpulkan?',
      explanation: 'Berdasarkan bacaan, dapat disimpulkan bahwa lebih dari separuh masyarakat Indonesia (62%) belum melek finansial, yang mengindikasikan perlunya edukasi keuangan.',
      opts: [
        { text: 'Seluruh masyarakat Indonesia tidak paham keuangan', correct: false },
        { text: 'Indonesia tertinggal dalam semua aspek dibanding ASEAN', correct: false },
        { text: 'Sebagian besar masyarakat Indonesia belum melek finansial, perlu edukasi', correct: true },
        { text: 'Survei keuangan tidak diperlukan', correct: false },
        { text: '38% adalah angka tertinggi di ASEAN', correct: false },
      ],
    },
    {
      categoryId: catMap['tps-penalaran-umum'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Di sebuah kantor terdapat 5 ruangan: A, B, C, D, E. A bersebelahan dengan B. C tidak bersebelahan dengan A. D bersebelahan dengan C. E berada di paling ujung. Urutan yang mungkin adalah...',
      explanation: 'Berdasarkan kondisi: E di ujung, A-B bersebelahan, C-D bersebelahan, C tidak di sebelah A. Urutan yang mungkin: E-C-D-A-B atau B-A-D-C-E.',
      opts: [
        { text: 'A-C-B-D-E', correct: false },
        { text: 'E-C-D-A-B', correct: true },
        { text: 'A-B-C-D-E', correct: false },
        { text: 'E-A-B-C-D', correct: false },
        { text: 'B-C-A-D-E', correct: false },
      ],
    },
  ]

  // ---- TKA Saintek Matematika ----
  const tkaMatematika = [
    {
      categoryId: catMap['tka-saintek-mtk'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Nilai dari lim(x→2) [(x² - 4) / (x - 2)] adalah...',
      explanation: 'Faktorkan pembilang: x² - 4 = (x-2)(x+2). Maka limit = lim(x→2) (x+2) = 2 + 2 = 4.',
      opts: [{ text: '2', correct: false }, { text: '3', correct: false }, { text: '4', correct: true }, { text: '0', correct: false }, { text: 'Tidak terdefinisi', correct: false }],
    },
    {
      categoryId: catMap['tka-saintek-mtk'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Turunan pertama dari f(x) = 3x³ - 2x² + 5x - 1 adalah...',
      explanation: 'f\'(x) = 9x² - 4x + 5. Menggunakan aturan turunan: d/dx(axⁿ) = naxⁿ⁻¹.',
      opts: [{ text: '9x² - 4x + 5', correct: true }, { text: '9x² + 4x - 5', correct: false }, { text: '9x² - 4x - 5', correct: false }, { text: '3x² - 2x + 5', correct: false }, { text: '9x - 4', correct: false }],
    },
    {
      categoryId: catMap['tka-saintek-mtk'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: '∫(2x + 3) dx = ...',
      explanation: '∫(2x + 3) dx = x² + 3x + C menggunakan aturan integral dasar.',
      opts: [{ text: 'x² + 3x + C', correct: true }, { text: '2x² + 3x + C', correct: false }, { text: 'x + 3 + C', correct: false }, { text: '2x + 3 + C', correct: false }, { text: 'x² + C', correct: false }],
    },
    {
      categoryId: catMap['tka-saintek-mtk'], type: 'multiple_choice', difficulty: 'medium', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Matriks A = [[2,3],[1,4]]. Determinan A adalah...',
      explanation: 'det(A) = (2×4) - (3×1) = 8 - 3 = 5.',
      opts: [{ text: '3', correct: false }, { text: '4', correct: false }, { text: '5', correct: true }, { text: '6', correct: false }, { text: '8', correct: false }],
    },
    {
      categoryId: catMap['tka-saintek-mtk'], type: 'multiple_choice', difficulty: 'hard', userId: 'user_admin_001', createdAt: new Date(), updatedAt: new Date(),
      questionText: 'Nilai dari sin(60°) + cos(30°) adalah...',
      explanation: 'sin(60°) = √3/2 dan cos(30°) = √3/2. Maka sin(60°) + cos(30°) = √3/2 + √3/2 = √3.',
      opts: [{ text: '1', correct: false }, { text: '√2', correct: false }, { text: '√3', correct: true }, { text: '2', correct: false }, { text: '√3/2', correct: false }],
    },
  ]

  // Helper function to insert questions with options
  const insertQWithOptions = async (qData: any[]) => {
    for (const q of qData) {
      const { opts, ...qFields } = q
      const [insertedQ] = await db.insert(questions).values(qFields).returning()
      if (opts) {
        await db.insert(options).values(
          opts.map((o: any, i: number) => ({
            questionId: insertedQ.id,
            optionText: o.text,
            isCorrect: o.correct,
            orderIndex: i + 1,
            createdAt: new Date(),
          }))
        )
      }
    }
  }

  await insertQWithOptions(tiuQuestions)
  await insertQWithOptions(twkQuestions)
  await insertQWithOptions(tkpQuestions)
  await insertQWithOptions(tpsQuestions)
  await insertQWithOptions(tkaMatematika)
  console.log('✅ Questions and options created')

  // 4. Seed Tests (Paket Tryout)
  console.log('📋 Creating test packages...')
  const testData = [
    {
      title: '🏆 Grand Tryout CPNS 2026 - Paket Lengkap',
      description: 'Simulasi ujian CPNS paling lengkap! Mencakup TIU (Tes Intelegensi Umum), TWK (Tes Wawasan Kebangsaan), dan TKP (Tes Karakteristik Pribadi) sesuai standar BKN.',
      categoryId: catMap['tiu-cpns'],
      durationMinutes: 100,
      passingScore: 65,
      showResults: true,
      showAnswers: true,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '⚡ Simulasi SKD CPNS - TIU Focus',
      description: 'Tryout khusus Tes Intelegensi Umum (TIU) untuk mengasah kemampuan numerik, penalaran verbal, dan penalaran figural. Fokus pada peningkatan nilai TIU yang sering menjadi penentu kelulusan SKD.',
      categoryId: catMap['tiu-cpns'],
      durationMinutes: 35,
      passingScore: 80,
      showResults: true,
      showAnswers: true,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '📚 Tryout TWK - Wawasan Kebangsaan Intensif',
      description: 'Paket tryout khusus Tes Wawasan Kebangsaan. Kuasai materi Pancasila, UUD 1945, sejarah Indonesia, NKRI, dan Bhinneka Tunggal Ika.',
      categoryId: catMap['twk-cpns'],
      durationMinutes: 25,
      passingScore: 70,
      showResults: true,
      showAnswers: true,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '🎯 Simulasi UTBK TPS 2026',
      description: 'Simulasi ujian UTBK Tes Potensi Skolastik (TPS) yang realistis. Mencakup Penalaran Umum, Pengetahuan dan Pemahaman Umum, sesuai standar SNBT terbaru.',
      categoryId: catMap['tps-penalaran-umum'],
      durationMinutes: 60,
      passingScore: 600,
      showResults: true,
      showAnswers: false,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '🔬 Tryout TKA Saintek - Matematika',
      description: 'Latihan soal TKA Saintek khusus Matematika tingkat tinggi. Mencakup kalkulus, aljabar, trigonometri, dan statistika sesuai standar UTBK.',
      categoryId: catMap['tka-saintek-mtk'],
      durationMinutes: 52,
      passingScore: 550,
      showResults: true,
      showAnswers: true,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '💼 Tryout TKP - Karakteristik Pribadi ASN',
      description: 'Latihan soal TKP (Tes Karakteristik Pribadi) untuk menguji orientasi pelayanan, sosial budaya, jejaring kerja, dan integritas diri calon ASN.',
      categoryId: catMap['tkp-cpns'],
      durationMinutes: 35,
      passingScore: 126,
      showResults: true,
      showAnswers: true,
      isPublished: true,
      userId: 'user_admin_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
  const insertedTests = await db.insert(tests).values(testData).returning()
  console.log(`✅ Created ${insertedTests.length} test packages`)

  // 5. Link questions to tests (test_questions)
  console.log('🔗 Linking questions to tests...')
  // Get all questions grouped by category
  const allQuestions = await db.select().from(questions)
  const qByCat: Record<number, number[]> = {}
  allQuestions.forEach(q => {
    if (!qByCat[q.categoryId]) qByCat[q.categoryId] = []
    qByCat[q.categoryId].push(q.id)
  })

  const tiuCatId = catMap['tiu-cpns']
  const twkCatId = catMap['twk-cpns']
  const tkpCatId = catMap['tkp-cpns']
  const tpsCatId = catMap['tps-penalaran-umum']
  const tkaMtkCatId = catMap['tka-saintek-mtk']

  // Grand Tryout (CPNS Lengkap) - insertedTests[0]: TIU + TWK + TKP
  const grandTryoutId = insertedTests[0].id
  const grandQs = [
    ...(qByCat[tiuCatId] || []).map((qId, i) => ({ testId: grandTryoutId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })),
    ...(qByCat[twkCatId] || []).map((qId, i) => ({ testId: grandTryoutId, questionId: qId, orderIndex: (qByCat[tiuCatId]?.length || 0) + i + 1, createdAt: new Date() })),
    ...(qByCat[tkpCatId] || []).map((qId, i) => ({ testId: grandTryoutId, questionId: qId, orderIndex: (qByCat[tiuCatId]?.length || 0) + (qByCat[twkCatId]?.length || 0) + i + 1, createdAt: new Date() })),
  ]
  if (grandQs.length > 0) await db.insert(testQuestions).values(grandQs)

  // TIU Focus Test - insertedTests[1]
  const tiuFocusId = insertedTests[1].id
  if (qByCat[tiuCatId]?.length > 0) {
    await db.insert(testQuestions).values(qByCat[tiuCatId].map((qId, i) => ({ testId: tiuFocusId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })))
  }

  // TWK Test - insertedTests[2]
  const twkTestId = insertedTests[2].id
  if (qByCat[twkCatId]?.length > 0) {
    await db.insert(testQuestions).values(qByCat[twkCatId].map((qId, i) => ({ testId: twkTestId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })))
  }

  // UTBK TPS - insertedTests[3]
  const tpsTestId = insertedTests[3].id
  if (qByCat[tpsCatId]?.length > 0) {
    await db.insert(testQuestions).values(qByCat[tpsCatId].map((qId, i) => ({ testId: tpsTestId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })))
  }

  // TKA Matematika - insertedTests[4]
  const tkaMtkTestId = insertedTests[4].id
  if (qByCat[tkaMtkCatId]?.length > 0) {
    await db.insert(testQuestions).values(qByCat[tkaMtkCatId].map((qId, i) => ({ testId: tkaMtkTestId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })))
  }

  // TKP - insertedTests[5]
  const tkpTestId = insertedTests[5].id
  if (qByCat[tkpCatId]?.length > 0) {
    await db.insert(testQuestions).values(qByCat[tkpCatId].map((qId, i) => ({ testId: tkpTestId, questionId: qId, orderIndex: i + 1, createdAt: new Date() })))
  }

  console.log('✅ Questions linked to tests')
  console.log('')
  console.log('🎉 Seeding complete!')
  console.log('📧 Admin: admin@edubangsa.id | Password: admin123456')
  console.log('📧 Student: budi@example.com | Password: student123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
