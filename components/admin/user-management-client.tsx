'use client'

import { useState, useRef } from 'react'

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filter, setFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true
    if (filter === 'Siswa') return u.role === 'user'
    if (filter === 'Instruktur') return u.role === 'instructor'
    if (filter === 'Staff') return u.role === 'admin'
    return true
  })

  // Add User Logic
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        setUsers([result.data, ...users])
        setIsAddModalOpen(false)
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert('Error saving user')
    }
    setIsLoading(false)
  }

  const handleDeleteUser = async (id: string) => {
    if(!confirm('Anda yakin ingin menghapus pengguna ini secara permanen?')) return
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      if(res.ok) {
        setUsers(users.filter(u => u.id !== id))
      }
    } catch(err) {
      alert('Gagal menghapus pengguna')
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    const header = ['ID', 'Nama', 'Email', 'Role', 'Tanggal Daftar'].join(',')
    const rows = users.map(u => 
      [u.id, `"${u.name}"`, `"${u.email}"`, u.role, new Date(u.createdAt).toISOString()].join(',')
    )
    const csvContent = [header, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'users_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const rows = text.split('\n').filter(r => r.trim() !== '')
      if(rows.length < 2) return alert('File CSV kosong atau format tidak valid')
      
      let successCount = 0
      setIsLoading(true)
      
      for(let i=1; i<rows.length; i++) {
        const cols = rows[i].split(',')
        if(cols.length < 3) continue
        
        const payload = {
          name: cols[0].replace(/"/g, '').trim(),
          email: cols[1].replace(/"/g, '').trim(),
          password: cols[2].replace(/"/g, '').trim(),
          role: cols[3] ? cols[3].replace(/"/g, '').trim() : 'user'
        }
        
        try {
          const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          const r = await res.json()
          if(r.success) {
            successCount++
            setUsers(prev => [r.data, ...prev])
          }
        } catch(e) {
          console.error(e)
        }
      }
      setIsLoading(false)
      alert(`Berhasil mengimpor ${successCount} pengguna baru dari CSV!`)
      if(fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <>
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h4 className="font-headline-sm text-headline-sm text-primary">Manajemen Pengguna Cepat</h4>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
          <button onClick={() => fileInputRef.current?.click()} className="bg-surface-container-high text-on-surface-variant font-semibold px-4 py-1.5 rounded-lg text-label-md hover:bg-primary hover:text-white transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Import CSV
          </button>
          <button onClick={handleExportCSV} className="bg-surface-container-high text-on-surface-variant font-semibold px-4 py-1.5 rounded-lg text-label-md hover:bg-primary hover:text-white transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-secondary text-white font-semibold px-4 py-1.5 rounded-lg text-label-md hover:shadow-md transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Tambah Baru
          </button>
        </div>
      </div>
      
      <div className="p-6 bg-surface-container-low flex gap-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-label-md font-semibold transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-primary-container'}`}>Semua</button>
        <button onClick={() => setFilter('Siswa')} className={`px-4 py-1 rounded-full text-label-md font-semibold transition-colors ${filter === 'Siswa' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-primary-container'}`}>Siswa</button>
        <button onClick={() => setFilter('Instruktur')} className={`px-4 py-1 rounded-full text-label-md font-semibold transition-colors ${filter === 'Instruktur' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-primary-container'}`}>Instruktur</button>
        <button onClick={() => setFilter('Staff')} className={`px-4 py-1 rounded-full text-label-md font-semibold transition-colors ${filter === 'Staff' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-primary-container'}`}>Staff</button>
      </div>
      
      <div className="overflow-x-auto relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <table className="w-full text-left">
          <thead className="bg-surface-container text-on-surface-variant text-label-md border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4">Nama Pengguna</th>
              <th className="px-6 py-4">Peran</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Didaftarkan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredUsers.length === 0 && (
               <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">Tidak ada pengguna ditemukan</td></tr>
            )}
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs">
                    {u.name?.substring(0,2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary font-bold">{u.name || 'User'}</p>
                    <p className="text-[10px] text-outline">{u.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-body-sm text-on-surface-variant capitalize">{u.role === 'admin' ? 'Admin' : u.role}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-green-50 text-success-green text-[10px] font-bold rounded uppercase border border-success-green/20">Aktif</span>
                </td>
                <td className="px-6 py-4 text-body-sm text-outline">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteUser(u.id)} className="p-1 rounded bg-error-container/30 text-error-red hover:bg-error-red hover:text-white transition-colors" title="Hapus Pengguna">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-sm text-primary">Tambah Pengguna Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-label-md mb-1">Nama Lengkap</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
              </div>
              <div>
                <label className="block text-label-md mb-1">Email</label>
                <input required name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary outline-none" />
              </div>
              <div>
                <label className="block text-label-md mb-1">Kata Sandi</label>
                <input required name="password" type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary outline-none" minLength={6} />
              </div>
              <div>
                <label className="block text-label-md mb-1">Peran Akses</label>
                <select name="role" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary outline-none">
                  <option value="user">Siswa</option>
                  <option value="instructor">Instruktur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg">Batal</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-container disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
