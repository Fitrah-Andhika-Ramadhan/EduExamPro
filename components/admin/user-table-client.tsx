'use client'

import { useState } from 'react'
import { Search, Trash2, UserCog, User, AlertCircle, CheckCircle2, Download, Plus, X, Edit } from 'lucide-react'
import { deleteUser, updateUserRole, createUser, updateUser } from '@/app/actions/admin'
import { exportUsersAction } from '@/app/actions/export'

function downloadBase64(base64: string, filename: string) {
  const link = document.createElement('a')
  link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

type UserData = {
  id: string
  name: string | null
  email: string
  role: string | null
  plan: string | null
  createdAt: Date | null
}

type ModalState = 
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; user: UserData }

export default function UserTableClient({ initialUsers, currentAdminId }: { initialUsers: UserData[], currentAdminId: string }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' as 'admin'|'user', plan: 'free' as 'free'|'pro' })

  const showMsg = (type: 'success'|'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const openCreate = () => {
    setFormData({ name: '', email: '', password: '', role: 'user', plan: 'free' })
    setModal({ type: 'create' })
  }

  const openEdit = (u: UserData) => {
    setFormData({ name: u.name || '', email: u.email, password: '', role: (u.role as any) || 'user', plan: (u.plan as any) || 'free' })
    setModal({ type: 'edit', user: u })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await createUser(formData)
    if (res.success) {
      // Refresh by adding placeholder – page will revalidate on next nav
      showMsg('success', res.message)
      setModal({ type: 'none' })
      window.location.reload()
    } else {
      showMsg('error', res.message)
    }
    setIsLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (modal.type !== 'edit') return
    setIsLoading(true)
    const res = await updateUser(modal.user.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      plan: formData.plan,
      newPassword: formData.password || undefined,
    })
    if (res.success) {
      setUsers(users.map(u => u.id === modal.user.id 
        ? { ...u, name: formData.name, email: formData.email, role: formData.role, plan: formData.plan } 
        : u
      ))
      showMsg('success', res.message)
      setModal({ type: 'none' })
    } else {
      showMsg('error', res.message)
    }
    setIsLoading(false)
  }

  const handleRoleChange = async (userId: string, currentRole: string) => {
    if (userId === currentAdminId) { showMsg('error', 'Tidak bisa mengubah role akun sendiri'); return }
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    setIsLoading(true)
    const res = await updateUserRole(userId, newRole)
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      showMsg('success', res.message)
    } else { showMsg('error', res.message) }
    setIsLoading(false)
  }

  const handleDelete = async (userId: string) => {
    if (userId === currentAdminId) { showMsg('error', 'Tidak bisa menghapus akun sendiri'); return }
    if (confirm('Yakin ingin menghapus pengguna ini secara permanen?')) {
      setIsLoading(true)
      const res = await deleteUser(userId)
      if (res.success) {
        setUsers(users.filter(u => u.id !== userId))
        showMsg('success', res.message)
      } else { showMsg('error', res.message) }
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await exportUsersAction()
      if (res.success && res.data) {
        downloadBase64(res.data, res.filename)
        showMsg('success', 'File Excel berhasil diunduh')
      }
    } catch { showMsg('error', 'Gagal mengekspor data') }
    setIsExporting(false)
  }

  const FormModal = () => (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-surface-container-low rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
            {modal.type === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
          </h3>
          <button onClick={() => setModal({ type: 'none' })} className="text-on-surface-variant hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={modal.type === 'create' ? handleCreate : handleUpdate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Nama Lengkap</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Nama Lengkap" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="email@contoh.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              {modal.type === 'edit' ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
            </label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              required={modal.type === 'create'} minLength={modal.type === 'create' ? 8 : 0}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Min. 8 karakter" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Peran</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Paket</label>
              <select value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value as any})}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ type: 'none' })}
              className="flex-1 py-2.5 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Batal
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? 'Menyimpan...' : modal.type === 'create' ? 'Buat Pengguna' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {modal.type !== 'none' && <FormModal />}

      <div className="bg-canvas rounded-xl border border-hairline overflow-hidden">
        <div className="p-4 md:p-6 border-b border-hairline flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-canvas-cream/50">
          <h2 className="heading-md text-ink shrink-0">Daftar Pengguna ({users.length})</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-ink-mute absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari email atau nama..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-56 bg-canvas border border-hairline rounded-lg text-sm focus:outline-none focus:border-primary" />
            </div>
            <button onClick={handleExport} disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 bg-canvas border border-hairline rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" />
              {isExporting ? 'Mengekspor...' : 'Export Excel'}
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </div>
        
        {message && (
          <div className={`m-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
            message.type === 'success' ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-canvas-cream">
                <th className="p-4 body-strong text-ink">Nama Lengkap</th>
                <th className="p-4 body-strong text-ink">Email</th>
                <th className="p-4 body-strong text-ink">Peran</th>
                <th className="p-4 body-strong text-ink">Paket</th>
                <th className="p-4 body-strong text-ink">Terdaftar</th>
                <th className="p-4 body-strong text-ink text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-ink-mute body-md">Pengguna tidak ditemukan.</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className={`border-b border-hairline hover:bg-canvas-cream/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td className="p-4">
                      <div className="font-semibold text-ink">{u.name || 'Tanpa Nama'}</div>
                    </td>
                    <td className="p-4 text-ink-mute text-sm">{u.email}</td>
                    <td className="p-4">
                      <button onClick={() => handleRoleChange(u.id, u.role || 'user')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${
                          u.role === 'admin' ? 'bg-surface-aubergine text-on-primary' : 'bg-canvas-lavender text-primary'
                        }`} title="Klik untuk mengubah Role">
                        {u.role === 'admin' ? <UserCog className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {u.role}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.plan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.plan?.toUpperCase() || 'FREE'}
                      </span>
                    </td>
                    <td className="p-4 text-ink-mute text-sm">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="text-primary hover:opacity-70 transition-opacity" title="Edit Pengguna">
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="text-semantic-error hover:opacity-70 transition-opacity" title="Hapus Pengguna">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
