"use client"

import React, { useState } from 'react'

export default function AuditLogsPage() {
  const [securityMode, setSecurityMode] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const toggleRow = (index: number) => {
    if (expandedRow === index) {
      setExpandedRow(null)
    } else {
      setExpandedRow(index)
    }
  }

  const logs = [
    {
      date: '24 Okt 2023',
      time: '14:22:10 WIB',
      user: { name: 'Ahmad Subardjo', role: 'Mahasiswa', initials: 'AS', color: 'bg-primary-container text-on-primary-container' },
      action: 'Gagal login 5x berturut-turut',
      module: 'Authenticator',
      moduleIcon: 'security',
      status: 'Gagal',
      statusType: 'critical',
      ip: '192.168.1.45',
      browser: 'Chrome (Windows)'
    },
    {
      date: '24 Okt 2023',
      time: '13:05:44 WIB',
      user: { name: 'Dr. Siti Aminah', role: 'Instruktur', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi3MBToJ1TkQegJhlErxbkgj5Lyp9H6x-sWAtFw-E_MqdsfDSMQDIANOk5JQ8v5v067kxel2c1vvar-VZz9CN134bUsE_t-YA9XFR48pOoIKGC35cnFX3zvXzZmngu6mN6fvVWbhumJS8m8odhAqJkhfpWLTEPSpWTLoolOawggaJYvReC5SR1XGNK6yhVdnzZzRgaNTebn3_k2JI8mshFFYo7A3kACuRSUJVff8r9QrRsvWgyEmvkVvflWRf8I8g4VpPtceowx95j' },
      action: 'Mengubah bobot nilai ujian',
      module: 'Tryout CPNS #4',
      moduleIcon: 'grade',
      status: 'Sensitif',
      statusType: 'warning',
      ip: '103.22.1.12',
      browser: 'Safari (macOS)'
    },
    {
      date: '24 Okt 2023',
      time: '12:15:00 WIB',
      user: { name: 'Raka Putra', role: 'Administrator', initials: 'RP', color: 'bg-secondary-container text-white' },
      action: 'Menambah akun pengguna baru',
      module: 'RBAC System',
      moduleIcon: 'person_add',
      status: 'Berhasil',
      statusType: 'success',
      ip: '180.244.11.9',
      browser: 'Firefox (Linux)'
    }
  ]

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Header & Audit Tools */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Log Audit & Aktivitas</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Pantau seluruh jejak digital dan perubahan sistem secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-outline-variant rounded-lg p-1 shadow-sm">
            <span className="px-3 py-1 text-label-md font-label-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              Security Mode
            </span>
            <button 
              className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${securityMode ? 'bg-success-green' : 'bg-outline-variant'}`} 
              onClick={() => setSecurityMode(!securityMode)}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${securityMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <button className="bg-white border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low flex items-center gap-2 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Ekspor Log
          </button>
        </div>
      </div>

      {/* Advanced Filters Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant">
          <label className="text-label-md font-label-md text-outline block mb-2">Rentang Waktu</label>
          <div className="flex items-center gap-2 text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
            <select className="w-full bg-transparent border-none focus:ring-0 outline-none">
              <option>24 Jam Terakhir</option>
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>Kustom...</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant">
          <label className="text-label-md font-label-md text-outline block mb-2">Peran Pengguna</label>
          <div className="flex items-center gap-2 text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
            <select className="w-full bg-transparent border-none focus:ring-0 outline-none">
              <option>Semua Peran</option>
              <option>Administrator</option>
              <option>Instruktur</option>
              <option>Mahasiswa/Siswa</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant">
          <label className="text-label-md font-label-md text-outline block mb-2">Tipe Aktivitas</label>
          <div className="flex items-center gap-2 text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
            <select className="w-full bg-transparent border-none focus:ring-0 outline-none">
              <option>Semua Aktivitas</option>
              <option>Login/Logout</option>
              <option>Perubahan Pengaturan</option>
              <option>Input Nilai</option>
              <option>Manajemen Soal</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant">
          <label className="text-label-md font-label-md text-outline block mb-2">Tingkat Bahaya</label>
          <div className="flex items-center gap-2 text-body-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">report</span>
            <select className="w-full bg-transparent border-none focus:ring-0 outline-none">
              <option>Semua Level</option>
              <option>Info (Normal)</option>
              <option>Warning (Sensitif)</option>
              <option>Critical (Keamanan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Waktu & Tanggal</th>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Aksi & Modul</th>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Meta</th>
                <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {logs.map((log, index) => (
                <React.Fragment key={index}>
                  <tr 
                    className={`hover:bg-surface-container-lowest transition-colors cursor-pointer ${
                      securityMode && log.statusType === 'critical' ? 'bg-error-container/20 ring-2 ring-error-red/50' : 
                      log.statusType === 'critical' ? 'bg-error-container/10' : ''
                    }`}
                    onClick={() => toggleRow(index)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-body-sm text-body-sm font-semibold text-on-surface">{log.date}</p>
                      <p className="text-[12px] text-outline">{log.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {log.user.img ? (
                          <img alt="User" className="w-8 h-8 rounded-full object-cover" src={log.user.img} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${log.user.color}`}>
                            {log.user.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-body-sm text-body-sm font-medium">{log.user.name}</p>
                          <p className="text-[10px] text-outline uppercase">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body-sm text-body-sm">{log.action}</p>
                      <p className="text-[10px] text-primary flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[12px]">{log.moduleIcon}</span> {log.module}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {log.statusType === 'critical' && (
                        <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight flex items-center w-fit gap-1">
                          <span className="material-symbols-outlined text-[14px]">dangerous</span> {log.status}
                        </span>
                      )}
                      {log.statusType === 'warning' && (
                        <span className="bg-warning-orange/10 text-warning-orange px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight flex items-center w-fit gap-1 border border-warning-orange/20">
                          <span className="material-symbols-outlined text-[14px]">warning</span> {log.status}
                        </span>
                      )}
                      {log.statusType === 'success' && (
                        <span className="bg-success-green/10 text-success-green px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight flex items-center w-fit gap-1 border border-success-green/20">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> {log.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-mono text-outline">{log.ip}</p>
                      <p className="text-[10px] text-outline">{log.browser}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors">
                        <span className="material-symbols-outlined">
                          {expandedRow === index ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </td>
                  </tr>

                  {/* Sub-activity Row (Expanded Mockup) */}
                  {expandedRow === index && (
                    <tr className="bg-surface-container-low border-l-4 border-primary">
                      <td className="px-10 py-6" colSpan={6}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="font-label-md text-label-md text-primary uppercase font-bold">Detail Perubahan Data</h4>
                            <div className="bg-white p-4 rounded-lg border border-outline-variant font-mono text-[12px] space-y-2">
                              <div className="flex justify-between">
                                <span className="text-outline">Status Sebelumnya:</span>
                                <span className="text-error-red">Inactive</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-outline">Status Baru:</span>
                                <span className="text-success-green">Active</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-outline">Izin Akses:</span>
                                <span className="text-on-surface">['READ_EXAM', 'WRITE_EXAM', 'MANAGE_USERS']</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-label-md text-label-md text-primary uppercase font-bold">Metadata Sesi</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] text-outline uppercase mb-1">Session ID</p>
                                <p className="text-body-sm font-medium">sess_9921_ax02931</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-outline uppercase mb-1">Lokasi Perkiraan</p>
                                <p className="text-body-sm font-medium">Jakarta, Indonesia</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-outline uppercase mb-1">Provider Internet</p>
                                <p className="text-body-sm font-medium">PT Telkom Indonesia</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-outline uppercase mb-1">Metode Auth</p>
                                <p className="text-body-sm font-medium">SSO Google Workspace</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
          <p className="text-body-sm text-on-surface-variant">Menampilkan <span className="font-bold">1-10</span> dari <span className="font-bold">1,245</span> aktivitas</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold text-on-surface-variant">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold text-on-surface-variant">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant bg-white hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
