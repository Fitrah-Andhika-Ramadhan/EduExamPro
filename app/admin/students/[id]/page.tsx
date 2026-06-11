import React from 'react'
import Image from 'next/image'

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary">Detail Peserta</h2>
            <div className="flex items-center gap-2">
              <span className="font-label-md text-on-surface-variant">Data Analitik</span>
              <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
              <span className="font-label-md text-secondary font-bold">Bambang Wijaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Header Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-[160px] text-primary">school</span>
        </div>
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-surface shadow-lg bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[80px] text-primary/50">person</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-success-green text-on-primary p-1 rounded-lg flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
          </div>
        </div>
        <div className="flex-1 z-10">
          <div className="flex flex-wrap items-end gap-3 mb-2">
            <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Bambang Wijaya</h1>
            <span className="font-label-md px-3 py-1 bg-primary-container text-white rounded-full mb-1">ID: EXM-2024-0892</span>
          </div>
          <p className="font-body-lg text-on-surface-variant mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">target</span>
            Target: <span className="font-bold text-on-surface">Seleksi CPNS 2024 (Lulus Passing Grade)</span>
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">leaderboard</span>
              </div>
              <div>
                <p className="font-label-md text-outline">Ranking Kelas</p>
                <p className="font-headline-sm text-on-surface font-bold">#4 <span className="text-success-green text-body-sm font-normal">↑ 2 posisi</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
              <div className="w-10 h-10 rounded-full bg-warning-orange/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-warning-orange" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
              </div>
              <div>
                <p className="font-label-md text-outline">Belajar Streak</p>
                <p className="font-headline-sm text-on-surface font-bold">12 Hari</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">military_tech</span>
              </div>
              <div>
                <p className="font-label-md text-outline">Total Lencana</p>
                <p className="font-headline-sm text-on-surface font-bold">8 Lencana</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 z-10 w-full md:w-auto mt-4 md:mt-0">
          <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95">
            <span className="material-symbols-outlined">mail</span>
            Hubungi Peserta
          </button>
          <button className="border border-outline text-on-surface px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95">
            <span className="material-symbols-outlined">print</span>
            Cetak Laporan
          </button>
        </div>
      </section>

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <span className="text-success-green font-label-md">+15% mgg lalu</span>
          </div>
          <div className="mt-4">
            <p className="font-label-md text-outline">Waktu Belajar</p>
            <p className="font-headline-md text-primary font-bold">124 Jam</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-tertiary-container/10 rounded-lg text-tertiary-container">
              <span className="material-symbols-outlined">star</span>
            </div>
            <span className="text-success-green font-label-md">Stabil</span>
          </div>
          <div className="mt-4">
            <p className="font-label-md text-outline">Rata-rata Skor</p>
            <p className="font-headline-md text-primary font-bold">82.4%</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-success-green/10 rounded-lg text-success-green">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="text-on-surface-variant font-label-md">24/25 Ujian</span>
          </div>
          <div className="mt-4">
            <p className="font-label-md text-outline">Tingkat Kelulusan</p>
            <p className="font-headline-md text-primary font-bold">96%</p>
          </div>
        </div>
        <div className="bg-primary border border-outline-variant rounded-xl p-5 flex flex-col justify-between text-white shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">diamond</span>
            </div>
            <span className="text-secondary-fixed font-label-md">Gold Tier</span>
          </div>
          <div className="mt-4">
            <p className="font-label-md opacity-70">Total XP Diraih</p>
            <p className="font-headline-md font-bold">15.420 XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress Chart Placeholder */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-sm text-primary font-bold">Tren Performa Belajar</h3>
              <p className="font-body-sm text-outline">Statistik skor tryout dalam 3 bulan terakhir</p>
            </div>
            <select className="bg-surface border border-outline-variant rounded-lg text-body-sm px-3 py-1 focus:ring-secondary focus:border-secondary outline-none">
              <option>3 Bulan Terakhir</option>
              <option>1 Bulan Terakhir</option>
            </select>
          </div>
          <div className="h-[240px] flex items-end justify-between gap-2 pt-4 relative">
            {[72, 78, 85, 82, 88, 92].map((score, i) => {
              const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN']
              const isHigh = score > 80
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div 
                    className={`w-full rounded-t-lg transition-all relative ${isHigh ? 'bg-secondary/80 hover:bg-secondary' : 'bg-surface-container hover:bg-secondary/40'}`} 
                    style={{ height: `${score}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{score}</div>
                  </div>
                  <span className={`text-[10px] font-bold ${isHigh ? 'text-primary' : 'text-outline'}`}>{months[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-white to-secondary/5 border-l-4 border-secondary border-y border-r border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            </div>
            <h3 className="font-headline-sm text-primary font-bold">AI Learning Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-surface rounded-lg border border-outline-variant/30">
              <p className="font-label-md text-secondary uppercase tracking-wider mb-1">Gaya Belajar</p>
              <p className="font-body-md font-bold text-on-surface">Visual - Kinestetik</p>
              <p className="font-body-sm text-on-surface-variant mt-1">Sangat efektif belajar melalui grafik interaktif dan simulasi ujian berkali-kali.</p>
            </div>
            <div className="space-y-3">
              <p className="font-label-md text-outline">Rekomendasi Strategis:</p>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-secondary text-[18px]">lightbulb</span>
                  <p className="font-body-sm text-on-surface">Fokus pada <span className="font-bold">TIU - Silogisme</span>; akurasi masih di bawah 65%.</p>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
                  <p className="font-body-sm text-on-surface">Perbanyak latihan <span className="font-bold">Manajemen Waktu</span> pada section TKP.</p>
                </li>
                <li className="flex gap-2 items-start text-success-green">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  <p className="font-body-sm">Potensi Lulus: <span className="font-bold">Sangat Tinggi (89%)</span></p>
                </li>
              </ul>
            </div>
            <button className="w-full mt-4 text-secondary font-bold text-body-sm flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-secondary/10 transition-colors">
              Lihat Rencana Belajar AI <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Mastery Breakdown */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="font-headline-sm text-primary font-bold mb-6">Mastery Level Per Subjek</h3>
          <div className="space-y-5 flex-1">
            {[
              { name: 'TWK (Wawasan Kebangsaan)', p: 92, c: 'bg-secondary' },
              { name: 'TIU (Intelijensia Umum)', p: 64, c: 'bg-warning-orange' },
              { name: 'TKP (Karakteristik Pribadi)', p: 88, c: 'bg-success-green' },
              { name: 'Bahasa Inggris (Optional)', p: 45, c: 'bg-outline' },
            ].map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md font-bold">{sub.name}</span>
                  <span className={`font-label-md ${sub.c.replace('bg-', 'text-')}`}>{sub.p}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${sub.c} rounded-full`} style={{ width: `${sub.p}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">info</span>
              <p className="text-[12px] text-on-surface-variant italic">Data ini diperbarui secara otomatis setelah setiap sesi latihan mandiri.</p>
            </div>
          </div>
        </div>

        {/* Recent Activities & Exam History */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-headline-sm text-primary font-bold">Riwayat Ujian & Aktivitas</h3>
            <button className="text-secondary font-bold text-label-md hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-label-md text-outline uppercase tracking-wider">Nama Ujian</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase tracking-wider text-center">Skor</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[
                  { title: 'Tryout Akbar Nasional #3', cat: 'CPNS Premium', date: '12 Jun 2024', score: '412 / 500', st: 'Lulus PG', sc: 'bg-success-green/10 text-success-green', textC: 'text-success-green' },
                  { title: 'Latihan TIU - Logika Numerik', cat: 'Latihan Mandiri', date: '10 Jun 2024', score: '65 / 100', st: 'Perlu Review', sc: 'bg-warning-orange/10 text-warning-orange', textC: 'text-warning-orange' },
                  { title: 'Simulasi CAT SKD Batch 2', cat: 'Ujian Institusi', date: '05 Jun 2024', score: '398 / 500', st: 'Lulus PG', sc: 'bg-success-green/10 text-success-green', textC: 'text-success-green' },
                  { title: 'Kuis Harian Wawasan Kebangsaan', cat: 'Gamifikasi', date: '04 Jun 2024', score: '100 / 100', st: 'Sempurna', sc: 'bg-secondary/10 text-secondary', textC: 'text-primary' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-body-sm font-bold text-primary">{row.title}</p>
                      <p className="text-[12px] text-outline">Kategori: {row.cat}</p>
                    </td>
                    <td className="px-6 py-4 font-body-sm">{row.date}</td>
                    <td className={`px-6 py-4 font-body-sm font-bold text-center ${row.textC}`}>{row.score}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 ${row.sc} text-[10px] font-bold rounded-full uppercase`}>{row.st}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-secondary hover:bg-secondary/10 rounded-full transition-colors" title="Lihat Analisis">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
