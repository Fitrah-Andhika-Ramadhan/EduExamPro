"use client"

import React, { useState } from 'react'
import Image from 'next/image'

export default function WeaknessAnalysisPage() {
  const [selectedTopic, setSelectedTopic] = useState('Pancasila')

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Detail Analisis Kelemahan Materi</h2>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
              <span className="material-symbols-outlined text-[16px]">group</span>
              <span>Persiapan CPNS 2024 - Batch A</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-outline-variant rounded-lg px-4 py-2 font-label-md focus:border-primary focus:ring-primary outline-none">
            <option>30 Hari Terakhir</option>
            <option>90 Hari Terakhir</option>
            <option>Semester Ini</option>
          </select>
          <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-label-md hover:opacity-90">
            <span className="material-symbols-outlined">download</span>
            Ekspor PDF
          </button>
        </div>
      </section>

      {/* Top Insights: Top 3 Topik Tersulit */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/30 border-t-4 border-t-error-red">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-[10px] font-bold uppercase">Critical</span>
            <span className="material-symbols-outlined text-error-red">error</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm mb-1 text-primary">Pancasila</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">Fokus: Butir-butir Pengamalan</p>
          <div className="space-y-2">
            <div className="flex justify-between font-label-md">
              <span className="text-on-surface-variant">Tingkat Kesalahan</span>
              <span className="text-error-red">68%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div className="bg-error-red h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/30 border-t-4 border-t-warning-orange">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-orange-100 text-warning-orange px-2 py-1 rounded text-[10px] font-bold uppercase">Warning</span>
            <span className="material-symbols-outlined text-warning-orange">warning</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm mb-1 text-primary">TIU - Analogi</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">Fokus: Hubungan Kata Abstrak</p>
          <div className="space-y-2">
            <div className="flex justify-between font-label-md">
              <span className="text-on-surface-variant">Tingkat Kesalahan</span>
              <span className="text-warning-orange">52%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div className="bg-warning-orange h-2 rounded-full" style={{ width: '52%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/30 border-t-4 border-t-secondary">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-1 rounded text-[10px] font-bold uppercase">Monitor</span>
            <span className="material-symbols-outlined text-secondary">trending_up</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm mb-1 text-primary">Sejarah Nasional</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">Fokus: Era Pasca Proklamasi</p>
          <div className="space-y-2">
            <div className="flex justify-between font-label-md">
              <span className="text-on-surface-variant">Tingkat Kesalahan</span>
              <span className="text-secondary">41%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '41%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Data Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-primary">Daftar Topik & Performa</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface-container rounded transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <th className="px-6 py-4">Topik</th>
                  <th className="px-6 py-4">Soal</th>
                  <th className="px-6 py-4">Kesalahan</th>
                  <th className="px-6 py-4">Rata-rata Waktu</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[
                  { name: 'Pancasila', questions: '1,240', error: '68%', time: '42s', status: 'Critical', sColor: 'bg-error-container text-on-error-container', eColor: 'text-error-red' },
                  { name: 'TIU - Analogi', questions: '980', error: '52%', time: '31s', status: 'Warning', sColor: 'bg-orange-100 text-warning-orange', eColor: 'text-warning-orange' },
                  { name: 'Bela Negara', questions: '850', error: '12%', time: '25s', status: 'Safe', sColor: 'bg-green-100 text-success-green', eColor: 'text-success-green' },
                  { name: 'UUD 1945', questions: '1,100', error: '38%', time: '48s', status: 'Warning', sColor: 'bg-orange-100 text-warning-orange', eColor: 'text-warning-orange' },
                  { name: 'TIU - Silogisme', questions: '760', error: '18%', time: '35s', status: 'Safe', sColor: 'bg-green-100 text-success-green', eColor: 'text-success-green' },
                ].map((row, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedTopic(row.name)}
                    className={`transition-colors cursor-pointer ${selectedTopic === row.name ? 'bg-secondary-fixed/20' : 'hover:bg-surface-container-lowest bg-white'}`}
                  >
                    <td className="px-6 py-4 font-bold text-primary">{row.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.questions}</td>
                    <td className={`px-6 py-4 font-bold ${row.eColor}`}>{row.error}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.time}</td>
                    <td className="px-6 py-4">
                      <span className={`${row.sColor} px-3 py-1 rounded-full text-[12px] font-bold`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI & Student Breakdown */}
        <div className="space-y-6">
          {/* AI Recommendation Box */}
          <div className="bg-primary-container text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <span className="material-symbols-outlined text-[120px]">psychology</span>
            </div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className="material-symbols-outlined text-secondary-fixed">auto_awesome</span>
              <h3 className="font-headline-sm text-headline-sm">Rekomendasi Strategi</h3>
            </div>
            <p className="text-body-sm leading-relaxed mb-4 opacity-90 relative z-10">
              Berdasarkan data 30 hari terakhir, topik <strong className="text-secondary-fixed">{selectedTopic}</strong> menunjukkan retensi perlu perhatian. Disarankan untuk memperbanyak latihan soal penalaran logis dan berikan sesi <span className="underline">live review</span> khusus topik ini.
            </p>
            <button className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:bg-secondary-fixed transition-colors relative z-10">
              Buat Modul Remedial
            </button>
          </div>

          {/* Student Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Siswa Paling Berisiko</h3>
            <p className="text-body-sm text-on-surface-variant mb-6 italic">Topik terpilih: {selectedTopic}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">BW</div>
                <div className="flex-1">
                  <p className="font-bold text-body-md text-primary">Bambang Wijaya</p>
                  <p className="text-body-sm text-on-surface-variant">Skor: 42/100</p>
                </div>
                <span className="text-error-red font-bold">-24%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">SA</div>
                <div className="flex-1">
                  <p className="font-bold text-body-md text-primary">Siti Aminah</p>
                  <p className="text-body-sm text-on-surface-variant">Skor: 48/100</p>
                </div>
                <span className="text-error-red font-bold">-18%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">DK</div>
                <div className="flex-1">
                  <p className="font-bold text-body-md text-primary">Doni Kusuma</p>
                  <p className="text-body-sm text-on-surface-variant">Skor: 51/100</p>
                </div>
                <span className="text-warning-orange font-bold">-12%</span>
              </div>
            </div>
            
            <button className="w-full mt-6 text-secondary font-bold text-body-sm hover:underline">
              Lihat Semua Siswa (42)
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
